# 에러 핸들링 및 로깅 아키텍처 개선 계획서

본 문서는 Next.js 환경에서 발생하는 예외 상황을 완벽하게 모니터링하고, 보안 및 장애에 기민하게 대응하기 위한 에러 핸들링 및 중앙 집중식 로깅 체계 개선 계획을 다룹니다.

---

## 1. 배경 및 문제 의식

기존 시스템은 에러 발생 시 데이터베이스 접근 계층(Repository) 등 하위 레이어에서 개별적으로 `logError`를 호출하여 로깅을 수행하고 있었습니다. 이 방식은 두 가지 큰 한계를 가집니다.

1. **맥락 소실 (Context Loss)**: 저수준 계층은 요청 URL이나 사용자 정보를 알 수 없어, 디스코드 로그에 호출 인자(ID 등)만 남고 "어떤 요청에서 유발되었는지" 알 수 없습니다.
2. **프레임워크 에러 탐지 불가**: Next.js 1MB 페이로드 한계 초과나 페이지 렌더링(RSC) 중 발생하는 프레임워크 수준의 에러는 코드 내부에서 캐치하지 못해 서버 콘솔에만 찍히고 모니터링 알림(디스코드)이 누락됩니다.

---

## 2. 지향하는 에러 핸들링 흐름 (Architecture)

에러 발생 지점의 특성에 맞게 역할을 분리하고 최상위에서 수집하여 로깅합니다.

```mermaid
graph TD
    A[DB / 스토리지 작업 에러] -->|1. 단순 throw (로깅 안 함)| B[서버 액션 / API 라우트]
    B -->|2. try-catch 캐치| C[logError 호출]
    C -->|3. 상세 비즈니스 데이터 결합| D[디스코드 / APM 로깅]

    E[Next.js 자체 제한 위반 / RSC 렌더링 에러] -->|1. B를 통과해 바로 최상위로| F[instrumentation.ts (글로벌 훅)]
    F -->|2. HTTP Request Context 동적 주입| C
```

---

## 3. 세부 개선 계획 및 단계별 태스크

### 1단계: 레포지토리 레이어 로깅 제거 및 에러 전파

- **목표**: 하위 계층에서 중복 및 맥락 없는 로깅을 중단하고 상위로 전파합니다.
- **태스크**:
  - `src/server/repositories/` 내의 파일들에서 DB 에러 발생 시 `logError`를 호출하는 코드를 제거합니다.
  - 별도의 처리가 필요 없다면 `try-catch` 블록을 아예 제거(생략)하여 상위로 자동 전파시킵니다.
  - > [!NOTE]  
    > 하위 계층(레포지토리)에서 `try-catch`를 사용하는 유일한 경우는 로우 레벨 에러 객체를 비즈니스적으로 식별하기 쉬운 **커스텀 에러 객체로 변환(Wrapping)**하여 위로 던질 때뿐입니다.

#### 💡 커스텀 에러 변환(Wrapping) 주요 시나리오 및 예시

데이터베이스의 불친절한 원본 에러 코드나 상태를 상위 레이어(서버 액션 등)에서 보다 쉽게 다루기 위해 다음과 같이 변환하여 상위로 전달합니다.

1. **시나리오 1: 중복 데이터 예외 (`DuplicateProjectTitleError` 등)**
   - **설명**: 중복 가입이나 이미 등록된 고유 데이터를 재생성하려고 시도할 때 발생합니다.
   - **레포지토리 구현**: Supabase(PostgreSQL) 고유 에러 코드(`23505`)를 가로채 커스텀 에러로 변환합니다.
     ```typescript
     try {
       await supabase.from("projects").insert(...);
     } catch (dbError) {
       if (dbError.code === "23505") {
         throw new DuplicateProjectTitleError("이미 등록된 프로젝트 이름입니다.");
       }
       throw dbError; // 다른 에러는 그대로 전파
     }
     ```
   - **서버 액션 구현**: DB 코드를 파싱할 필요 없이 `instanceof`로 깔끔하게 화면 경고창 문구로 매핑합니다.
     ```typescript
     if (error instanceof DuplicateProjectTitleError) {
       return { success: false, error: error.message };
     }
     ```

2. **시나리오 2: 데이터 미존재 예외 (`ProjectNotFoundError` 등)**
   - **설명**: 특정 ID로 조회를 시도했으나 값이 비어있는 경우, 상위 레이어의 수동 널 검사(`if (!data)`) 대신 예외 처리를 유도합니다.
   - **레포지토리 구현**:
     ```typescript
     const { data } = await supabase.from("projects").select().eq("id", id).single();
     if (!data) {
       throw new ProjectNotFoundError(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
     }
     return data;
     ```

3. **시나리오 3: 비정상 권한 예외 (`ForbiddenAccessError` 등)**
   - **설명**: 타인의 데이터나 비공개 정보 영역에 비정상 경로로 접근하여 Supabase RLS 정책에 의해 차단되었을 때 발생합니다.
   - **레포지토리 구현**:
     ```typescript
     try {
       // RLS 정책에 의해 접근 실패 시 커스텀 에러로 래핑
       await supabase.from("private_reviews").update(...);
     } catch (error) {
       throw new ForbiddenAccessError("해당 데이터에 대한 수정 권한이 없습니다.");
     }
     ```

### 2단계: 최상위 로깅 유틸리티 보완 (logger.ts)

- **목표**: 에러 로깅 함수 실행 시, Next.js의 동적 헤더 수집 기능을 이용해 현재 HTTP Request 정보를 자동 수집합니다.
- **태스크**:
  - `logError` 함수 내부에서 `next/headers`의 `headers()` API를 호출하여 웹 요청의 `referer`, `host`, `user-agent` 등을 확보합니다.
  - 빌드 타임이나 웹 요청 외부(Cron, Setup)에서의 호출로 인한 예외를 방어하기 위해 `try-catch`로 래핑하여 안전하게 정보가 포함되도록 구현합니다.

```typescript
// 개선된 logger.ts 예시
import { headers } from "next/headers";

export function logError(context: string, error: unknown, payload?: unknown) {
  // ... 기존 콘솔 및 디스코드 Embed 생성 ...

  try {
    const headerList = headers();
    const referer = headerList.get("referer"); // 이전 주소 (요청 시작 경로)
    const userAgent = headerList.get("user-agent");

    embed.fields.push({
      name: "웹 요청 맥락 (Request Context)",
      value: `\`\`\`yaml\nReferer: ${referer}\nUser-Agent: ${userAgent}\n\`\`\``,
    });
  } catch {
    // Request Context가 없는 배치 작업 등의 환경 방어
  }

  // sendToDiscord(webhookUrl, embed);
}
```

### 3단계: 글로벌 모니터링 그물망 (instrumentation.ts) 활성화

- **목표**: 최상위로 통과하는 프레임워크 레벨의 모든 미처리 예외(413, 500 등)를 강제 수집합니다.
- **태스크**:
  - `src/instrumentation.ts` 파일을 생성합니다.
  - `onRequestError` 훅을 구현하여 서버 런타임에 누락되어 터지는 모든 에러를 포착하고, 에러 스택과 요청 경로 정보를 자동으로 수집하여 logger.ts의 `logError`로 보냅니다.

```typescript
// src/instrumentation.ts 예시
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: "pages" | "app" },
) {
  const { logError } = await import("@/server/logger");
  logError(`Framework.${context.routerKind}`, err, {
    path: request.path,
    method: request.method,
    headers: request.headers,
  });
}
```

### 4단계: 글로벌 에러 바운더리 화면 구성 (app/error.tsx)

- **목표**: 서버 컴포넌트 렌더링 등 중단 시 사용자에게 하얀 화면 대신 정중한 안내 화면을 표시합니다.
- **태스크**:
  - `src/app/error.tsx` 공통 파일 구현.
  - 모던 UI 컴포넌트를 제공하여 "일시적인 오류가 발생했습니다. 홈으로 이동하거나 새로고침 해주세요" 등의 메세지와 함께 재시도 기능 구현.

---

## 4. 개선 전/후 디스코드 알림 예시 비교

| 구분            | 개선 전                                                    | 개선 후 (적용 완료 시)                                                            |
| :-------------- | :--------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **발생 위치**   | `SupabaseProjectRepository.getById`                        | `admin.projects.updateProject` (또는 `Framework.app` 글로벌 에러)                 |
| **에러 메시지** | `JWT issued at future`                                     | `JWT issued at future`                                                            |
| **페이로드**    | `{"id": "7f998a..."}`                                      | `{"id": "7f998a...", "adminId": "kakao_12345"}`                                   |
| **요청 맥락**   | _알 수 없음_                                               | `Referer: https://.../admin/projects/7f998a.../edit`<br>`User-Agent: Mozilla/...` |
| **조치 난이도** | 로그만 보고 어떤 화면인지 직접 소스코드를 뒤져 추적해야 함 | **사용자가 관리자 프로젝트 수정 화면을 누르다 실패했음을 즉시 인지 가능**         |

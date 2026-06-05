# Code Style Guide

ESLint + Prettier로 대부분 자동 적용됨. 이 문서는 자동화되지 않는 판단 기준을 기록한다.

---

## 함수

### 컴포넌트: function 선언문

```tsx
export default function ProjectsPage() {
  return <main>...</main>;
}

export function DeleteButton({ id }: { id: string }) {
  return <button>삭제</button>;
}
```

### Server Action: function 선언문

```ts
"use server";

export async function createProject(formData: FormData) {
  // ...
}
```

### 그 외 모두: arrow function

```ts
// 유틸리티
export const compressImage = async (file: File): Promise<File> => {
  return imageCompression(file, OPTIONS);
};

// 헬퍼
const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("ko").format(new Date(date));
};

// 콜백
items.map((item) => item.id);

// 이벤트 핸들러
const handleSubmit = async (data: ProjectFormData) => {
  // ...
};
```

---

## Naming

| 대상             | 스타일           | 예시                                       |
| ---------------- | ---------------- | ------------------------------------------ |
| 컴포넌트         | PascalCase       | `ProjectForm`, `DeleteButton`              |
| 함수, 변수       | camelCase        | `getAll`, `imageUrls`                      |
| 상수             | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `CATEGORIES`              |
| 파일/폴더        | kebab-case       | `project-form.tsx`, `mock-repositories.ts` |
| 타입, 인터페이스 | PascalCase       | `Project`, `ProjectRepository`             |

- 인터페이스에 `I` 접두사 금지 (`IProject` ❌ → `Project` ✅)
- 약어는 단어 취급 (`loadHttpUrl` ✅, `loadHTTPURL` ❌)
- Boolean 변수/props: `is`, `has`, `should` 접두사 (`isLoading`, `hasError`)

---

## Imports

```ts
// ✅ named export/import 사용
export function ProjectForm() {}
import { ProjectForm } from "./project-form";

// ✅ 타입은 import type 사용
import type { Project } from "@/shared/types";

// ❌ default export 지양 (Next.js 페이지 컴포넌트 제외)
export default function Page() {} // 페이지만 허용

// ❌ namespace import 지양
import * as Utils from "./utils";
```

- Next.js 페이지/레이아웃만 `export default` 사용 (프레임워크 요구사항)
- 그 외 컴포넌트, 유틸리티, 타입은 모두 named export

> 🔧 `import type` — ESLint `@typescript-eslint/consistent-type-imports`로 강제됨

---

## 변수

```ts
// ✅ const 기본
const items = await projects.getAll();

// ✅ 재할당 필요할 때만 let
let retryCount = 0;
retryCount += 1;

// ❌ var 금지
```

> 🔧 ESLint `prefer-const`, `no-var`로 강제됨

---

## 제어문

### Early return 선호

```ts
// ✅
const getUser = async (id: string) => {
  const user = await db.find(id);
  if (!user) return null;
  if (!user.isActive) return null;
  return user;
};

// ❌ 중첩
const getUser = async (id: string) => {
  const user = await db.find(id);
  if (user) {
    if (user.isActive) {
      return user;
    }
  }
  return null;
};
```

### 엄격한 동등 비교

```ts
// ✅
if (status === "pending") {
}
if (value !== null) {
}

// ❌
if (status == "pending") {
}
```

> 🔧 ESLint `eqeqeq`로 강제됨

---

## 에러 처리

```ts
// ✅ Error 객체만 throw
throw new Error("생성에 실패했습니다.");

// ❌ 문자열 throw
throw "something went wrong";
```

---

## React/Next.js

### 컴포넌트 원칙

- 단일 책임: 하나의 컴포넌트는 하나의 역할
- 작게 유지: 200줄 넘으면 분리 검토
- Props는 interface로 정의

```tsx
// ✅
interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {}
```

### Server vs Client Component

- 기본은 Server Component (데이터 표시)
- `"use client"`는 상태/이벤트/브라우저 API 필요할 때만

### 주석

- 주석 처리된 코드 금지 (삭제하고 git에 맡기기)
- "왜"를 설명하는 주석만 남기기 ("무엇"은 코드가 설명)

```ts
// ✅ 이유 설명
// Firefox에서 fieldset에 flex/grid 적용 시 레이아웃 깨짐
<div className="grid grid-cols-2">

// ❌ 코드 반복
// 프로젝트 목록을 가져온다
const items = await projects.getAll();
```

### console.log

- 프로덕션 코드에 `console.log` 금지
- 디버깅용은 `console.warn`, `console.error`만 허용

> 🔧 ESLint `no-console`으로 경고됨 (warn/error는 허용)

---

## Tailwind CSS

- 인라인 `style` 속성 금지 (반응형 불가)
- 하드코딩 색상 금지 → design token 사용 (`text-navy`, `bg-accent`)

> 🔧 클래스 순서 — `prettier-plugin-tailwindcss`로 저장 시 자동 정렬됨

---

## TypeScript

- `any` 사용 금지

> 🔧 ESLint `@typescript-eslint/no-explicit-any`로 강제됨

---

## 의존성 추가 기준

- 직접 구현 가능한 간단한 기능이면 라이브러리 추가 금지
- 활발히 유지보수되고 널리 사용되는 패키지만
- 번들 크기 영향 고려 (lodash 전체 import 금지, tree-shakeable 선호)

---

## 매직 넘버/문자열 금지

의미 있는 숫자나 문자열은 반드시 상수로 선언한다.

```ts
// ❌
if (files.length > 10) {
}
const bucket = "projects";

// ✅
const MAX_UPLOAD_COUNT = 10;
const STORAGE_BUCKET = "projects";

if (files.length > MAX_UPLOAD_COUNT) {
}
```

### 상수 스코프

| 사용 범위                   | 위치                          | 예시                      |
| --------------------------- | ----------------------------- | ------------------------- |
| 여러 라우트/모듈에서 공용   | `shared/constants.ts`         | `MAX_FILE_SIZE`           |
| 한 라우트 내 여러 파일      | `_constants.ts` (라우트 로컬) | `FORM_KEYS`, `CATEGORIES` |
| 한 파일에서만 사용          | 파일 상단 `const`             | `STORAGE_PATH_PREFIX`     |
| 한 함수에서만 사용 (원시값) | 함수 내 정의 허용             | `const RETRY_COUNT = 3`   |

---

## 순수 함수 분리 + 테스트

서비스 로직(Server Action, API 핸들러)에서 **데이터 변환/검증/계산**은 순수 함수로 추출한다.

```ts
// ❌ Server Action 안에 로직 직접 작성
export async function updateProject(id: string, formData: FormData) {
  // ...URL 파싱 로직이 여기에 인라인...
}

// ✅ 순수 함수로 추출
// _utils.ts
export const extractStoragePath = (url: string): string | null => {
  const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
  return match?.[1] ?? null;
};

// _utils.test.ts
describe("extractStoragePath", () => {
  it("Supabase Storage URL에서 경로를 추출한다", () => {
    expect(
      extractStoragePath(
        "https://xxx.supabase.co/storage/v1/object/public/images/projects/abc.webp",
      ),
    ).toBe("projects/abc.webp");
  });
  it("잘못된 URL이면 null을 반환한다", () => {
    expect(extractStoragePath("https://example.com/image.png")).toBeNull();
  });
});
```

### 파일 네이밍

| 파일             | 역할                                                  |
| ---------------- | ----------------------------------------------------- |
| `_actions.ts`    | Server Action — 오케스트레이션만 (검증 → 호출 → 응답) |
| `_utils.ts`      | 순수 함수 (테스트 가능한 로직)                        |
| `_utils.test.ts` | 순수 함수 단위 테스트 (colocation)                    |
| `_constants.ts`  | 상수                                                  |

### 원칙

- Server Action은 **오케스트레이션만** 담당: 입력 검증 → 외부 호출 → 결과 반환
- 데이터 변환, URL 파싱, 비교 로직 등은 `_utils.ts`로 분리
- 순수 함수는 반드시 테스트 작성. 모든 분기(if/else, early return)를 커버

---

## 에러 처리

### Server Action 반환 패턴

```ts
// discriminated union — as const 필수
return { success: false as const, error: "메시지" };
return { success: true as const };
```

### 외부 호출 에러 처리

- DB/Storage 호출 실패: null 체크 또는 try-catch → 사용자 친화적 메시지 반환
- 실패해도 무방한 작업 (이미지 삭제 등): fire-and-forget 허용 (await 없이 호출)

```ts
// ✅ fire-and-forget — 실패해도 사용자 응답에 영향 없음
deleteImages(storage, removedImages);

// ✅ 반드시 성공해야 하는 작업 — await + 에러 처리
const result = await projects.create(data);
if (!result) return { success: false as const, error: "생성에 실패했습니다." };
```

### 클라이언트 에러 처리

- 외부 라이브러리 호출(이미지 압축 등): try-catch로 감싸고 사용자에게 메시지 표시
- 에러 원인별 분기가 불가능하면 일반 메시지로 충분

---

## 로깅

### 레벨 구분

| 함수       | 레벨     | Discord 채널        | 용도                              |
| ---------- | -------- | ------------------- | --------------------------------- |
| `logError` | 🔴 ERROR | 에러 채널 (알림 켬) | 시스템/DB 장애, 예상치 못한 예외  |
| `logWarn`  | 🟡 WARN  | 경고 채널 (알림 끔) | 비정상 접근, 권한 위반, 검증 실패 |

### 언제 무엇을 쓰는가

```ts
// 🔴 logError — 시스템이 정상 동작하지 않는 상황
logError("projects.create", error, { title, category });
// DB 쿼리 실패, Storage 업로드 실패, 외부 API 장애

// 🟡 logWarn — 시스템은 정상이나 비정상적인 요청
logWarn("admin.verifyAdmin", "관리자 권한 없는 접근 시도", { kakaoId });
// 미인증 접근, 다른 유저의 리소스 접근 시도, 만료된 토큰 사용
```

### context 네이밍 규칙

`도메인.함수명` 형식으로 발생 위치를 특정할 수 있게 작성.

```ts
logError("projects.create", error); // ✅
logError("reviews.submitReview", error); // ✅
logWarn("admin.verifyAdmin", "..."); // ✅

logError("error", error); // ❌ 위치 불명확
logError("failed", error); // ❌
```

### Server Action에서의 패턴

```ts
export async function createProject(formData: FormData) {
  try {
    // ... 비즈니스 로직
  } catch (error) {
    logError("projects.create", error, { title });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}
```

- `catch` 블록에서 `logError` 호출 후 사용자 친화적 메시지 반환
- 에러 객체 + payload(디버깅용 컨텍스트)를 함께 전달
- 사용자에게는 기술적 상세를 노출하지 않음

### Repository에서의 패턴

```ts
async getById(id: string) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) {
    logError("ProjectRepository.getById", error, { id });
    return null;
  }
  return data;
}
```

- Repository는 에러를 throw하지 않고 `null` 반환
- 로깅은 Repository 레벨에서 수행
- 호출자(Server Action)는 null 체크만 하면 됨

---

## 환경변수 관리

| 구분                 | 환경변수로                | 상수로                            |
| -------------------- | ------------------------- | --------------------------------- |
| 환경별로 달라지는 값 | ✅ DB URL, API 키, 버킷명 |                                   |
| 코드 구조적 값       |                           | ✅ Storage 경로 prefix, 폼 필드명 |
| 보안 민감 값         | ✅ 시크릿, 토큰           |                                   |

- `NEXT_PUBLIC_` prefix: 클라이언트에 노출 가능한 값만
- `.env.local.example`에 모든 환경변수 키 기록 (값은 placeholder)

---

## Dead Code 금지

- 사용처가 없는 코드(상수, 타입, 함수)를 작성하지 않는다
- 추후 사용 예정이면 사용 시점에 작성한다
- 미사용 import는 즉시 제거

---

## 미사용 변수

콜백 등에서 사용하지 않는 매개변수는 `_` prefix로 명시적 무시.

```ts
// ✅
const action = async (_prev: unknown, formData: FormData) => {};
items.map((_item, idx) => idx);

// ❌ 경고 무시
const action = async (prev: unknown, formData: FormData) => {}; // prev 미사용 경고
```

> 🔧 ESLint `@typescript-eslint/no-unused-vars` — `_` prefix 변수는 자동 무시됨

---

## non-null assertion(`!`) 금지

`!` 대신 `??` fallback 또는 타입 가드로 대체한다.

```ts
// ❌
const name = user!.name;

// ✅
const name = user?.name ?? "Unknown";

// ✅ 타입 가드
if (!user) return null;
const name = user.name; // 이 시점에서 user는 non-null
```

---

## 구현 체크리스트

코드 작성 시 아래 항목을 확인한다.

### 작성 전

- [ ] 기존 코드에 재사용 가능한 유틸/상수/타입이 있는지 확인했는가?
- [ ] 매직 넘버/문자열 없이 상수로 선언했는가?

### 작성 후

- [ ] 미사용 import/변수가 없는가?
- [ ] `any`, `!` (non-null assertion)을 사용하지 않았는가?
- [ ] 2곳 이상 중복되는 로직이 있으면 함수로 추출했는가?
- [ ] 순수 함수를 분리했고, 테스트를 작성했는가?
- [ ] 모든 분기(if/else, try/catch, early return)에 대응하는 테스트가 있는가?
- [ ] `pnpm build` + `pnpm lint` + `pnpm test` 통과하는가?

# AGENTS.md

## Non-Obvious Patterns

### 서버/클라이언트/공용 3분할

`server/`(DB, 시크릿), `client/`(브라우저 API), `shared/`(타입, 스키마). 폴더 경계를 넘는 import 금지.

```
client/ → server/ import ❌
server/ → client/ import ❌
shared/ → 양쪽에서 import ✅
```

### Repository 패턴 + Mock 자동 전환

`SUPABASE_URL` 미설정 시 Mock Repository로 자동 전환. DB 없이 개발/빌드 가능.

```ts
// 서버에서 데이터 접근 시 항상 이 패턴:
const { projects, storage } = await getServerRepositories();
const items = await projects.getAll();
```

클라이언트에서 DB 직접 접근 절대 금지. Server Component 또는 Server Action에서만.

### 폼 처리

- 사용자 대면 폼: react-hook-form + zodResolver (실시간 클라이언트 검증)
- 관리자 폼: react-hook-form + zodResolver + Server Action 호출
- 스키마는 `src/shared/schemas.ts`에 정의
- `<fieldset>`에 직접 grid/flex 금지 (Firefox 버그) → `<div>` 래퍼 사용

### 인증

- 카카오 로그인 → `ADMIN_KAKAO_IDS` 환경변수로 관리자 판단 (DB 불필요)
- `/admin/*` 경로는 `proxy.ts` middleware로 보호

## Conventions

- 시멘틱 HTML 필수 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`). `<div>` 남용 금지.
- 컴포넌트: `function` 선언문. Server Action: `function` 선언문. 그 외 함수: arrow function.
- named export 기본. `export default`는 Next.js 페이지/레이아웃만.
- 라우트별 서버 로직은 `_actions.ts`, 클라이언트 컴포넌트는 `_components/`에 배치.
- 라우트별 상수는 `_constants.ts`, 순수 함수는 `_utils.ts` + `_utils.test.ts`에 배치.
- Server Action은 오케스트레이션만. 데이터 변환/검증은 `_utils.ts`로 분리하여 테스트.
- Design tokens: `text-navy`, `bg-navy`, `text-accent`, `bg-accent`, `text-gray-dark`, `bg-gray-light`
- 컴포넌트 및 로직 모듈화 (금지 제약 중심):
  - **인라인 비대화 금지**: 부모 컴포넌트 내부(렌더링 블록)에 하위 마크업(예: 리스트 아이템 카드, 마법사의 개별 단계, 확대 모달 돔 등)을 직접 인라인으로 작성하지 않는다. 독립적으로 추상화할 수 있는 모든 UI 영역은 지체 없이 별도 서브 컴포넌트로 분리한다.
  - **다목적 컴포넌트 방치 금지**: 하나의 컴포넌트가 UI 레이아웃 렌더링, 복잡한 상태 관리, API 호출, 데이터 유효성 검사 등 여러 역할을 모두 독점하게 두지 않는다. 복잡한 데이터 변환 및 순수 함수 로직은 반드시 `_utils.ts`로 분리하며, 상태 관리와 데이터 페칭 로직이 복잡해질 경우 커스텀 훅으로 추출한다.
  - **동일 기능 재구현 금지**: 공용으로 추상화된 컴포넌트나 커스텀 훅이 이미 존재한다면, 개별 컴포넌트 내부에서 유사한 돔(DOM) 구조나 상태 제어 로직(예: 이미지 확대용 라이트박스 돔 직접 그리기 등)을 자체적으로 재구현하지 않는다.
  - **불필요한 useState 오남용 금지**:
    - 사용자 타이핑에 따라 잦은 리렌더링이 발생하는 상태(예: 상세 주소, 특이사항 입력 등)를 최상위 부모 컴포넌트의 상태로 두지 않는다. 반드시 서브 컴포넌트 내부로 격리하여 부모 전체 리렌더링을 방지한다.
    - 제출 시점에만 최종적으로 필요한 값(예: AI 프롬프트 분석용 특이사항 등)에 `useState`를 사용하지 않는다. 대신 `useRef`를 사용하여 실시간 리렌더링 횟수를 0회로 통제한다.
- 매직 넘버/문자열 금지. 의미 있는 값은 상수로 선언.
- 코드 수정 전 기존 상수/유틸/타입을 먼저 탐색. 이미 있는 것을 새로 만들지 않는다.
- 테스트:
  - 순수 함수 (`_utils.ts`): 모든 분기 단위 테스트 작성.
  - Server Action (`_actions.ts`): 모든 분기 통합 테스트 작성.
  - Zod 스키마 추가/수정 시: `schemas.test.ts`에 유효/무효 케이스 추가.
  - 테스트 파일 위치: 소스 옆 colocation.
  - 공용 mock 헬퍼: `src/test-helpers/` 사용.
- 세부 코딩 스타일은 `docs/CODE_STYLE.md` 참조.

## Git

- `develop`에서 작업 → `origin/develop`에 push → `main`으로 `--no-ff` merge
- merge 커밋 메시지: 변경 내용 요약 (예: `Merge develop: 카카오 로그인 + shadcn/ui 도입`)
- push/merge는 사용자가 명시적으로 요청하기 전까지 실행 금지

## Boundaries

### ⚠️ 확인 후 진행

- 구조적 변경 (새 파일 생성, 아키텍처 변경, 의존성 추가): 사전 설명 → 컨펌 → 코딩
- 사소한 수정 (오타, import 정리, 기존 패턴 따르는 코드): 바로 진행
- 커밋은 항상 사용자 지시 후. 단위: 하나의 논리적 변경 또는 테스트 가능한 작은 단위
- 리뷰 반영 시: 문제 인식은 수용하되 해결 방법은 프로젝트 패턴에 맞게 판단. 제안 코드를 그대로 복사하지 않는다.
- 새 의존성 추가 (무료 플랜 제약 확인)
- DB 스키마 변경 (`db/schema.sql`)
- 환경변수 추가/변경

### 🚫 절대 금지

- `git reset --hard`, `git push --force`, `git clean -f`
- `.env.local` 시크릿 값 출력
- 외부 유료 서비스 추가
- `client/`에서 `server/` import
- Supabase Storage 1GB 초과 (이미지 반드시 압축)

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
- 컴포넌트 및 로직 모듈화:
  - 단일 책임 분리 (SRP): 한 파일의 라인 수가 비대해지는 것을 지양하며, 레포지토리는 도메인(테이블)별로 즉시 개별 분리합니다.
  - 서버 컴포넌트(Page) 경량화: page.tsx는 데이터 페칭 조율 및 조건 판단만 담당하고 분기 카드(에러, 로그인 등)는 서브 컴포넌트로 분리합니다.
  - 세부 컴포넌트 캡슐화: 클라이언트 폼 등에서 독자적인 UI 동작 영역은 하위 컴포넌트로 추출하여 비대해지지 않게 합니다.
  - 공통 훅 및 컴포넌트 추출: 둘 이상의 파일에서 중복되는 상태 변경 및 이벤트 제어 로직(예: 이미지 업로드 미리보기 및 삭제)은 공통 커스텀 훅(Custom Hook)과 공통 컴포넌트로 승격합니다.
- 매직 넘버/문자열 금지. 의미 있는 값은 상수로 선언.
- 코드 수정 전 기존 상수/유틸/타입을 먼저 탐색. 이미 있는 것을 새로 만들지 않는다.
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

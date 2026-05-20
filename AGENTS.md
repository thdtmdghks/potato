# AGENTS.md — 경산창호

경산창호 — 창호 시공 전문 업체 홈페이지. Next.js 16 풀스택, Supabase 백엔드, 모바일 최우선 원페이지 랜딩.

## Stack

- Next.js 16.2 (App Router) + TypeScript strict
- Tailwind CSS 4 + shadcn/ui (Base UI 기반)
- Supabase (PostgreSQL + Storage) — Repository 패턴 추상화
- Auth.js v5 (next-auth) — 카카오 로그인, 환경변수 화이트리스트 관리자
- react-hook-form 7 + zod 4 + @hookform/resolvers 5
- browser-image-compression (WebP, 최대 200KB)
- Package Manager: pnpm (npm/yarn 사용 금지)
- Test: Vitest + @testing-library/react
- Deploy: Vercel Hobby (무료)

## Non-Obvious Patterns

### 서버/클라이언트/공용 3분할

`server/`(DB, 시크릿), `client/`(브라우저 API), `shared/`(타입, 스키마). 폴더 경계를 넘는 import 금지.

```
client/ → server/ import ❌
server/ → client/ import ❌
shared/ → 양쪽에서 import ✅
```

### Repository 패턴 + Mock 자동 전환

`NEXT_PUBLIC_SUPABASE_URL` 미설정 시 Mock Repository로 자동 전환. DB 없이 개발/빌드 가능.

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
- 로그인 버튼 네비게이션 미노출 → `/admin` 직접 접근 시 로그인 유도

## Conventions

- 시멘틱 HTML 필수 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`). `<div>` 남용 금지.
- 컴포넌트: `function` 선언문. Server Action: `function` 선언문. 그 외 함수: arrow function.
- named export 기본. `export default`는 Next.js 페이지/레이아웃만.
- 라우트별 서버 로직은 `_actions.ts`, 클라이언트 컴포넌트는 `_components/`에 배치.
- 라우트별 상수는 `_constants.ts`, 순수 함수는 `_utils.ts` + `_utils.test.ts`에 배치.
- Server Action은 오케스트레이션만. 데이터 변환/검증은 `_utils.ts`로 분리하여 테스트.
- Design tokens: `text-navy`, `bg-navy`, `text-accent`, `bg-accent`, `text-gray-dark`, `bg-gray-light`
- 모든 UI에 `dark:` 변형 필수
- 모바일 최우선: base → `sm:` → `md:` → `lg:` 순서로 확장
- 이미지 업로드: 클라이언트에서 `compressImage()` 압축 후 서버로 전송

## Git

- `develop`에서 작업 → `origin/develop`에 push → `main`으로 `--no-ff` merge
- merge 커밋 메시지: 변경 내용 요약 (예: `Merge develop: 카카오 로그인 + shadcn/ui 도입`)
- push/merge는 사용자가 명시적으로 요청하기 전까지 실행 금지

## Boundaries

### ✅ 자유롭게 가능

- 파일 읽기, 디렉토리 탐색
- lint, format, test, build 실행

### ⚠️ 확인 후 진행

- 코드 작성/수정:
  1. 작업할 사항 설명 → 사용자 컨펌
  2. 코딩 → 사용자 리뷰
  3. 리뷰 반영 후 → 사용자가 커밋 지시
- 커밋 단위: 하나의 논리적 변경 또는 테스트 가능한 작은 단위
- 새 의존성 추가 (무료 플랜 제약 확인)
- DB 스키마 변경 (`db/schema.sql`)
- 환경변수 추가/변경

### 🚫 절대 금지

- `git reset --hard`, `git push --force`, `git clean -f`
- `.env.local` 시크릿 값 출력
- 외부 유료 서비스 추가
- `client/`에서 `server/` import
- Supabase Storage 1GB 초과 (이미지 반드시 압축)

## Key Files

- `src/app/_components/` — shadcn/ui 컴포넌트 (Input, Textarea, Label) + 프로젝트 공용 (ImageThumbnail)
- `src/app/(public)/page.tsx` — 원페이지 랜딩 (히어로→서비스→시공사례→강점→연락처)
- `src/app/admin/projects/_actions.ts` — 시공사례 CRUD Server Actions
- `src/server/repositories.ts` — Repository 인터페이스
- `src/server/index.ts` — `getServerRepositories()` 팩토리
- `src/shared/schemas.ts` — Zod 스키마
- `src/shared/types.ts` — DB 타입 정의
- `src/proxy.ts` — 관리자 인증 middleware
- `docs/NEXT-TASKS.md` — 다음 작업 가이드

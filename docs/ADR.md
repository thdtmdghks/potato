# Architecture Decision Records (ADR)

프로젝트 설계 과정에서 내린 주요 결정과 그 이유를 기록합니다.
동료 개발자가 "왜 이 기술을 선택했는지" 이해할 수 있도록 배경과 근거를 포함합니다.

---

## 기술 스택 선정 기록

### 프레임워크: Next.js 16 (App Router)

- **선정 이유**: Server Component로 클라이언트 JS 번들을 최소화하여 모바일 3G/LTE 환경 체감 속도 개선. SSR/SSG 혼합으로 공개 페이지는 정적 생성(CDN 서빙), 관리자 페이지는 동적 렌더링. Vercel에 zero-config 배포 가능.
- **대안**:
  - Remix — loader/action 패턴이 깔끔하나, Vercel 자체가 Next.js 제작사라 인프라 최적화(ISR, Edge 캐싱, 이미지 최적화 등)가 Next.js에 집중되어 있음. Remix on Vercel은 일부 기능(Incremental Static Regeneration 등)을 사용할 수 없음.
  - Astro — 정적 사이트에 최적이나, 관리자 CRUD처럼 클라이언트 상태가 많은 페이지에서는 React 아일랜드를 매번 명시해야 하고, Server Action/폼 처리 생태계가 Next.js 대비 미성숙. 공개 페이지만 있었다면 Astro가 더 나았을 수 있음.

### 언어: TypeScript 5

- **선정 이유**: Zod 스키마에서 타입을 추론하여 서버/클라이언트 간 타입 일관성 보장. IDE 자동완성으로 Supabase 쿼리 빌더, react-hook-form register 등에서 오타 방지. 2인 이하 소규모 프로젝트라도 컴파일 타임 검증이 디버깅 시간을 줄여줌.

### 스타일링: Tailwind CSS 4

- **선정 이유**: 유틸리티 클래스로 별도 CSS 파일 없이 컴포넌트 내에서 스타일 완결. 빌드 시 미사용 클래스 자동 제거로 CSS 번들 최소. `globals.css`에 디자인 토큰(--color-navy 등) 정의하여 일관성 유지.
- **대안**:
  - CSS Modules — 클래스명 네이밍 고민, 파일 분리로 컨텍스트 스위칭 발생.
  - styled-components — CSS-in-JS는 Server Component에서 사용 불가. RSC 환경에서 별도 설정 필요하고 런타임 오버헤드 존재.

### UI 컴포넌트: shadcn/ui (Base UI 기반)

- **선정 이유**: npm 패키지가 아닌 코드 복사 방식이라 버전 종속 없이 자유롭게 수정 가능. Base UI(Radix 후속) 기반으로 키보드 네비게이션, ARIA 속성이 내장. `npx shadcn add button` 식으로 필요한 것만 추가하여 불필요한 코드 없음.
- **대안**: MUI — 번들 크기 큼(~80KB+ gzipped). Material Design 스타일 체계를 강제하므로 프로젝트 자체 디자인 토큰(짙은 회색 + 주황)으로 오버라이드하려면 `sx` prop과 Tailwind가 충돌하여 이중 스타일링이 됨.

### 폼: react-hook-form + Zod + @hookform/resolvers

- **선정 이유**: Zod 스키마 하나로 클라이언트 폼 검증(`zodResolver`)과 서버 Server Action 검증(`safeParse`)을 동시에 처리. uncontrolled 방식이라 입력마다 리렌더 없음. `isSubmitting` 상태를 별도 useState 없이 제공.
- **대안**: `useActionState` (React 19) — Server Action 반환값을 자동으로 상태에 반영하지만, 필드별 에러 표시, 낙관적 업데이트, 제출 중 UI 제어 등 세밀한 UX 컨트롤이 어려움. 서버 검증 스키마를 클라이언트에서 재사용하는 구조도 아님.

### 검증: Zod 4

- **선정 이유**: `z.infer<typeof schema>`로 런타임 검증 스키마에서 TypeScript 타입을 자동 추론. 서버(`_actions.ts`)와 클라이언트(`project-form.tsx`)에서 동일 스키마 import하여 검증 로직 단일화.
- **대안**: Yup — `InferType`이 있으나 optional/nullable 처리에서 타입 추론이 부정확한 케이스 존재. react-hook-form 생태계에서 Zod가 사실상 표준.

### 인증: Auth.js v5 + 카카오 OAuth

- **선정 이유**: Next.js App Router 공식 통합. JWT 세션으로 DB 조회 없이 인증 확인 가능(DB 독립적). 카카오 로그인은 한국 모바일 사용자 90%+ 설치율로 별도 회원가입 없이 접근 가능. `ADMIN_KAKAO_IDS` 화이트리스트로 관리자 2명 제어에 충분.
- **대안**:
  - Supabase Auth — Supabase DB와 Auth.js가 각각 세션을 관리하는 이중 인증 구조가 됨. 관리자 2명인데 Supabase Auth의 사용자 관리 기능은 과잉.
  - 자체 구현 (bcrypt + JWT) — 토큰 갱신, CSRF 방어, OAuth 콜백 처리 등 보안 취약점 위험. Auth.js가 이미 검증된 구현을 제공.

### DB: Supabase (PostgreSQL)

- **선정 이유**: 무료 플랜으로 DB 500MB + Storage 1GB + 관리 콘솔 제공. RLS(Row Level Security)로 테이블 레벨 접근 제어. PostgreSQL이라 배열(`text[]`), JSON 등 고급 타입 사용 가능.
- **대안**: Firebase Firestore — NoSQL이라 카테고리별 필터링, 정렬 등 관계형 쿼리가 불편. 읽기/쓰기 횟수 과금으로 가격 예측 어려움. Storage도 별도 설정 필요.

### 이미지 저장: Supabase Storage

- **선정 이유**: DB와 동일 Supabase 프로젝트에서 관리하여 별도 서비스 없음. 무료 1GB(WebP 200KB 기준 ~5,000장). CDN 자동 제공. RLS 정책으로 업로드 권한 제어.

### 배포: Vercel Hobby (무료)

- **선정 이유**: Next.js 제작사라 빌드 최적화(ISR, Edge Functions, 이미지 최적화) 자동 적용. Git push만으로 배포. PR별 프리뷰 URL 자동 생성. 대역폭 100GB/월 무료.
- **대안**: Netlify — Next.js App Router 일부 기능(Server Actions, Partial Prerendering 등) 미지원 이력. Vercel 대비 빌드 시간 느림.

### 패키지 매니저: pnpm

- **선정 이유**: 하드링크 기반으로 디스크 사용량 절감. strict 의존성으로 유령 의존성(phantom dependency) 방지. npm 대비 설치 속도 2~3배 빠름.
- **대안**: npm — 느린 설치, node_modules 중복, 유령 의존성 허용으로 "내 로컬에서는 되는데" 문제 발생.

### 테스트: Vitest + Testing Library

- **선정 이유**: Vite 기반으로 HMR 수준의 빠른 테스트 실행. Jest 호환 API라 학습 비용 없음. @testing-library/react로 사용자 관점 컴포넌트 테스트.
- **대안**: Jest — SWC/ESM 설정에서 transform 충돌 빈번. Vitest가 zero-config에 가까움.

### 이미지 최적화: browser-image-compression (클라이언트 WebP)

- **선정 이유**: 업로드 전 브라우저에서 WebP 변환 + ≤200KB 리사이즈. 서버리스 환경에서 이미지 처리 함수 실행 비용 없음. Storage 용량 절약.
- **대안**: 서버 사이드 리사이즈 (Sharp 등) — Vercel 서버리스 함수에서 실행 시 메모리/시간 제한에 걸릴 수 있음. 함수 호출당 비용 발생.

### 캐러셀: Embla Carousel

- **선정 이유**: 코어 ~5KB gzipped. 터치/마우스/키보드 접근성 내장. 자동 스크롤 플러그인으로 시공사례 무한 루프 구현. React 공식 어댑터 제공.
- **대안**: Swiper — 풀 번들 ~40KB. 3D 효과, 가상 슬라이드 등 사용하지 않는 기능이 포함. 이 프로젝트에서는 단순 자동 스크롤만 필요하므로 과잉.

### 아이콘: Lucide React

- **선정 이유**: 트리셰이킹으로 사용한 아이콘만 번들에 포함. 일관된 선 두께/스타일. SVG 기반으로 크기 자유.

### 모니터링: Discord 이원화 웹훅

- **선정 이유**: 완전 무비용. 에러(🔴)/경고(🟡) 채널 분리로 알림 피로도 제어. 스마트폰 Discord 앱으로 실시간 푸시.
- **대안**: Sentry — 무료 5K 이벤트/월이지만 SDK 번들 추가(~30KB)와 설정 복잡. 관리자 1명이 시공사례 올리는 수준의 트래픽에서 Sentry 대시보드는 과잉.

### 환경변수 검증: Zod 스키마 (env.ts)

- **선정 이유**: 빌드 시작 즉시 검증하여 잘못된 환경변수로 배포되는 사고 원천 차단. 이미 프로젝트에서 Zod를 사용 중이라 추가 의존성 없음.
- **대안**: 런타임 체크 (`process.env.X || throw`) — 해당 코드 경로가 실행될 때까지 에러를 모름. 배포 후 특정 기능에서만 터지는 상황 발생.

### DB 마이그레이션: Supabase CLI (Code-First)

- **선정 이유**: 로컬 TypeScript 타입(`src/shared/types.ts`)이 Source of Truth. 새 환경에서 `pnpm db:migrate` 한 줄로 최신 스키마 배포. SQL 파일을 Git으로 버전 관리.
- **대안**: 수동 SQL (Supabase 대시보드에서 직접 실행) — 변경 이력 추적 불가. 로컬/스테이징/프로덕션 간 스키마 불일치 위험.

---

## ADR-001: Server Component 기본 사용

**배경:** 이 사이트의 주 사용자는 모바일 환경의 일반 고객(시공 문의)과 관리자(사장님 1명). 모바일 로딩 속도와 SEO가 핵심.

**결정:** 모든 컴포넌트는 Server Component가 기본. 상태/이벤트가 필요할 때만 `"use client"`.

**이유:**

- JS 번들 감소 → 모바일 3G/LTE 환경에서 체감 속도 개선. Server Component는 HTML만 전달하고 JS를 클라이언트에 보내지 않음.
- DB 직접 호출 가능 → 별도 API Route 없이 `await db.query()` 한 줄로 데이터 조회. 코드량 절반 이하.
- SEO 유리 → 크롤러가 완성된 HTML을 받으므로 "경산 샤시" 검색 노출에 유리.
- 서버 부담 없음 → Vercel 서버리스 + 정적 생성(SSG). 대부분 페이지는 빌드 시 HTML 생성되어 CDN에서 서빙. 서버 함수 실행 자체가 없음.

**감수하는 단점:**

- Next.js 프레임워크 종속 (순수 React SPA로 전환 시 재작성 필요)
- Server Component 자체 테스트 어려움 → 로직을 Repository/스키마 계층으로 분리하여 해결 (ADR-004 참고)

**Client Component 사용 기준:** 폼 입력, 테마 토글, 햄버거 메뉴, 삭제 확인 등 사용자 인터랙션이 필요한 경우만.

---

## ADR-002: react-hook-form 통일 (useActionState 미사용)

**배경:** React 19 + Next.js에서 폼 처리 방식이 두 가지로 나뉨. (1) react-hook-form (클라이언트 검증) (2) useActionState (서버 검증, Next.js 전용).

**결정:** 모든 폼(사용자 대면 + 관리자)에 react-hook-form + zod 사용. useActionState 미사용.

**이유:**

- **이식성** — react-hook-form은 프레임워크 비종속. Next.js를 벗어나도(React SPA, React Native Web 등) 그대로 사용 가능. useActionState는 Next.js App Router에서만 동작.
- **패턴 통일** — 폼마다 다른 방식이면 코드 읽기 어려움. 하나로 통일하면 학습 비용 감소.
- **실시간 검증** — 사용자가 "저장" 누르기 전에 에러 표시. 서버 왕복 없이 즉각 피드백.
- **생태계** — react-hook-form은 주간 다운로드 370만+, GitHub 스타 4.3만+, 풍부한 문서/예제.

**감수하는 단점:**

- Server Action과 직접 연결 안 됨 → `handleSubmit` 내에서 FormData 변환 후 Server Action 호출 필요 (보일러플레이트 5줄 추가)
- 의존성 2개 추가 (react-hook-form 7KB gzip, @hookform/resolvers 2KB gzip)

---

## ADR-003: Repository 패턴 + Mock 자동 전환

**배경:** Supabase 무료 플랜은 프로젝트 2개 제한. 개발 중 DB 없이도 작업할 수 있어야 하고, 나중에 DB를 바꿀 가능성도 열어둬야 함.

**결정:** DB 접근을 Repository 인터페이스로 추상화. `SUPABASE_URL` 미설정 시 Mock으로 자동 전환.

**이유:**

- **DB 없이 개발 가능** — `pnpm dev` 한 줄로 Mock 데이터와 함께 즉시 실행. 새 개발자 온보딩 시 Supabase 계정/설정 불필요.
- **테스트 용이** — Mock Repository 주입으로 네트워크 의존 없는 빠른 유닛 테스트.
- **DB 교체 대비** — Supabase → PlanetScale, Prisma 등으로 전환 시 구현체 하나만 교체. 페이지/컴포넌트 코드 변경 없음.
- **빌드 안정성** — CI/CD에서 DB 연결 없이도 `pnpm build` 성공.

**감수하는 단점:**

- 파일 수 증가 (인터페이스 + Supabase 구현체 + Mock 구현체 + 팩토리 = 4파일)
- 테이블 3개짜리 프로젝트에는 과한 추상화일 수 있음. 하지만 향후 확장 시 투자 회수.

---

## ADR-004: 테스트 전략 — 계층 분리 테스트

**배경:** Server Component는 `async` 함수 + DB 호출이라 직접 테스트가 복잡. 테스트 가능한 구조를 설계해야 함.

**결정:** Server Component 직접 테스트 안 함. Repository, 스키마, Client Component를 각각 테스트.

**이유:**

- Server Component의 역할은 "Repository 호출 → 결과를 하위 컴포넌트에 전달"뿐. 테스트할 분기/로직이 없음.
- **Repository 테스트** → 데이터 CRUD 로직 검증 (Mock 데이터로 빠르게)
- **Zod 스키마 테스트** → 유효성 검증 로직 (순수 함수, 가장 쉬움)
- **Client Component 테스트** → 폼 제출, 버튼 클릭 등 UI 인터랙션 (@testing-library/react)
- 이 세 계층을 테스트하면 Server Component의 정합성은 자연히 보장됨.

**이 전략이 실패하는 경우:** Server Component 내에 복잡한 조건 분기가 들어가면. → 그런 로직은 유틸리티 함수로 추출하여 별도 테스트.

---

## ADR-005: 카카오 로그인 + 환경변수 화이트리스트 관리자

**배경:** 관리자 인증이 필요하지만, 관리자는 사장님 1명(+ 개발자 1명). users 테이블과 role 관리 UI를 만드는 건 과한 투자.

**결정:** DB에 users 테이블 대신, `ADMIN_KAKAO_IDS` 환경변수로 관리자 판단.

**이유:**

- **최소 구현** — 환경변수 한 줄로 관리자 인증 완성. DB 테이블, 마이그레이션, 관리 UI 모두 불필요.
- **보안 충분** — 카카오 OAuth로 본인 확인 + 환경변수로 화이트리스트. 2명 관리에 이 이상의 보안은 과잉.
- **DB 스키마 단순화** — users 테이블 제거로 RLS 정책도 단순해짐.

**감수하는 단점:**

- 관리자 추가/제거 시 환경변수 수정 + 재배포 필요 (Vercel에서 1분)
- 관리자 10명 이상이면 환경변수가 길어져 관리 불편 → 그때 DB 전환

**전환 시점:** 직원이 여러 명 관리자로 들어오거나, 사장님이 직접 관리자를 추가/제거하고 싶을 때.

---

## ADR-006: AGENTS.md 구조 — 토큰 효율 우선

**배경:** AI 코딩 에이전트(Kiro, Cursor 등)가 AGENTS.md를 매 대화 턴마다 컨텍스트에 포함. 길수록 비용 증가 + "lost in the middle" 현상으로 규칙 무시 가능성 증가.

**결정:** AGENTS.md는 100줄 이내. 에이전트가 추론 불가능한 정보만 포함.

**이유:**

- ETH Zurich 연구: 아키텍처 개요/프로젝트 구조는 에이전트가 직접 탐색 가능. 포함해도 성능 향상 없고 토큰만 소비.
- 150줄 넘으면 중간 규칙을 무시하기 시작 (lost in the middle).
- "에이전트가 실수할 만한 것"만 명시하는 게 가장 높은 ROI.

**포함 기준:**

- 코드만 봐서는 알 수 없는 규칙 (import 경계, 폼 패턴, 인증 방식)
- 실수하면 되돌리기 어려운 제약 (git push 금지, Storage 용량)
- 버전별 API 차이가 큰 스택 정보 (Next.js 16, zod 4)

**제외 기준:**

- ESLint/Prettier가 강제하는 규칙 (any 금지, 세미콜론 등)
- 파일 탐색으로 알 수 있는 정보 (프로젝트 구조, 명령어)

---

## ADR-007: Next.js 선택 (React 풀스택 프레임워크)

**배경:** 경산 지역 창호 업체 홈페이지. 검색 노출(SEO)이 사업 핵심. 1인 개발로 프론트+백엔드+배포를 모두 처리해야 함. 예산 0원.

**결정:** Next.js 16 App Router 사용.

**이유:**

- **풀스택 원스톱** — 프론트엔드 + API + SSR + 정적 생성을 하나의 프로젝트로. 프론트/백 분리하면 레포 2개, 배포 2개, CORS 설정 등 관리 부담 2배.
- **SEO 기본 지원** — "경산 샤시" 검색 노출이 사업 목적. SSR/SSG로 크롤러에 완성된 HTML 제공. 메타데이터 API, sitemap, robots.txt 내장.
- **Vercel 무료 배포** — Next.js 제작사가 Vercel. 설정 없이 `git push`만으로 배포 완료. 다른 프레임워크는 추가 설정 필요.
- **이미지 최적화 내장** — `<Image>` 컴포넌트가 자동 리사이즈/WebP 변환/lazy load. 시공사례 사진이 많은 사이트에서 성능 직결.
- **점진적 확장** — 지금은 정적 랜딩이지만, 관리자 CRUD → 푸시 알림 → 견적 자동화 등 동적 기능을 같은 프로젝트에서 확장 가능.
- **Server Actions** — API Route 없이 `"use server"` 함수로 폼 처리. 파일 수와 코드량 감소.
- **파일 기반 라우팅** — 폴더 구조 = URL 구조. 별도 라우터 설정 불필요. 직관적.
- **React 생태계** — react-hook-form, Auth.js, Supabase SDK 등 React 라이브러리 그대로 사용.
- **한국 생태계** — 한국어 튜토리얼, 커뮤니티, 채용 시장에서 가장 레퍼런스 많은 React 프레임워크.

**대안 검토:**

| 대안             | 탈락 이유                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ |
| React SPA (Vite) | SEO 불리 (CSR). 별도 API 서버 필요 → 관리 포인트 2배. 무료 백엔드 호스팅 찾아야 함.  |
| Remix            | Vercel 지원되지만 한국 생태계/레퍼런스 부족. 이미지 최적화 미내장.                   |
| Astro            | 정적 콘텐츠에 최적이지만 관리자 CRUD 같은 동적 기능에 약함. React 통합 시 설정 복잡. |
| Vue/Nuxt         | React 대비 한국 채용 시장 작음. 기존 React 경험 활용 불가.                           |

---

## ADR-008: Supabase 선택 (BaaS)

**배경:** DB + 파일 스토리지 + 인증이 필요하지만, 별도 서버를 운영할 예산과 시간이 없음. 무료로 시작 가능해야 함.

**결정:** Supabase (PostgreSQL + Storage + Auth).

**이유:**

- **무료 플랜 충분** — 500MB DB, 1GB Storage, 50K MAU. 이 규모의 업체 홈페이지에 수년간 충분. 단, 1주 비활성 시 프로젝트 일시정지됨 (요청 오면 자동 재개).
- **PostgreSQL** — 업계 표준 관계형 DB. SQL 직접 사용 가능. NoSQL(Firebase)과 달리 JOIN, 트랜잭션, 복잡한 쿼리 자유로움.
- **벤더 종속 낮음** — 오픈소스 기반. 데이터 export 후 다른 PostgreSQL 호스팅으로 이전 가능. Firebase는 Firestore 형식에 종속.
- **Storage 내장** — 이미지 업로드용 별도 서비스(S3, Cloudinary) 불필요. 하나의 대시보드에서 DB + 파일 관리.
- **Row Level Security** — DB 레벨에서 접근 제어. "공개 읽기, 인증된 사용자만 쓰기" 같은 정책을 SQL로 정의.
- **한국 리전(Seoul)** — `ap-northeast-2` 리전 지원. 국내 사용자에게 낮은 지연시간.
- **실시간 기능** — 나중에 실시간 알림 등 확장 시 Supabase Realtime 활용 가능.

**대안 검토:**

| 대안                             | 탈락 이유                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Firebase                         | NoSQL(Firestore)이라 관계형 쿼리 불편. 복잡한 필터/정렬에 인덱스 수동 생성 필요. 벤더 종속 높음. |
| PlanetScale                      | DB만 제공. Storage 별도 필요(S3 등). 무료 플랜 축소됨(2024).                                     |
| Neon                             | PostgreSQL 서버리스로 좋지만 Storage 미제공.                                                     |
| 직접 서버 (Express + PostgreSQL) | 서버 관리 부담. 호스팅 비용 발생. 1인 개발에서 인프라까지 관리하면 본업(기능 개발) 시간 감소.    |

---

## ADR-009: Tailwind CSS 선택

**배경:** 디자이너 없이 1인 개발. 일관된 디자인을 빠르게 구현해야 하고, 다크모드 + 반응형이 필수.

**결정:** Tailwind CSS 유틸리티 클래스.

**이유:**

- **개발 속도** — CSS 파일 왔다갔다 없이 HTML에서 바로 스타일링. 프로토타이핑 → 프로덕션 전환 빠름.
- **디자이너 없이 일관성** — 정해진 spacing 스케일(4px 단위), color 팔레트를 사용하면 자연스럽게 통일된 디자인.
- **다크모드 내장** — `dark:bg-gray-900` 한 클래스로 다크모드 대응. 별도 CSS 변수 관리 불필요.
- **반응형 내장** — `sm:`, `md:`, `lg:` 접두사로 미디어 쿼리 없이 반응형 구현.
- **번들 크기** — 사용한 클래스만 포함(purge). 프로덕션 CSS gzip 기준 6~12KB. Bootstrap(gzip ~53KB) 대비 1/5 수준.
- **React 컴포넌트 궁합** — 스타일이 컴포넌트 파일에 같이 있어서 "이 컴포넌트가 어떻게 생겼는지" 한 파일에서 파악.
- **생태계** — 2026 기준 가장 인기 있는 CSS 프레임워크 (State of CSS 2025 사용률 37%, 주간 npm 6900만+ 다운로드).

**감수하는 단점:**

- HTML 클래스가 길어져 마크업 가독성 저하 → 컴포넌트 분리로 완화
- Tailwind 모르는 개발자 온보딩 시 초기 학습 필요 (1~2일이면 적응)

**대안 검토:**

| 대안              | 탈락 이유                                                                          |
| ----------------- | ---------------------------------------------------------------------------------- |
| CSS Modules       | 파일 분리 번거로움. 다크모드/반응형 직접 구현 필요.                                |
| styled-components | 런타임 CSS-in-JS → SSR 복잡도 증가. Server Component와 호환 안 됨. 번들 크기 증가. |
| vanilla CSS       | 규모 커지면 클래스 충돌, 일관성 유지 어려움. 다크모드/반응형 보일러플레이트 많음.  |
| Bootstrap         | 컴포넌트 기반이라 커스터마이징 어려움. 번들 160KB+. "Bootstrap 느낌" 탈피 어려움.  |

---

## ADR-010: pnpm 선택 (패키지 매니저)

**배경:** Node.js 패키지 매니저 선택. npm, yarn, pnpm 중 하나.

**결정:** pnpm 사용.

**이유:**

- **디스크 효율** — 하드링크 기반 content-addressable storage. 같은 패키지를 여러 프로젝트에서 공유. node_modules 크기 50~70% 감소.
- **설치 속도** — npm 대비 2~3배 빠름 (벤치마크 기준). CI/CD 빌드 시간 단축.
- **strict 모드** — phantom dependency 방지. `package.json`에 명시하지 않은 패키지는 import 불가. "내 로컬에서는 되는데 CI에서 안 됨" 문제 원천 차단.
- **모노레포 지원** — workspace 기능 내장. 나중에 프로젝트 분리 시 유리.

**대안 검토:**

| 대안           | 탈락 이유                                                |
| -------------- | -------------------------------------------------------- |
| npm            | 느림. phantom dependency 허용. 디스크 비효율.            |
| yarn (classic) | pnpm 대비 장점 없음. yarn berry(PnP)는 호환성 이슈 많음. |

---

## ADR-011: Auth.js (next-auth) + 카카오 로그인

**배경:** 관리자 인증이 필요. 한국 사용자(사장님)가 가장 편하게 로그인할 수 있는 방법이어야 함.

**결정:** Auth.js v5로 카카오 소셜 로그인.

**이유:**

- **사용자 편의** — 사장님이 이미 카카오 계정 보유. 별도 회원가입/비밀번호 기억 불필요. 카카오톡에서 바로 인증.
- **보안 부담 제거** — 비밀번호 저장/해싱/리셋 로직 불필요. OAuth 프로바이더(카카오)가 인증 보안 담당.
- **Auth.js 생태계** — 세션 관리, JWT, 쿠키, CSRF 보호를 프레임워크가 처리. 직접 구현 대비 보안 취약점 위험 대폭 감소.
- **한국 시장** — 카카오톡은 한국인이 가장 많이 사용하는 앱 1위(와이즈앱 2025). 사실상 전 국민이 사용하는 메신저.
- **Next.js 통합** — Auth.js v5는 Next.js App Router 네이티브 지원. middleware에서 세션 확인 가능.

**대안 검토:**

| 대안                 | 탈락 이유                                                       |
| -------------------- | --------------------------------------------------------------- |
| Supabase Auth        | 카카오 프로바이더 공식 미지원. 커스텀 OAuth 설정 복잡.          |
| 자체 이메일/비밀번호 | 관리자 2명인데 회원가입 시스템 구축은 과잉. 비밀번호 보안 부담. |
| 네이버 로그인        | 가능하지만 카카오 대비 사용자 접근성 낮음. 고객이 카카오 선호.  |

---

## ADR-012: shadcn/ui 도입

**배경:** Input, Select, Textarea 같은 폼 컴포넌트를 각 파일에서 `inputClass` 문자열로 반복 정의하고 있었음. 공용 컴포넌트가 필요하고, 나중에 모달/토스트 등 복잡한 컴포넌트도 필요해질 수 있음.

**결정:** shadcn/ui 도입. `src/app/_components/`에 설치 (`ui/` 하위 폴더 없이 플랫 구조).

**이유:**

- **npm 의존성 아님** — CLI로 코드를 프로젝트에 복사. 버전 관리 부담 없음. 자유롭게 수정 가능.
- **Tailwind 네이티브** — 이미 사용 중인 Tailwind와 완벽 호환. 별도 스타일링 시스템 불필요.
- **접근성 내장** — Base UI(Radix 후속) 기반으로 키보드 네비게이션, ARIA 자동 처리.
- **필요한 것만 추가** — `npx shadcn add dialog` 식으로 하나씩. 안 쓰는 컴포넌트 없음.
- **번들 크기 작음** — 사용한 컴포넌트만 포함.
- **2026 기준 가장 인기 있는 React UI 시스템** — 커뮤니티, 예제, 레퍼런스 풍부.

**`app/_components/`에 플랫 배치한 이유:**

- shadcn/ui 기본은 `components/ui/`이지만, 현재 feature 컴포넌트와 단순 UI 컴포넌트가 혼재할 규모가 아님
- `ui/` 하위 폴더는 불필요한 중첩. 파일명으로 충분히 구분됨
- 라우트별 `_components/`(feature 컴포넌트)와 `app/_components/`(공용)로 이미 분리되어 있음
- feature 단위 컴포넌트와 단순 UI 컴포넌트 분리가 필요해지면 그때 `ui/` 도입

**감수하는 단점:**

- 업데이트 수동 (버그 수정 시 직접 반영 필요. 실제로는 거의 안 바뀜)
- 복잡한 컴포넌트(Dialog, Select 등) 사용 시 Base UI 패키지 추가됨

**Select는 네이티브 유지:** shadcn/ui Select는 커스텀 드롭다운이라 모바일에서 OS 네이티브 피커를 사용하지 않음. 관리자 폼에서는 네이티브 `<select>`가 모바일 UX에 더 적합.

**대안 검토:**

| 대안               | 탈락 이유                                                                       |
| ------------------ | ------------------------------------------------------------------------------- |
| 직접 구현 유지     | 접근성 직접 관리 부담. 컴포넌트 늘어날수록 유지보수 증가.                       |
| Material UI        | 번들 크기 큼 (~80KB). 커스터마이징 어려움. "MUI 느낌" 탈피 어려움.              |
| Headless UI        | 컴포넌트 수 적음. shadcn/ui 대비 생태계 작음.                                   |
| Radix UI 직접 사용 | 스타일링 전부 직접 해야 함. shadcn/ui가 이미 Base UI 위에 Tailwind 스타일 제공. |

---

## ADR-013: Supabase service_role key 서버 전용 접근

**배경:** Supabase는 클라이언트에서 직접 DB에 접근하는 BaaS 모델을 기본으로 한다. `anon key`를 클라이언트에 노출하고 RLS로 접근을 제어하는 방식. 하지만 우리는 Next.js Server Component/Action에서만 DB에 접근하므로 클라이언트 노출이 불필요하다.

**결정:** `service_role key`로 서버에서만 접근. `anon key` 사용하지 않음. RLS는 활성화하되 정책 없음 (기본 deny).

**구조:**

- `SUPABASE_URL` — 서버 전용 환경변수 (`NEXT_PUBLIC_` 아님)
- `SUPABASE_SERVICE_ROLE_KEY` — 서버 전용. RLS 우회.
- RLS 활성화 + 정책 없음 → `anon key`로는 읽기/쓰기 모두 불가
- 인가는 서버 레벨에서 처리 (proxy.ts + Server Action)

**이유:**

- 클라이언트에 DB 접근 정보 일절 노출 안 됨
- RLS 정책 관리 불필요 (서버 코드가 유일한 접근 경로)
- `service_role key`는 서버 환경변수에만 존재 → 외부 노출 불가
- Supabase를 순수 "관리형 PostgreSQL + Storage"로 사용

**감수하는 단점:**

- `service_role key` 유출 시 DB 전체 접근 가능 → 환경변수 관리 철저히
- Supabase Auth, Realtime 등 클라이언트 기능 사용 불가 (필요 없음)

**대안 검토:**

| 대안                | 탈락 이유                                                                      |
| ------------------- | ------------------------------------------------------------------------------ |
| anon key + RLS 정책 | 클라이언트에 키 노출. RLS 정책 관리 복잡. 우리는 서버에서만 접근하므로 불필요. |
| Supabase Auth 연동  | Auth.js와 이중 인증 구조. 복잡도 증가. 관리자 2명인데 과잉.                    |

---

## ADR-014: Supabase CLI 기반 Code-First 마이그레이션 및 수동 정의 타입 도입

**배경:**
데이터베이스 마이그레이션 관리가 파편화되어 새 환경 셋업이 길어질 수 있고, Supabase 원격 스키마에서 타입을 자동으로 역추출하여 덮어쓰는 도구(`db:types`)는 수동 정의 타입 오버라이딩을 깨뜨리며 소스 코드의 엄격성을 떨어뜨렸습니다.

**결정:**

1. 원격 타입 자동 추출 기능을 전면 배제하고, 로컬 소스 코드 타입(`src/shared/types.ts`)을 최종 스펙(Source of Truth)으로 삼는 Code-First 구조로 전환합니다.
2. 과거의 조각난 마이그레이션 내역을 하나의 최초 통합 마이그레이션 파일(`0001_initial_schema.sql`)로 완전히 병합(Squash)하여 버전 관리합니다.

**이유:**

- **타입 일관성**: 데이터베이스가 코드의 타입 스펙에 강제적으로 맞춰지므로, 개발 시 무의미한 타입 단언(`as Project[]` 등)을 다수 제거하여 순수한 컴파일 안전성을 유지합니다.
- **빠른 온보딩**: 새로운 Supabase 연동 시 `pnpm db:migrate` 명령어 한 줄로 완성형 최신 스키마가 즉각 배포됩니다.
- **안정적 버전 제어**: 로컬 타입 수정 -> 신규 마이그레이션 생성 -> DDL 작성 -> DB push의 통일된 단방향 워크플로우로 실수를 미연에 방지합니다.

**감수하는 단점:**

- 스키마가 변경될 때마다 TypeScript 타입 파일(`src/shared/types.ts`)과 SQL 마이그레이션 쿼리를 개발자가 수동으로 동기화해야 합니다. (도메인이 단순하여 작업 비용이 극히 낮음)

---

## ADR-015: Vercel + Discord 다중 웹훅 기반 에러/경고 실시간 모니터링 및 환경변수(Zod) 검증

**배경:**
Vercel Hobby(무료 플랜) 환경에서는 런타임 로그 보존 기간이 1시간 내외로 짧아 사후 에러 분석 및 실시간 장애 전파가 어렵습니다. 더불어 환경변수의 미세한 오타나 누락이 런타임 중에 감춰져 추적이 힘들어질 수 있습니다.

**결정:**

1. `zod` 스키마를 사용하여 서버 기동 및 빌드 타임에 환경변수 무결성을 정적 검증(`src/shared/env.ts`)합니다. 특히 `next.config.ts` 진입점에 강제 바인딩하여 Next.js 빌드 기동 즉시 검증이 수행되도록 하고, 프로덕션이나 엄격 옵션(`STRICT_ENV=true`) 하에서 검증 실패 시 `process.exit(1)`을 호출하여 Vercel 빌드 단계를 즉각 원천 차단합니다.
2. 실시간 에러 및 보안 모니터링을 위해 디스코드 다중 웹훅 채널을 도입하고, 성격에 따라 수신 웹훅을 분리합니다.
   - `DISCORD_ERROR_WEBHOOK_URL` (🔴 치명적인 시스템/DB 오류 - 알림 켬)
   - `DISCORD_WARN_WEBHOOK_URL` (🟡 비정상 접근 시도, 로그인 실패 등의 보안 이벤트 - 알림 끔)

**이유:**

- **사전 에러 차단**: 잘못 세팅된 환경변수가 빌드 또는 기동 단계에서 파싱 에러로 잡혀 즉각 파악 가능합니다.
- **알림 피로도 제어**: 알림 채널을 2개로 분할하여 관리자가 중요 에러(🔴)는 즉각 스마트폰 푸시로 대응하고, 경고(🟡)는 무음 채널에서 나중에 히스토리성으로 몰아서 볼 수 있습니다.
- **고비용 로깅 도구 배제**: Sentry나 Datadog 같은 고비용/복잡한 모니터링 라이브러리 없이 표준 에러 출력 + 디스코드 fetch 전송의 무비용 경량화 방식으로 해결합니다.

**감수하는 단점:**

- 디스코드 메시지 전송 실패 시 로그가 유실될 위험이 있으므로, 예비용으로 콘솔 출력(`console.error`, `console.warn`)을 항상 병행하여 Vercel 로그에 남도록 합니다.

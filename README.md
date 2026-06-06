# Potato — 풀스택 비즈니스 홈페이지 + 관리자 CMS

실제 운영 중인 시공 업체 홈페이지. 공개 랜딩 페이지와 관리자 CMS를 하나의 Next.js 앱으로 구현했습니다.

> Next.js 16 (App Router) · React 19 · TypeScript (strict) · Supabase · Auth.js v5 · Tailwind CSS 4 · Vercel

🔗 [Live Demo](https://potato-swart.vercel.app)

## 주요 특징

- **Repository 패턴** — Supabase 미연결 시 Mock으로 자동 전환. DB 없이 개발/빌드 가능
- **Server Actions** — 오케스트레이션만 담당, 순수 로직은 분리하여 단위 테스트 가능
- **서버/클라이언트/공용 3분할** — 폴더 경계를 넘는 import 금지로 관심사 분리
- **Auth.js v5 카카오 로그인** — 환경변수 기반 관리자 권한 제어 (DB 변경 불필요)
- **고객 후기(리뷰) 및 검토 시스템** — 카카오 로그인 인증 기반 후기 작성/수정 요청, 관리자 승인(신규 승인 & 수정 대조 승인) 2단계 파이프라인 구축 및 RLS 보안 적용
- **이미지 최적화** — browser-image-compression으로 WebP 변환 + 200KB 제한 후 Supabase Storage 업로드
- **환경변수 빌드타임 검증** — Zod 스키마로 필수 환경변수 누락 시 빌드 차단, 배포 사고 방지
- **Discord 웹훅 실시간 모니터링** — 에러/보안 이벤트를 채널 분리하여 알림 (Sentry 대체)

## 기술 스택

| 분류         | 기술                                        |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 16 (App Router) + TypeScript strict |
| Styling      | Tailwind CSS 4 + shadcn/ui                  |
| DB / Storage | Supabase (PostgreSQL + Storage)             |
| Auth         | Auth.js v5 — 카카오 소셜 로그인             |
| Forms        | react-hook-form + Zod                       |
| Monitoring   | Discord Webhook (에러/경고 이원화)          |
| Migration    | Supabase CLI (Code-First)                   |
| Test         | Vitest + Testing Library                    |
| Deploy       | Vercel                                      |
| Code Quality | ESLint, Prettier, Husky, commitlint         |

## 프로젝트 구조

```
src/
├── app/
│   ├── (public)/        # 공개 페이지 (랜딩, 시공사례, 고객 후기)
│   ├── admin/           # 관리자 CRUD (카카오 로그인 보호)
│   └── _components/     # 공용 UI 컴포넌트
├── server/              # Repository (Supabase ↔ Mock 자동 전환), Logger
├── client/              # 브라우저 유틸 (이미지 압축, 테마)
└── shared/              # 타입, Zod 스키마, 환경변수 검증 (양쪽 공용)
```

## 기술적 도전

### Zod 스키마 서버/클라이언트 단일화

하나의 Zod 스키마(`shared/schemas.ts`)를 클라이언트 폼 검증(`zodResolver`)과 서버 Server Action 검증(`safeParse`)에서 동시에 import합니다. 검증 규칙 변경 시 한 곳만 수정하면 양쪽에 반영되고, `z.infer`로 TypeScript 타입도 자동 추론됩니다.

### 클라이언트 이미지 압축 파이프라인

Vercel 서버리스 함수에서 Sharp를 실행하면 메모리/시간 제한에 걸릴 수 있어, 업로드 전 브라우저에서 WebP 변환 + 200KB 이하 압축을 수행합니다. 서버 비용 없이 Supabase Storage 무료 1GB 내에서 ~5,000장 저장 가능한 구조입니다.

### 환경변수 빌드타임 검증

`next.config.ts` 진입점에서 Zod 스키마로 모든 필수 환경변수를 즉시 검증합니다. Vercel에서 환경변수를 수동 등록하다 발생하는 누락/오타를 빌드 단계에서 차단하여, 배포 후 런타임에서야 터지는 사고를 방지합니다.

### Discord 웹훅 이원화 모니터링

Vercel Hobby 플랜의 로그 보존이 1시간이라 사후 분석이 불가능합니다. 이를 해결하기 위해 에러(🔴)와 보안 경고(🟡) 채널을 분리한 Discord 웹훅을 구현했습니다. Non-blocking fetch로 응답 속도에 영향 없이 스택 트레이스와 페이로드를 실시간 전송합니다. Sentry 없이 무비용으로 운영 가시성을 확보했습니다.

### Repository 패턴 + globalThis 싱글톤

`SUPABASE_URL` 유무에 따라 Supabase 구현체와 Mock 구현체를 자동 전환합니다. DB 없이도 개발/빌드/테스트가 가능합니다. Next.js dev 모드에서 HMR이 모듈을 재로드해도 Mock 데이터가 유실되지 않도록 `globalThis`에 인스턴스를 캐싱하는 싱글톤 패턴을 적용했습니다.

### 카카오 인증 기반 하이브리드 후기 파이프라인

일반 고객은 카카오 로그인을 통해 본인이 작성한 후기를 안전하게 관리할 수 있으며, 악성/광고성 리뷰 노출을 예방하기 위해 대표자가 관리자 CMS에서 최종 승인해야만 홈페이지에 노출됩니다. 고객이 후기를 수정할 경우, 기존 노출 중인 원본은 유지하되 백그라운드(`review_edits` 테이블)에 수정 요청안을 임시 적재하여 관리자가 원본과 대조하여 승인/반려할 수 있도록 설계했습니다. 이 과정에서 Supabase의 RLS 정책을 통해 작성자 본인 및 관리자 외의 데이터 변조 위협을 원천 차단했습니다.

## 설계 결정

주요 기술 선택의 이유는 문서로 기록했습니다:

- [`docs/ADR.md`](docs/ADR.md) — Architecture Decision Records
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — 시스템 아키텍처
- [`docs/CODE_STYLE.md`](docs/CODE_STYLE.md) — 코딩 컨벤션
- [`docs/features/reviews-dev-plan.md`](docs/features/reviews-dev-plan.md) — 후기 시스템 개발 계획서 및 설정 가이드

## 시작하기

```bash
pnpm install
cp .env.local.example .env.local  # 환경변수 설정
pnpm dev                          # http://localhost:3000
pnpm test                         # 단위 테스트
pnpm build                        # 프로덕션 빌드
```

Supabase 미연결 시에도 Mock 데이터로 정상 동작합니다.

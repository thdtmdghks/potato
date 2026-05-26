# Potato — 풀스택 비즈니스 홈페이지 + 관리자 CMS

실제 운영 중인 시공 업체 홈페이지. 공개 랜딩 페이지와 관리자 CMS를 하나의 Next.js 앱으로 구현했습니다.

> Next.js 16 (App Router) · React 19 · TypeScript (strict) · Supabase · Auth.js v5 · Tailwind CSS 4 · Vercel

🔗 [Live Demo](https://potato-swart.vercel.app)

## 주요 특징

- **Repository 패턴** — Supabase 미연결 시 Mock으로 자동 전환. DB 없이 개발/빌드 가능
- **Server Actions** — 오케스트레이션만 담당, 순수 로직은 분리하여 단위 테스트 가능
- **서버/클라이언트/공용 3분할** — 폴더 경계를 넘는 import 금지로 관심사 분리
- **Auth.js v5 카카오 로그인** — 환경변수 기반 관리자 권한 제어 (DB 변경 불필요)
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
│   ├── (public)/        # 공개 페이지 (랜딩, 시공사례 갤러리)
│   ├── admin/           # 관리자 CRUD (카카오 로그인 보호)
│   └── _components/     # 공용 UI 컴포넌트
├── server/              # Repository (Supabase ↔ Mock 자동 전환), Logger
├── client/              # 브라우저 유틸 (이미지 압축, 테마)
├── shared/              # 타입, Zod 스키마, 환경변수 검증 (양쪽 공용)
└── __tests__/           # 단위 테스트
```

## 기술적 도전

### 환경변수 빌드타임 검증

Vercel 환경변수를 수동 등록하다 보니 누락 가능성이 있어, `next.config.ts`에서 Zod 스키마로 즉시 검증. 프로덕션 빌드 시 필수 변수가 없으면 빌드 자체를 차단하여 장애를 사전에 방지합니다.

### Discord 웹훅 실시간 모니터링

Vercel Hobby 플랜의 1시간 로그 보존 한계를 극복하기 위해, 에러(🔴)와 보안 경고(🟡) 채널을 분리한 Discord 웹훅을 구현. Non-blocking fetch로 사용자 응답 속도에 영향 없이 관리자에게 실시간 알림을 전송합니다.

### Mock 자동 전환

Supabase 무료 플랜 제약(프로젝트 2개 제한) 속에서 DB 없이도 개발/빌드/테스트가 가능하도록 Repository 패턴으로 추상화. 환경변수 유무에 따라 Supabase ↔ Mock 구현체를 자동 전환합니다.

## 설계 결정

주요 기술 선택의 이유는 문서로 기록했습니다:

- [`docs/ADR.md`](docs/ADR.md) — Architecture Decision Records
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — 시스템 아키텍처
- [`docs/CODE_STYLE.md`](docs/CODE_STYLE.md) — 코딩 컨벤션

## 시작하기

```bash
pnpm install
cp .env.local.example .env.local  # 환경변수 설정
pnpm dev                          # http://localhost:3000
pnpm test                         # 단위 테스트
pnpm build                        # 프로덕션 빌드
```

Supabase 미연결 시에도 Mock 데이터로 정상 동작합니다.

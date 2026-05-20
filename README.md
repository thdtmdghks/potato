# 경산창호 홈페이지

경산·대구 지역 창호(PVC샷시, 알루미늄샷시, 방충망 등) 시공 전문 업체의 홈페이지.
시공사례 갤러리로 실적을 보여주고, 모바일에서 전화/카카오톡으로 바로 연결되는 것이 핵심.

- **공개 페이지**: 원페이지 랜딩 + 시공사례 갤러리 + 견적 문의
- **관리자 페이지**: 시공사례/서비스 CRUD, 문의 관리 (카카오 로그인)
- **모바일 최우선**: base → sm → md → lg 순서로 확장

## 아키텍처

```
src/
├── app/
│   ├── _components/          # 공용 UI (shadcn/ui + 커스텀)
│   ├── (public)/             # 공개 페이지 (랜딩, 갤러리, 문의)
│   └── admin/                # 관리자 페이지
│       └── projects/
│           ├── _actions.ts       # Server Actions (오케스트레이션)
│           ├── _constants.ts     # 라우트 로컬 상수
│           ├── _utils.ts         # 순수 함수 (테스트 대상)
│           └── _components/      # 클라이언트 컴포넌트
├── server/    # DB, Repository (Supabase + Mock 자동 전환)
├── client/    # 브라우저 유틸 (이미지 압축, 테마)
├── shared/    # 타입, Zod 스키마 (양쪽 공용)
└── lib/       # shadcn/ui 유틸 (cn)
```

**핵심 패턴:**

- Repository 패턴 — `NEXT_PUBLIC_SUPABASE_URL` 미설정 시 Mock으로 자동 전환. DB 없이 개발/빌드 가능.
- Server Action — 오케스트레이션만 담당. 순수 로직은 `_utils.ts`로 분리하여 테스트.
- 서버/클라이언트/공용 3분할 — 폴더 경계를 넘는 import 금지.

## 시작하기

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm test       # Vitest 유닛 테스트
pnpm test:watch # 감시 모드
pnpm format
pnpm lint
```

## 환경변수

`.env.local.example` → `.env.local`로 복사 후 값 입력:

```
AUTH_SECRET=                   # Auth.js 시크릿 (npx auth secret)
AUTH_KAKAO_ID=                 # 카카오 REST API 키
AUTH_KAKAO_SECRET=             # 카카오 Client Secret
ADMIN_KAKAO_IDS=               # 관리자 카카오 ID (쉼표 구분)
SUPABASE_URL=                  # Supabase 프로젝트 URL
SUPABASE_SERVICE_ROLE_KEY=     # Supabase service_role key (서버 전용)
STORAGE_BUCKET=images          # Supabase Storage 버킷명
VAPID_PUBLIC_KEY=              # Web Push VAPID 공개키
VAPID_PRIVATE_KEY=             # Web Push VAPID 비밀키
```

Supabase 미연결 시에도 빌드/실행 가능 (Mock 데이터로 자동 전환).

## 기술 스택

| 분류            | 기술                                             | 버전  |
| --------------- | ------------------------------------------------ | ----- |
| Framework       | Next.js (App Router) + TypeScript strict         | 16.2  |
| Styling         | Tailwind CSS                                     | 4.2   |
| UI              | shadcn/ui (Base UI 기반)                         | -     |
| DB              | Supabase PostgreSQL                              | -     |
| Auth            | Auth.js v5 (next-auth) — 카카오 로그인           | -     |
| Storage         | Supabase Storage (이미지)                        | -     |
| Forms           | react-hook-form + zod + @hookform/resolvers      | 7 / 4 |
| Image           | browser-image-compression (WebP, 최대 200KB)     | 2.0   |
| Push            | web-push (PWA 푸시 알림)                         | 3.6   |
| Package Manager | pnpm                                             | 10.33 |
| Code Quality    | ESLint, Prettier, Husky, lint-staged, commitlint | -     |
| Test            | Vitest + @testing-library/react                  | -     |
| Dark Mode       | OS 기본 + 토글 (useSyncExternalStore)            | -     |
| Deploy          | Vercel (무료 Hobby)                              | -     |

## 페이지 구성

### 공개

| 경로             | 설명                                                       |
| ---------------- | ---------------------------------------------------------- |
| `/`              | 원페이지 랜딩 (히어로 → 서비스 → 시공사례 → 강점 → 연락처) |
| `/projects`      | 시공사례 갤러리                                            |
| `/projects/[id]` | 시공사례 상세                                              |

### 관리자 (카카오 로그인)

| 경로               | 설명          |
| ------------------ | ------------- |
| `/admin`           | 대시보드      |
| `/admin/projects`  | 시공사례 CRUD |
| `/admin/products`  | 서비스 CRUD   |
| `/admin/inquiries` | 문의 관리     |

## 관리자 설정

1. 카카오 개발자 사이트에서 앱 생성
2. REST API 키 → `AUTH_KAKAO_ID`, Client Secret → `AUTH_KAKAO_SECRET`
3. 카카오 로그인 후 본인의 카카오 ID 확인
4. `ADMIN_KAKAO_IDS` 환경변수에 해당 ID 추가 (DB 변경 불필요)

## 문서

- `docs/ADR.md` — 기술 결정 기록 (Architecture Decision Records)
- `docs/CODE_STYLE.md` — 코딩 컨벤션
- `docs/NEXT-TASKS.md` — 다음 작업 가이드

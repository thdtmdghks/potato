# 경산창호 홈페이지

경산·대구 지역 창호 시공 전문 업체 홈페이지. 원페이지 스크롤 랜딩 + 시공사례 갤러리 + 관리자 페이지.

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
NEXT_PUBLIC_SUPABASE_URL=      # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
VAPID_PUBLIC_KEY=              # Web Push VAPID 공개키
VAPID_PRIVATE_KEY=             # Web Push VAPID 비밀키
```

Supabase 미연결 시에도 빌드/실행 가능 (Mock 데이터로 자동 전환).

## 기술 스택

| 분류            | 기술                                             | 버전       |
| --------------- | ------------------------------------------------ | ---------- |
| Framework       | Next.js (App Router) + TypeScript                | 16.2       |
| Styling         | Tailwind CSS                                     | 4.2        |
| DB              | Supabase PostgreSQL                              | -          |
| Auth            | Auth.js v5 (next-auth) — 카카오 로그인           | -          |
| Storage         | Supabase Storage (이미지)                        | -          |
| Forms           | react-hook-form + zod + @hookform/resolvers      | 7.72 / 4.3 |
| Image           | browser-image-compression (WebP 변환)            | 2.0        |
| Push            | web-push (PWA 푸시 알림)                         | 3.6        |
| Package Manager | pnpm                                             | 10.33      |
| Code Quality    | ESLint, Prettier, Husky, lint-staged, commitlint | -          |
| Test            | Vitest + @testing-library/react                  | -          |
| Dark Mode       | OS 기본 + 토글 (Tailwind `dark:` + localStorage) | -          |
| Deploy          | Vercel (무료 Hobby)                              | -          |

## 페이지 구성

### 공개

- `/` — 원페이지 랜딩 (히어로 → 서비스 → 시공사례 → 강점 → 연락처)
- `/projects` — 시공사례 갤러리
- `/projects/[id]` — 시공사례 상세

### 관리자 (카카오 로그인 + role='admin')

- `/admin` — 대시보드
- `/admin/projects` — 시공사례 CRUD
- `/admin/products` — 서비스 CRUD
- `/admin/inquiries` — 문의 관리

## 관리자 설정

1. 카카오 개발자 사이트에서 앱 생성
2. REST API 키 → `AUTH_KAKAO_ID`, Client Secret → `AUTH_KAKAO_SECRET`
3. 카카오 로그인으로 회원가입
4. Supabase 대시보드에서 해당 사용자의 `users.role`을 `'admin'`으로 변경

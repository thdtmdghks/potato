# 서비스 홈페이지

소규모 서비스 회사를 위한 홈페이지. 공개 페이지 + 관리자 페이지 + PWA 푸시 알림.

## 시작하기

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm format
pnpm lint
```

## 환경변수

`.env.local.example` → `.env.local`로 복사 후 값 입력:

```
NEXT_PUBLIC_SUPABASE_URL=     # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
VAPID_PUBLIC_KEY=              # Web Push VAPID 공개키
VAPID_PRIVATE_KEY=             # Web Push VAPID 비밀키
```

Supabase 미연결 시에도 빌드/실행 가능 (데이터 없이 빈 화면 표시).

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) + TypeScript | 16.2 |
| Styling | Tailwind CSS | 4.2 |
| DB | Supabase PostgreSQL | - |
| Auth | Supabase Auth (이메일/비밀번호) | - |
| Storage | Supabase Storage (이미지) | - |
| Forms | react-hook-form + zod + @hookform/resolvers | 7.72 / 4.3 |
| Image | browser-image-compression (WebP 변환) | 2.0 |
| Push | web-push (PWA 푸시 알림) | 3.6 |
| Package Manager | pnpm | 10.33 |
| Code Quality | ESLint, Prettier, Husky, lint-staged, commitlint | - |
| Deploy | Vercel (무료 Hobby) | - |

## 프로젝트 구조

```
test/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── globals.css             # Tailwind 테마 + 디자인 토큰
│   │   ├── (public)/               # 공개 페이지 (Route Group)
│   │   │   ├── layout.tsx          # 헤더 + 푸터 + 모바일 메뉴
│   │   │   ├── page.tsx            # 홈
│   │   │   ├── about/page.tsx      # 회사소개
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # 포트폴리오 목록 (카테고리 필터)
│   │   │   │   └── [id]/page.tsx   # 포트폴리오 상세
│   │   │   ├── products/page.tsx   # 제품안내 (placeholder)
│   │   │   ├── inquiry/page.tsx    # 견적문의 (placeholder)
│   │   │   └── contact/page.tsx    # 연락처
│   │   └── admin/                  # 관리자 페이지 (Proxy 인증)
│   │       ├── layout.tsx          # 사이드바 + 모바일 토글
│   │       └── page.tsx            # 대시보드 (placeholder)
│   ├── lib/
│   │   ├── repositories.ts            # Repository 인터페이스 (DB 비의존)
│   │   ├── supabase-repositories.ts   # Supabase 구현체
│   │   ├── server-repositories.ts     # 서버용 팩토리 (진입점)
│   │   ├── supabase-server.ts         # 서버용 Supabase 클라이언트 (내부용)
│   │   ├── proxy-auth.ts              # Proxy용 인증 구현체 (Supabase)
│   │   ├── types.ts                   # DB 타입 (Project, Product, Inquiry)
│   │   ├── schemas.ts                # Zod 스키마 (폼 검증)
│   │   └── image.ts                  # 이미지 압축 (WebP, ≤200KB)
│   └── proxy.ts                    # /admin/* 인증 보호 (Next.js Proxy)
├── supabase/
│   ├── schema.sql                  # DB 테이블 + RLS 정책
│   └── seed.sql                    # 샘플 데이터
├── docs/
│   └── ARCHITECTURE.md             # 상세 아키텍처
├── AGENTS.md                       # AI 에이전트 규칙 (Claude, Gemini 자동 로드)
├── CLAUDE.md                       # Claude → AGENTS.md 참조
├── GEMINI.md                       # Gemini → AGENTS.md 참조
├── .cursorrules                    # Cursor → AGENTS.md 참조
├── .github/copilot-instructions.md # Copilot → AGENTS.md 참조
├── .mcp.json                       # Next.js MCP 서버 (AI 개발 도구 연동)
├── commitlint.config.ts            # Conventional Commits 규칙
├── .prettierrc                     # Prettier 설정
└── .env.local.example              # 환경변수 템플릿
```

## 아키텍처 원칙

### Repository 패턴 — Supabase 비의존

컴포넌트는 Supabase를 직접 접근하지 않습니다. Repository 인터페이스를 통해서만 데이터에 접근합니다.

```
컴포넌트 → getServerRepositories() → Repository 인터페이스
                                          ↓
                                    Supabase 구현체 (교체 가능)
```

```tsx
// 서버 컴포넌트에서 데이터 조회
const { projects } = await getServerRepositories();
const items = await projects.getAll(category);
```

백엔드 교체 시 `server-repositories.ts`의 팩토리 내부만 변경하면 됩니다.

### 클라이언트 DB 직접 접근 금지

모든 DB/Auth/Storage 접근은 서버에서만 수행합니다:
- **데이터 조회**: Server Component → Repository
- **데이터 변경**: 클라이언트 → API Route → Repository
- **인증**: Proxy → Supabase Auth (서버)
- **이미지 업로드**: 클라이언트에서 압축 → API Route → Storage

### 모바일 우선 (Mobile First)

Tailwind 반응형 접두사 = 최소 너비:

```
기본 (모바일)  →  sm: (640px+)  →  md: (768px+)  →  lg: (1024px+)
```

- 공개 페이지: 기본 1열 → `sm:` 2열 → `lg:` 3열 그리드
- 공개 헤더: 기본 햄버거 메뉴 → `md:` 가로 네비게이션
- 관리자: 기본 상단 토글 메뉴 → `md:` 사이드바 고정

## 구현 현황

### 완료
- [x] 프로젝트 초기 세팅 (Next.js + Tailwind + pnpm + 코드 품질 도구)
- [x] 공개 페이지 라우트 + 반응형 레이아웃 (모바일 우선, 햄버거 메뉴)
- [x] 포트폴리오 갤러리 (목록 + 상세 + 카테고리 필터, Repository 패턴)
- [x] AI 에이전트 협업 기반 (AGENTS.md, MCP, commitlint)
- [x] Repository 패턴 도입 (Supabase 결합도 분리)

### 미구현
- [ ] 제품 안내 (목록 + 상세 + 카테고리 그룹핑)
- [ ] 견적문의 폼 (react-hook-form + zod + API Route + DB 저장)
- [ ] 관리자 로그인 (Supabase Auth)
- [ ] 관리자 CRUD — 포트폴리오/제품 (이미지 업로드 WebP 압축)
- [ ] 관리자 문의 관리 (목록 + 상태 변경 + 필터)
- [ ] PWA 푸시 알림 (VAPID + Service Worker)
- [ ] PWA manifest + 설치 유도 + 오프라인
- [ ] SEO (메타태그 + OG + sitemap + robots)

## Git 규칙

Conventional Commits (commitlint 적용):

```
feat: 새 기능          fix: 버그 수정
docs: 문서 변경        style: 포맷팅
refactor: 리팩토링     chore: 빌드/설정
```

브랜치: `main` ← `feat/*`, `fix/*`, `docs/*`

## 비용

모든 서비스 무료 플랜. 초과 시 자동 과금 없이 서비스 일시 중단.

| 서비스 | 무료 한도 |
|--------|----------|
| Vercel | 대역폭 100GB/월 |
| Supabase DB | 500MB |
| Supabase Storage | 1GB |
| Supabase Auth | 50,000 MAU |

## 문서

- [상세 아키텍처](docs/ARCHITECTURE.md) — 시스템 구조, 데이터 흐름, DB 스키마
- [AI 에이전트 규칙](AGENTS.md) — 코딩 컨벤션, 프로젝트 규칙

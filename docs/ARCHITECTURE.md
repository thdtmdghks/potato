# Architecture

## System Overview

```
┌──────────────────────────────────────────────────┐
│              Frontend (Next.js on Vercel)         │
│                                                  │
│  ┌─────────────────┐  ┌───────────────────────┐  │
│  │  공개 페이지      │  │  관리자 페이지         │  │
│  │  (Server Comp.)  │  │  (Client + Server)    │  │
│  │                  │  │                       │  │
│  │  /               │  │  /admin (Proxy 보호)  │  │
│  │  /about          │  │  /admin/projects      │  │
│  │  /projects       │  │  /admin/products      │  │
│  │  /projects/[id]  │  │  /admin/inquiries     │  │
│  │  /products       │  │  /admin/login         │  │
│  │  /inquiry        │  │                       │  │
│  │  /contact        │  │                       │  │
│  └────────┬─────────┘  └──────────┬────────────┘  │
│           │                       │               │
│  ┌────────┴───────────────────────┴────────────┐  │
│  │         Server Layer (서버에서만 실행)        │  │
│  │                                             │  │
│  │  API Routes (/api/*)                        │  │
│  │  Server Components                          │  │
│  │  Proxy (인증 보호)                            │  │
│  │         ↓                                   │  │
│  │  Repository 인터페이스 (repositories.ts)     │  │
│  │         ↓                                   │  │
│  │  Supabase 구현체 (supabase-repositories.ts) │  │
│  └─────────────────────┬───────────────────────┘  │
└────────────────────────┼──────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────┐
│                 Supabase (무료 플랜)              │
├─────────────┬──────────────┬─────────────────────┤
│ PostgreSQL  │    Auth      │   Storage           │
│ (500MB)     │ (관리자 인증) │ (이미지 1GB)        │
└─────────────┴──────────────┴─────────────────────┘
```

**핵심 원칙: 클라이언트(브라우저)는 Supabase에 직접 접근하지 않는다.**

## Repository 패턴

```
컴포넌트 (Supabase를 모름)
  → getServerRepositories()
    → Repository 인터페이스 (repositories.ts)
      → Supabase 구현체 (supabase-repositories.ts)
        → Supabase REST API → PostgreSQL
```

### 인터페이스 (repositories.ts)
```ts
interface ProjectRepository {
  getAll(category?: string): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  getCategories(): Promise<string[]>;
  create(data): Promise<Project | null>;
  update(id, data): Promise<Project | null>;
  delete(id): Promise<boolean>;
}
// ProductRepository, InquiryRepository, StorageRepository, AuthRepository 동일 구조
```

### 사용법
```tsx
// Server Component
const { projects } = await getServerRepositories();
const items = await projects.getAll(category);
```

### 백엔드 교체 시
`server-repositories.ts`의 팩토리만 변경:
```ts
// 현재: Supabase
export async function getServerRepositories() {
  const supabase = await createServerSupabase();
  return { projects: new SupabaseProjectRepository(supabase), ... };
}

// 교체 후: NestJS API
export async function getServerRepositories() {
  return { projects: new ApiProjectRepository("https://api.example.com"), ... };
}
```

## 렌더링 전략

| 페이지 | 렌더링 방식 | 이유 |
|--------|------------|------|
| `/`, `/about`, `/contact` | Static (SSG) | 정적 콘텐츠 |
| `/projects`, `/products` | Dynamic (SSR) | DB에서 실시간 fetch |
| `/projects/[id]` | Dynamic (SSR) | 동적 파라미터 |
| `/inquiry` | Client Component | 폼 상태 관리 |
| `/admin/*` | Client + Server 혼합 | 인증 + CRUD |

## Data Flow

### 1. 데이터 조회 (Server Component → Repository)
```
브라우저 요청
  → Next.js Server Component
  → getServerRepositories().projects.getAll()
  → Supabase 구현체 → DB SELECT
  → HTML 렌더링 → 브라우저
```

### 2. 데이터 변경 (클라이언트 → API Route → Repository)
```
브라우저 (폼 입력)
  → POST /api/inquiry (API Route)
  → zod 서버 검증
  → getServerRepositories().inquiries.create()
  → Supabase 구현체 → DB INSERT
  → 200 OK → 브라우저
```

### 3. 이미지 업로드 (클라이언트 압축 → API Route → Storage)
```
브라우저 (파일 선택)
  → compressImage() (WebP 변환, ≤200KB, 클라이언트)
  → POST /api/upload (API Route)
  → getServerRepositories().storage.upload()
  → Supabase Storage
  → 공개 URL 반환
```

### 4. 이미지 조회
```
브라우저
  → Next.js <Image src={url} />
  → Vercel Image Optimization (포맷/크기 자동 최적화)
  → CDN 캐싱 → 응답
```

## 인증 흐름

```
/admin/* 접근
  → proxy.ts
  → Auth.js auth() 세션 확인 (DB 독립적)
  → 미인증 → /admin/login 리다이렉트
  → 인증됨 → 통과

/admin/login
  → Proxy 제외
  → POST /api/auth/login (API Route)
  → getServerRepositories().auth.signIn()
  → 성공 → /admin 리다이렉트
```

## 반응형 레이아웃 (모바일 우선)

```
기본 (0px+)  →  sm: (640px+)  →  md: (768px+)  →  lg: (1024px+)
```

### 공개 페이지
```
모바일 (기본)              데스크톱 (md:)
┌──────────────┐          ┌──────────────────────────┐
│ 서비스    ☰  │          │ 서비스  홈 회사소개 ...   │
├──────────────┤          ├──────────────────────────┤
│  콘텐츠 1열  │          │  콘텐츠 2~3열 그리드      │
├──────────────┤          ├──────────────────────────┤
│    푸터      │          │         푸터              │
└──────────────┘          └──────────────────────────┘
```

### 관리자
```
모바일 (기본)              데스크톱 (md:)
┌──────────────┐          ┌────────┬─────────────────┐
│ 관리자    ☰  │          │사이드바│                 │
├──────────────┤          │        │   콘텐츠         │
│   콘텐츠     │          │포트폴리오│                │
└──────────────┘          │제품    │                 │
                          │문의    │                 │
                          └────────┴─────────────────┘
```

## DB 스키마

### projects (포트폴리오)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| title | text | 제목 |
| description | text | 설명 |
| category | text | 카테고리 |
| images | text[] | 이미지 URL 배열 |
| created_at | timestamptz | 생성일 |

### products (제품)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| name | text | 제품명 |
| description | text | 설명 |
| category | text | 카테고리 |
| image | text | 대표 이미지 URL |
| features | text[] | 특징 목록 |
| created_at | timestamptz | 생성일 |

### inquiries (견적문의)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| name | text | 이름 |
| phone | text | 연락처 |
| email | text? | 이메일 (선택) |
| type | text | 문의 유형 |
| address | text | 주소 |
| content | text | 문의 내용 |
| status | text | 상태 (신규/확인/상담중/완료) |
| created_at | timestamptz | 생성일 |

### push_subscriptions (푸시 알림 구독)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| endpoint | text | 푸시 엔드포인트 |
| keys | jsonb | 암호화 키 |
| user_id | uuid (FK) | auth.users 참조 |
| created_at | timestamptz | 생성일 |

### RLS 정책
| 테이블 | SELECT | INSERT | UPDATE/DELETE |
|--------|--------|--------|--------------|
| projects | 누구나 | 인증 사용자 | 인증 사용자 |
| products | 누구나 | 인증 사용자 | 인증 사용자 |
| inquiries | 인증 사용자 | 누구나 | 인증 사용자 |
| push_subscriptions | 인증 사용자 | 인증 사용자 | 인증 사용자 |

SQL: `supabase/schema.sql`

## 디자인 토큰 (globals.css)

```css
--color-navy: #1B2A4A       /* bg-navy, text-navy */
--color-navy-light: #2A3F6A  /* bg-navy-light (hover) */
--color-navy-dark: #111D35   /* bg-navy-dark (footer, 사이드바) */
--color-gray-dark: #374151   /* text-gray-dark */
--color-gray-light: #F3F4F6  /* bg-gray-light */
```

## 비용

모든 서비스 무료 플랜. 초과 시 자동 과금 없이 서비스 일시 중단.

| 서비스 | 무료 한도 | 자동 과금 |
|--------|----------|----------|
| Vercel | 대역폭 100GB/월 | ❌ |
| Supabase DB | 500MB | ❌ |
| Supabase Storage | 1GB (~8,000장 WebP) | ❌ |

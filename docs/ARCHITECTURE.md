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
│  │  /               │  │  /admin (Auth.js 보호)│  │
│  │  /projects       │  │  /admin/projects      │  │
│  │  /projects/[id]  │  │  /admin/projects/new  │  │
│  │                  │  │                       │  │
│  └────────┬─────────┘  └──────────┬────────────┘  │
│           │                       │               │
│  ┌────────┴───────────────────────┴────────────┐  │
│  │         Server Layer (서버에서만 실행)        │  │
│  │                                             │  │
│  │  Server Components & Server Actions         │  │
│  │  Auth.js (인증 보호)                         │  │
│  │  Env Validation (Zod)                       │  │
│  │         ↓                                   │  │
│  │  Repository 인터페이스 (repositories.ts)     │  │
│  │         ↓                                   │  │
│  │  Supabase 구현체 (supabase-repositories.ts) │  │
│  │         ↓                                   │  │
│  │  Server Logger (logger.ts)                  │  │
│  └─────────────────────┬───────────────────────┘  │
└────────────────────────┼──────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────┐
│                 Supabase (무료 플랜)              │
├─────────────────────────┬────────────────────────┤
│ PostgreSQL              │   Storage              │
│ (500MB)                 │ (이미지 1GB)            │
└─────────────────────────┴────────────────────────┘
```

**핵심 원칙: 클라이언트(브라우저)는 Supabase에 직접 접근하지 않는다.**

## 3분할 디렉토리 구조

기존 `lib/` 디렉토리를 역할별로 3분할하여 관리합니다.

```
src/
├── server/     # 서버 전용 — Server Component, API Route에서만 import
│   ├── index.ts                  # getServerRepositories() 팩토리
│   ├── repositories.ts           # Repository 인터페이스 정의
│   ├── supabase-client.ts        # Supabase 서버 클라이언트 생성
│   ├── supabase-repositories.ts  # Supabase 구현체
│   └── logger.ts                 # Discord 웹훅 로거
│
├── client/     # 클라이언트 전용 — 브라우저에서 실행되는 유틸리티
│   └── ...
│
└── shared/     # 공용 — 서버/클라이언트 양쪽에서 사용 가능
    └── ...
```

| 디렉토리  | 실행 환경       | 용도                                |
| --------- | --------------- | ----------------------------------- |
| `server/` | 서버만          | DB 접근, 인증, Repository, API 로직 |
| `client/` | 브라우저만      | 폼 유틸, 이미지 압축, UI 헬퍼       |
| `shared/` | 서버 + 브라우저 | 타입 정의, 상수, 유효성 검증 스키마 |

## Supabase 의존 파일

Supabase에 직접 의존하는 파일은 **2개**뿐입니다:

| 파일                              | 역할                                    |
| --------------------------------- | --------------------------------------- |
| `server/supabase-client.ts`       | Supabase 서버 클라이언트 생성           |
| `server/supabase-repositories.ts` | Repository 인터페이스의 Supabase 구현체 |

백엔드 교체 시 이 2개 파일만 교체하면 됩니다.

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
  create(data): Promise<Project | null>;
  update(id, data): Promise<Project | null>;
  delete(id): Promise<boolean>;
}
// StorageRepository 동일 구조
```

### 사용법

```tsx
// Server Component
import { getServerRepositories } from "@/server";

const { projects } = await getServerRepositories();
const items = await projects.getAll(category);
```

### 백엔드 교체 시

`server/index.ts`의 팩토리만 변경:

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

| 페이지           | 렌더링 방식          | 이유                |
| ---------------- | -------------------- | ------------------- |
| `/`              | Static (SSG)         | 정적 콘텐츠         |
| `/projects`      | Dynamic (SSR)        | DB에서 실시간 fetch |
| `/projects/[id]` | Dynamic (SSR)        | 동적 파라미터       |
| `/admin/*`       | Client + Server 혼합 | 인증 + CRUD         |

## Data Flow

### 1. 데이터 조회 (Server Component → Repository)

```
브라우저 요청
  → Next.js Server Component
  → getServerRepositories().projects.getAll()
  → Supabase 구현체 → DB SELECT
  → HTML 렌더링 → 브라우저
```

### 2. 데이터 변경 (클라이언트 → Server Action → Repository)

```
브라우저 (폼 입력)
  → Server Action 호출 (예: createProject)
  → Zod 스키마 서버 검증
  → getServerRepositories().projects.create()
  → Supabase 구현체 → DB INSERT
  → 성공 여부 반환 및 클라이언트 라우터 갱신 (revalidatePath)
```

### 3. 이미지 업로드 (클라이언트 압축 → Server Action → Storage)

```
브라우저 (파일 선택)
  → compressImage() (WebP 압축, ≤200KB, 클라이언트)
  → Server Action 호출
  → getServerRepositories().storage.upload()
  → Supabase Storage 업로드
  → 공개 URL 반환 및 DB 레코드 매핑
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
/admin/* 접근 시도
  → proxy.ts (미들웨어)
  → Auth.js auth() 세션 확인
  ├─ 미인증 → /login?callbackUrl=원래주소 리다이렉트
  └─ 인증됨 → 통과

/login
  → Auth.js signIn("kakao", { callbackUrl })
  → 카카오 OAuth 인증 진행
  → 성공 시 원래 요청했던 callbackUrl로 동적 리다이렉트
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
│   콘텐츠     │          │시공사례│                 │
└──────────────┘          │        │                 │
                          └────────┴─────────────────┘
```

## DB 스키마 및 마이그레이션

### projects (포트폴리오)

| 컬럼        | 타입        | 설명            |
| ----------- | ----------- | --------------- |
| id          | uuid (PK)   | 자동 생성       |
| title       | text        | 제목            |
| description | text        | 설명            |
| category    | text        | 카테고리        |
| images      | text[]      | 이미지 URL 배열 |
| created_by  | text        | 생성자 관리자ID |
| created_at  | timestamptz | 생성일          |

### RLS 정책

| 테이블   | SELECT | INSERT      | UPDATE/DELETE |
| -------- | ------ | ----------- | ------------- |
| projects | 누구나 | 인증 사용자 | 인증 사용자   |

SQL 마이그레이션: [supabase/migrations/20260521000001_initial_schema.sql](file:///Users/a-26-001/Workspace/potato/supabase/migrations/20260521000001_initial_schema.sql)

---

## 실시간 에러 모니터링 및 환경변수 검증

### 1. 환경변수 정적 검증 (Env Validation)

애플리케이션 빌드 타임 및 서버 구동 즉시 `zod` 스키마([src/shared/env.ts](file:///Users/a-26-001/Workspace/potato/src/shared/env.ts))를 사용해 환경변수의 무결성을 파싱합니다. 누락되거나 부적절한 값(URL 오류 등)이 감지되면 서버는 즉시 구동을 멈추고 에러를 콘솔에 출력하여 배포 사고를 미연에 차단합니다.

### 2. 이원화 디스코드 웹훅 전송 아키텍처

Vercel Hobby(무료 플랜)의 짧은 로그 보존 한계를 극복하기 위해, 실시간으로 에러와 경고를 스마트폰 푸시로 모니터링할 수 있는 **이원화 디스코드 웹훅**을 구성합니다.

- **시스템 에러 (`DISCORD_ERROR_WEBHOOK_URL`)** 🔴
  - DB 쿼리 실패, 스토리지 업로드 에러, 기타 코딩 실수 등 서비스 핵심 동작 실패.
  - 전송 시 스택 트레이스의 상위 5줄과 시도했던 페이로드 데이터를 디스코드 카드로 전송. (관리자는 실시간 디스코드 푸시를 켜두고 대응)
- **경고 및 보안 감지 (`DISCORD_WARN_WEBHOOK_URL`)** 🟡
  - 비로그인 상태의 `/admin` 강제 진입, 비관리자의 로그인 시도, 비정상 API 파라미터 유입 등.
  - 전송 시 접근 IP, 쿼리, 시도 세션 정보 등을 카드 형태로 전송. (관리자는 이 채널의 알림을 무음으로 끄고 히스토리성 확인용으로만 활용)

모든 디스코드 알림 발송은 비동기 백그라운드(`Non-blocking fetch`)로 수행되어 사용자 측 트랜잭션 속도를 저하시키지 않습니다.

## 디자인 토큰 (globals.css)

```css
--color-navy: #1b2a4a /* bg-navy, text-navy */ --color-navy-light: #2a3f6a
  /* bg-navy-light (hover) */ --color-navy-dark: #111d35 /* bg-navy-dark (footer, 사이드바) */
  --color-gray-dark: #374151 /* text-gray-dark */ --color-gray-light: #f3f4f6 /* bg-gray-light */;
```

## 비용

모든 서비스 무료 플랜. 초과 시 자동 과금 없이 서비스 일시 중단.

| 서비스           | 무료 한도           | 자동 과금 |
| ---------------- | ------------------- | --------- |
| Vercel           | 대역폭 100GB/월     | ❌        |
| Supabase DB      | 500MB               | ❌        |
| Supabase Storage | 1GB (~8,000장 WebP) | ❌        |

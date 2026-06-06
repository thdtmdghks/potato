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
│  │  /reviews        │  │  /admin/reviews       │  │
│  │  /reviews/[id]   │  │                       │  │
│  │  /reviews/my     │  │                       │  │
│  │  /reviews/write  │  │                       │  │
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
│  │  Supabase 구현체 (supabase/*.ts)            │  │
│  │         ↓                                   │  │
│  │  Server Logger (logger.ts → Discord)        │  │
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

```
src/
├── server/     # 서버 전용 — Server Component, Server Action에서만 import
│   ├── index.ts              # getServerRepositories() 팩토리
│   ├── repositories.ts       # Repository 인터페이스 정의
│   ├── supabase-client.ts    # Supabase 서버 클라이언트 (retry 포함)
│   ├── supabase/             # Supabase 구현체 (도메인별 분리)
│   │   ├── project.ts
│   │   ├── review.ts
│   │   ├── review-edit.ts
│   │   └── storage.ts
│   ├── mock/                 # Mock 구현체 (DB 미연결 시 자동 전환)
│   ├── storage-utils.ts      # 이미지 업로드/삭제 유틸
│   └── logger.ts             # Discord 웹훅 로거
│
├── client/     # 클라이언트 전용 — 브라우저에서 실행되는 유틸리티
│   ├── use-image-upload.ts   # 이미지 압축/프리뷰 훅
│   └── use-menu-with-history.ts
│
├── shared/     # 공용 — 서버/클라이언트 양쪽에서 사용 가능
│   ├── types.ts              # DB 타입 정의
│   ├── schemas.ts            # Zod 검증 스키마
│   ├── constants.ts          # 공용 상수
│   ├── env.ts                # 환경변수 검증
│   ├── routes.ts             # 라우트 상수
│   └── utils.ts              # 순수 유틸 함수
│
└── app/
    ├── _components/          # 공용 UI 컴포넌트 (Button, Avatar, StatusBadge 등)
    ├── (public)/             # 공개 페이지
    │   └── _components/      # 공개 페이지 전용 (Header, Footer 등)
    └── admin/                # 관리자 페이지
        └── _components/      # 관리자 전용 (AdminLayoutClient 등)
```

| 디렉토리  | 실행 환경       | 용도                              |
| --------- | --------------- | --------------------------------- |
| `server/` | 서버만          | DB 접근, 인증, Repository, 로깅   |
| `client/` | 브라우저만      | 이미지 압축, 커스텀 훅, UI 헬퍼   |
| `shared/` | 서버 + 브라우저 | 타입 정의, 상수, Zod 스키마, 유틸 |

## Repository 패턴

```
Server Action / Server Component
  → getServerRepositories()
    → Repository 인터페이스
      ├─ SUPABASE_URL 있음 → Supabase 구현체 → PostgreSQL
      └─ SUPABASE_URL 없음 → Mock 구현체 (메모리)
```

### 에러 처리 흐름

```
Supabase Repository
  → DB 에러 발생 시 throw (로깅 안 함)
  → PGRST116 (row not found)만 null 반환

Server Action catch
  → logError(context, error, payload)
  → 사용자에게 "서버 오류가 발생했습니다." 반환
  → Discord에 맥락(누가/뭘 하다가/어떤 에러) 전송
```

### 사용법

```tsx
// Server Component
const { projects } = await getServerRepositories();
const items = await projects.getAll(category);

// Server Action
export async function createProject(formData: FormData) {
  try {
    const { projects } = await getServerRepositories();
    await projects.create(data);
    return { success: true as const };
  } catch (error) {
    logError("projects.create", error, { title });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}
```

## 렌더링 전략

| 페이지           | 렌더링 방식          | 이유                       |
| ---------------- | -------------------- | -------------------------- |
| `/`              | Dynamic (SSR)        | DB에서 시공사례/리뷰 fetch |
| `/projects`      | Dynamic (SSR)        | 카테고리 필터              |
| `/projects/[id]` | Dynamic (SSR)        | 동적 파라미터              |
| `/reviews`       | Dynamic (SSR)        | 승인된 리뷰 목록           |
| `/reviews/[id]`  | Dynamic (SSR)        | 동적 파라미터 + SEO        |
| `/reviews/write` | Dynamic (SSR)        | 세션 체크 + 링크 검증      |
| `/reviews/my`    | Dynamic (SSR)        | 세션 기반 조회             |
| `/admin/*`       | Client + Server 혼합 | 인증 + CRUD                |

## 반응형 레이아웃 (모바일 우선)

### 공개 페이지

```
모바일 (기본)              데스크톱 (md:)
┌──────────────┐          ┌──────────────────────────────┐
│ 경산창호   ☰  │          │ 경산창호  시공사례 고객후기 연락처│
├──────────────┤          ├──────────────────────────────┤
│  콘텐츠 1열  │          │  콘텐츠 2~3열 그리드          │
├──────────────┤          ├──────────────────────────────┤
│    푸터      │          │         푸터                  │
└──────────────┘          └──────────────────────────────┘
```

### 관리자

```
모바일 (기본)              데스크톱 (sm:)
┌──────────────┐          ┌──────────────────────────────┐
│경산창호|관리자│          │경산창호|관리자  대시보드 시공사례 리뷰│
│[대시보드][시공][리뷰]│   ├──────────────────────────────┤
├──────────────┤          │         콘텐츠                │
│   콘텐츠     │          │                              │
└──────────────┘          └──────────────────────────────┘
```

## DB 스키마

### projects (시공사례)

| 컬럼          | 타입        | 설명            |
| ------------- | ----------- | --------------- |
| id            | uuid (PK)   | 자동 생성       |
| title         | text        | 제목            |
| description   | text        | 설명            |
| category      | text        | 카테고리        |
| images        | text[]      | 이미지 URL 배열 |
| primary_image | text (null) | 대표 이미지 URL |
| created_by    | text        | 생성자 관리자ID |
| created_at    | timestamptz | 생성일          |

### reviews (고객 시공 후기)

| 컬럼          | 타입        | 설명                                            |
| ------------- | ----------- | ----------------------------------------------- |
| id            | uuid (PK)   | 수동 생성 (UUID v7, 링크 만료용)                |
| kakao_id      | text        | 작성자 카카오 ID                                |
| author_name   | text        | 작성자 이름                                     |
| author_avatar | text        | 작성자 아바타 URL                               |
| content       | text        | 후기 본문 (5~1000자)                            |
| images        | text[]      | 시공 완료 사진 URL 배열                         |
| primary_image | text (null) | 대표 이미지 URL                                 |
| rating        | int         | 별점 (1~5)                                      |
| status        | text        | 'pending' / 'approved' / 'rejected' / 'deleted' |
| created_at    | timestamptz | 생성일                                          |
| updated_at    | timestamptz | 최종 수정/승인일                                |

### review_edits (수정 요청 대기)

| 컬럼          | 타입        | 설명                                    |
| ------------- | ----------- | --------------------------------------- |
| review_id     | uuid (PK)   | `reviews.id` 외래키 (ON DELETE CASCADE) |
| content       | text        | 수정 요청 본문                          |
| images        | text[]      | 수정 요청 사진 URL 배열                 |
| primary_image | text (null) | 수정 요청 대표 이미지                   |
| rating        | int         | 수정 요청 별점                          |
| created_at    | timestamptz | 수정 요청 생성일                        |

## 인증 흐름

```
/admin/* 접근
  → proxy.ts (미들웨어)
  → Auth.js session 확인
  ├─ 미인증 → /login?callbackUrl= 리다이렉트 + logWarn
  ├─ 인증 + 비관리자 → /login?error=not-admin + logWarn
  └─ 관리자 → 통과

관리자 판단: ADMIN_KAKAO_IDS 환경변수에 카카오 ID 포함 여부
```

## 실시간 모니터링

### 로깅 레벨

| 함수          | Discord 채널   | 용도                      |
| ------------- | -------------- | ------------------------- |
| `logError` 🔴 | 에러 (알림 켬) | DB 장애, 예상치 못한 예외 |
| `logWarn` 🟡  | 경고 (알림 끔) | 비정상 접근, 권한 위반    |

### 에러 수집 경로

1. **Server Action catch** → `logError` (비즈니스 맥락 포함)
2. **error.tsx (클라이언트 바운더리)** → `reportUnexpectedError` Server Action → `logError`
3. **storage-utils deleteImages** → `.catch` 내 `logError` (fire-and-forget)

### 환경변수 검증

`next.config.ts` 진입점에서 Zod 스키마로 필수 환경변수 즉시 검증. 누락 시 빌드 차단.

## 비용

모든 서비스 무료 플랜. 초과 시 자동 과금 없이 서비스 일시 중단.

| 서비스           | 무료 한도           | 자동 과금 |
| ---------------- | ------------------- | --------- |
| Vercel           | 대역폭 100GB/월     | ❌        |
| Supabase DB      | 500MB               | ❌        |
| Supabase Storage | 1GB (~8,000장 WebP) | ❌        |

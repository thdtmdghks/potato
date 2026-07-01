# Suspense 패턴 통일 계획서

## 문제

홈(`/`)에서 프로젝트 상세(`/projects/[id]`)로 직접 이동 시, `projects/[id]/loading.tsx`(상세 스켈레톤) 대신 `projects/loading.tsx`(목록 스켈레톤)이 표시됨.

### 원인

Next.js App Router에서 `loading.tsx`는 해당 세그먼트의 page + **모든 하위 children**을 감싸는 암시적 `<Suspense>` boundary. 외부에서 세그먼트에 진입하면 상위 boundary가 먼저 잡힘.

### 근본 문제

`loading.tsx`는 boundary 범위를 개발자가 제어할 수 없음. 세그먼트 전체에 걸리므로:

- 정적 UI(제목, 필터)까지 스켈레톤으로 가려짐
- 중첩 라우트 간 의도치 않은 fallback 간섭 발생

## 의사결정

`loading.tsx` 전체 제거 → 각 `page.tsx`에서 `<Suspense>` 직접 배치.

- Next.js 공식 문서 Examples에서도 안내하는 패턴
- ADR-018에 상세 기록

## 컨벤션 변경

### 핵심 규칙

1. `loading.tsx` 사용 금지
2. `async` 컴포넌트는 반드시 어딘가의 `<Suspense>` 안에 있어야 함
3. Suspense는 **사용자에게 먼저 보여줄 수 있는 UI와 기다려야 하는 UI의 경계**에 배치
4. page.tsx에서 최소 1개의 Suspense로 메인 데이터 영역을 감싸는 것이 기본
5. 하위 컴포넌트에서 독립적인 추가 fetch가 있으면 그 자리에 Suspense 추가

### page.tsx 역할

- `generateMetadata` / `generateStaticParams` (page에서만 가능)
- Suspense boundary 배치
- params/searchParams를 하위에 전달
- 정적 UI(제목, 필터 등)를 Suspense 밖에 배치하여 즉시 렌더

```tsx
// Case 1: 단순 — 전체를 async 컴포넌트로 위임
export default async function Page({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<Skeleton />}>
      <ProjectDetail id={id} />
    </Suspense>
  );
}

// Case 2: 정적 UI + 데이터 분리
export default function Page() {
  return (
    <main>
      <h1>시공사례</h1>
      <CategoryFilter />
      <Suspense fallback={<ListSkeleton />}>
        <ProjectList />
      </Suspense>
    </main>
  );
}

// Case 3: 독립 데이터 병렬 로딩
export default function Page() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<CarouselSkeleton />}>
        <ProjectCarouselData />
      </Suspense>
      <Suspense fallback={<ReviewSkeleton />}>
        <ReviewCarouselData />
      </Suspense>
    </main>
  );
}
```

### 데이터 로딩 컴포넌트 (`_components/`) 역할

- `await`로 데이터 fetch
- 조건 분기 (`notFound()`, 인증 체크 등)
- 가져온 데이터로 UI 렌더링
- 하위에 독립 fetch가 있으면 추가 Suspense 배치 가능

### 파일 구조

```
route/
├── page.tsx                    ← Suspense 배치 + generateMetadata
├── _components/
│   ├── project-list.tsx        ← async, 데이터 로딩 + 렌더링
│   └── project-list-skeleton.tsx ← fallback 스켈레톤
└── _utils.ts                   ← cache, generateStaticParams 등
```

## 작업 대상 (11개 페이지)

### 공개 (7개)

| #   | 경로             | 비고                                        |
| --- | ---------------- | ------------------------------------------- |
| 1   | `/`              | 프로젝트 캐러셀 + 리뷰 캐러셀 각각 Suspense |
| 2   | `/projects`      | 카테고리 필터(즉시) + 목록(Suspense)        |
| 3   | `/projects/[id]` | 전체를 Content로 분리                       |
| 4   | `/reviews`       | 목록 Suspense                               |
| 5   | `/reviews/[id]`  | 전체를 Content로 분리                       |
| 6   | `/reviews/my`    | 인증 + 데이터 로딩 Suspense                 |
| 7   | `/reviews/write` | 초대링크 검증 + 데이터 로딩 Suspense        |

### 관리자 (4개)

| #   | 경로                        | 비고                       |
| --- | --------------------------- | -------------------------- |
| 8   | `/admin`                    | 통계 카드 Suspense         |
| 9   | `/admin/projects`           | 목록 Suspense              |
| 10  | `/admin/projects/[id]/edit` | 기존 데이터 fetch Suspense |
| 11  | `/admin/reviews`            | 목록 Suspense              |

## 삭제 대상

- `src/app/(public)/projects/loading.tsx`
- `src/app/(public)/projects/[id]/loading.tsx`

## 커밋 단위

1. 계획서 + ADR 커밋
2. projects 목록/상세 (loading.tsx 삭제 + Suspense 전환) — 문제 해결 커밋
3. 홈 Suspense
4. reviews 4개 묶음
5. admin 4개 묶음
6. AGENTS.md + ARCHITECTURE.md 문서 정비

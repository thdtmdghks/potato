# 다음 작업 가이드

이 문서는 다음 작업자(사람 또는 AI 에이전트)가 바로 이어받을 수 있도록 작성되었습니다.

## 현재 상태

프로젝트 기반 구조 완료. 모든 페이지가 라우트만 있고 내용은 placeholder 상태.
Mock Repository가 동작하므로 **Supabase 연결 없이 개발 가능**.

## 다음 작업: 와이어프레임 프로토타입

Mock 데이터 + placeholder 이미지로 전체 페이지 흐름을 구현한다.
디자인은 최소한, **레이아웃과 데이터 흐름 확인**이 목적.

### 이미지

저작권 무료 placeholder 이미지 사용:
```
https://picsum.photos/seed/{고유값}/{너비}/{높이}
```
- seed 값으로 고정 이미지 보장 (예: `seed/project1/800/600`)
- Next.js `<Image>` 컴포넌트 사용 시 `next.config.ts`에 `picsum.photos` 도메인 추가 필요

### 작업 순서

#### 1. Mock 데이터 보강 (`src/server/mock-repositories.ts`)
- 이미지 URL을 picsum.photos로 변경
- 포트폴리오 5~6건, 제품 4~5건, 문의 3~4건으로 확대
- 다양한 카테고리 포함

#### 2. 홈 페이지 (`src/app/(public)/page.tsx`)
- 히어로 섹션: 한 줄 소개 + CTA 버튼 (견적문의 링크)
- 서비스 소개: 아이콘 + 짧은 설명 3~4개
- 포트폴리오 하이라이트: 최근 3개 카드 + "더보기" 링크 (Mock 데이터에서 조회)
- 제품 요약: 대표 2~3개 + "더보기" 링크
- 견적문의 CTA: 문구 + 버튼
- **Server Component** — `getServerRepositories()`로 데이터 조회

#### 3. 포트폴리오 목록/상세 개선 (`src/app/(public)/projects/`)
- 이미 구현되어 있음. 이미지 표시 + 카드 레이아웃 보강
- 모바일 1열 → md: 2열 → lg: 3열 그리드

#### 4. 제품 안내 (`src/app/(public)/products/page.tsx`)
- 현재 placeholder → 목록 구현
- 카테고리별 그룹핑
- 카드: 이미지 + 제품명 + 특징 목록
- **Server Component**

#### 5. 견적문의 (`src/app/(public)/inquiry/page.tsx`)
- 현재 placeholder → 폼 UI 구현
- react-hook-form + zod (`@/shared/schemas`의 `inquirySchema`)
- **"use client"** 컴포넌트
- 제출은 아직 API Route 없이 `console.log`로 확인

#### 6. 회사소개, 연락처 내용 채우기
- `about/page.tsx`: 회사 소개 텍스트 + 연혁 (더미)
- `contact/page.tsx`: 연락처 정보 + 지도 placeholder

#### 7. 관리자 대시보드 (`src/app/admin/page.tsx`)
- 현재 placeholder → 요약 카드 (포트폴리오 N건, 제품 N건, 문의 N건)
- 최근 문의 목록 테이블
- **Server Component**

#### 8. 공통 헤더에 다크모드 토글
- `src/app/(public)/layout.tsx` 헤더에 토글 버튼 추가
- `@/client/theme`의 `setTheme()` 사용
- 아이콘: 해/달 (SVG 또는 이모지)

---

## 도메인 확정 후 작업: 콘텐츠/SEO

회사명·업종·도메인이 확정된 후 진행한다. 와이어프레임 완성이 선행 조건.

### 9. 콘텐츠 교체 (더미→실제 데이터)
- Mock 데이터의 텍스트·이미지를 실제 회사 정보로 교체
- picsum.photos → 실제 이미지 (Supabase Storage)
- 회사소개·연혁·연락처 실제 정보 반영

### 10. 페이지별 메타데이터 설정
- 루트 `layout.tsx`에 `metadataBase: new URL('https://확정도메인')` 설정
- 고정 페이지 (홈, 소개, 연락처, 견적문의, 목록): 정적 `export const metadata`
  - title, description, openGraph (title, description, images)
- 동적 페이지 (`projects/[id]` 등): `generateMetadata()`
  - DB에서 데이터 조회 → 제목·설명·OG 이미지 동적 생성
  - 데이터 없으면 `notFound()` 처리
  - React `cache()`로 페이지 본문과 메타데이터 간 중복 fetch 방지

### 11. JSON-LD 구조화 데이터
- **Organization**: 홈 또는 루트 레이아웃. 회사명, URL, 로고, 연락처
- **BreadcrumbList**: 모든 페이지. `홈 > 포트폴리오 > 프로젝트명` 경로
- **Product 또는 Service**: 제품/서비스 상세. 도메인에 맞는 스키마 선택
  - 정형 가격이 있으면 Product, 없으면 Service
- 주의: 실제 콘텐츠와 반드시 일치해야 함 (불일치 시 스팸 판정)

### 12. sitemap.xml / robots.txt / canonical
- `src/app/sitemap.ts`: 정적 URL + 동적 URL (Repository에서 조회)
  - `lastModified`로 변경된 페이지만 재크롤링 유도
- `src/app/robots.ts`: `allow: '/'`, `disallow: '/admin/'`, sitemap URL 명시
- admin `layout.tsx`에 `<meta name="robots" content="noindex">` 추가
  - robots.txt의 disallow는 크롤링 차단이지 인덱싱 차단이 아님
- canonical: `metadataBase` 설정으로 자동 적용. 쿼리 파라미터 중복 방지

### 13. SEO 검증 및 커밋
- Google Rich Results Test로 구조화 데이터 검증
- Lighthouse SEO 점수 확인 (목표: 90+)
- OG 미리보기 테스트 (카카오톡, 슬랙 등)
- 빌드/테스트 통과 후 커밋

### 14. 성능 최적화 및 접근성 검사

**성능 최적화**
- ISR/SSG 적용: 정적 페이지에 `revalidate` 설정 (홈, 소개, 연락처 → SSG, 포트폴리오/제품 → ISR)
- Lighthouse Performance 점수 측정 (목표: 90+)
- Core Web Vitals 확인: LCP(2.5s 이하), INP(200ms 이하), CLS(0.1 이하)
- `next/image`에 `sizes`, `priority`(LCP 이미지) 속성 최적화
- 번들 분석: `@next/bundle-analyzer`로 불필요한 클라이언트 JS 확인
- 불필요한 `"use client"` 제거 — Server Component로 전환 가능한 부분 점검

**접근성 검사**
- Lighthouse Accessibility 점수 측정 (목표: 90+)
- axe-core 또는 브라우저 확장으로 자동 검사
- 키보드 네비게이션: Tab 순서, Enter/Space 동작, 포커스 표시
- aria 레이블: 이미지 alt, 버튼/링크 레이블, 폼 필드 연결
- 색상 대비: WCAG AA 기준 (일반 텍스트 4.5:1, 큰 텍스트 3:1), 다크모드 포함
- 스크린 리더 테스트: 시멘틱 태그 + heading 계층 확인
- 문제 수정 후 빌드/테스트 통과, 커밋

---

### 기술적 결정사항

| 결정 | 내용 | 이유 |
|------|------|------|
| 인증 | Auth.js v5, JWT 쿠키 | DB 독립적, 서버리스 호환 |
| 세션 전략 | JWT (database 아님) | Redis 불필요, 소규모에 적합 |
| 다크모드 | OS 기본 + 토글, localStorage | FOUC 방지 인라인 스크립트 적용됨 |
| 이미지 | picsum.photos (개발), Supabase Storage (운영) | 저작권 무료 |
| 폼 | react-hook-form + zod | 클라이언트 검증 + 서버 재검증 |
| 데이터 조회 | Server Component → getServerRepositories() | 클라이언트 DB 접근 금지 |
| 데이터 변경 | Client → API Route → Repository (예정) | 서버에서만 DB 접근 |
| 머지 전략 | develop → main `--no-ff` 머지 커밋 | 히스토리 추적 가능 |
| 정적 메타 | 고정 페이지에 `export const metadata` | 불필요한 DB 호출 없음 |
| 동적 메타 | `[id]` 등 동적 라우트에 `generateMetadata()` | 페이지별 고유 title/OG |
| JSON-LD | Organization + BreadcrumbList + Product/Service | 리치 스니펫, Knowledge Panel |
| sitemap | `src/app/sitemap.ts` 동적 생성 | 새 페이지 빠른 인덱싱 |
| canonical | `metadataBase`로 자동 적용 | 중복 URL 점수 집중 |
| 캐싱 전략 | 정적 페이지 SSG, 동적 페이지 ISR (`revalidate`) | 서버 부하 최소화, CDN 서빙 |
| 접근성 | WCAG AA 기준, 시멘틱 태그, 키보드 네비게이션 | 법적 요건 + SEO 가산점 |

### 주의사항

- 모든 UI에 `dark:` 변형 필수
- 시멘틱 태그 사용 (`<section>`, `<article>`, `<nav>` 등), `<div>` 남용 금지
- 모바일 우선 — 기본 스타일이 모바일, `md:`/`lg:`로 확장
- `src/server/`는 클라이언트에서 import 금지
- 커밋은 `develop` 브랜치에, Conventional Commits 한글

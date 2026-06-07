# SEO 전략 및 적용 현황

이 문서는 프로젝트에서 검색 엔진 최적화를 위해 적용한 기술적 조치와 기대 효과를 정리합니다.

---

## 1. 메타데이터 (Title + Description)

| 페이지                         | title                               | description 키워드                              |
| ------------------------------ | ----------------------------------- | ----------------------------------------------- |
| 홈 `/`                         | 경산창호 - 경산 대구 샤시 전문 시공 | 샤시, 샷시, 창호, 당일 시공, 전화번호           |
| 시공사례 `/projects`           | 시공사례 갤러리 \| 경산창호         | 하이샤시, 방충망, 복층유리, ABS도어, 방범창     |
| 프로젝트 상세 `/projects/[id]` | {제목} \| 경산창호 시공사례         | 프로젝트별 description + OG image               |
| 고객 후기 `/reviews`           | 고객 시공 후기 \| 경산창호          | 경산 대구 샤시 시공 고객 후기, 당일 시공 만족도 |
| 리뷰 상세 `/reviews/[id]`      | {작성자}님의 시공 후기 \| 경산창호  | 본문 150자 발췌 + OG image (대표사진)           |

**기대 효과:** 구글/네이버에서 "경산 샤시", "대구 샷시 후기" 등 검색 시 페이지별 맞춤 스니펫 노출.

---

## 2. Open Graph 이미지

- 홈: `/og-image.png` (1200×630, 브랜드 이미지)
- 프로젝트 상세: 대표 시공사진 (실제 완공 이미지)
- 리뷰 상세: 대표 시공사진

**기대 효과:** 카카오톡/SNS 공유 시 시공 완료 사진이 썸네일로 노출되어 클릭률 상승.

---

## 3. 구조화 데이터 (JSON-LD)

`/projects/[id]`에 `HomeAndConstructionBusiness` 스키마 적용:

- **업체 기본 정보**: name, telephone, url
- **주소**: PostalAddress (경산시 원효로40길 64-8)
- **위경도 좌표**: GeoCoordinates (latitude: 35.8306, longitude: 128.7562) — 구글 지도/로컬 검색 연동
- **시공 서비스 카탈로그**: `hasOfferCatalog` → `OfferCatalog` → `Service` 형태로 실제 시공 품목(카테고리 + 제목 + 설명)을 구조화

**기대 효과:**

- 구글 검색 결과에 리치 스니펫(전화번호, 주소, 지도) 노출
- 로컬 검색("내 주변 샤시 업체") 상위 노출
- GEO(지역 검색) + AEO(답변 엔진 최적화) 시너지 — 위치 기반 쿼리에서 비즈니스 카드 형태 노출 가능

---

## 4. 사이트맵 (`/sitemap.xml`)

**Vercel Edge 캐시 (ISR - `revalidate = 3600`)**

1시간 주기로 사이트맵을 재생성하여 엣지 노드에 정적 캐싱. 구글 봇 요청 시 DB 커넥션 타임아웃 없이 즉시 HIT 응답.

포함 URL:

- 홈, `/projects`, `/reviews` (정적)
- `/projects/[id]` — 모든 시공사례 (lastModified: created_at)
- `/reviews/[id]` — 모든 승인된 리뷰 (lastModified: updated_at)

**기대 효과:** 새 시공사례/리뷰 등록 시 최대 1시간 내 구글 발견. 엣지 캐싱으로 봇 응답 속도 극대화.

---

## 5. robots.txt

```
User-Agent: *
Allow: /
Disallow: /admin/
Sitemap: https://potato-swart.vercel.app/sitemap.xml
```

**기대 효과:** 관리자 페이지 색인 방지, 크롤 예산 공개 페이지에 집중.

---

## 6. Canonical URL

모든 공개 페이지에 **도메인 포함 절대경로** Canonical URL 적용:

| 페이지           | canonical                                       |
| ---------------- | ----------------------------------------------- |
| `/projects`      | `https://potato-swart.vercel.app/projects`      |
| `/projects/[id]` | `https://potato-swart.vercel.app/projects/{id}` |
| `/reviews`       | `https://potato-swart.vercel.app/reviews`       |
| `/reviews/[id]`  | `https://potato-swart.vercel.app/reviews/{id}`  |

**기대 효과:** 상대경로 canonical 사용 시 발생할 수 있는 구글 서치 콘솔 색인 제외 버그 방어. 중복 URL(쿼리 파라미터, trailing slash 등) 발생 시 검색 엔진이 정규 URL로 통합.

---

## 7. 렌더링 전략 (SEO 관점)

| 페이지           | 방식          | 이유                             |
| ---------------- | ------------- | -------------------------------- |
| 홈               | SSR (매 요청) | 최신 시공사례/리뷰 즉시 반영     |
| `/projects`      | SSR           | searchParams(카테고리 필터) 사용 |
| `/projects/[id]` | SSR           | 동적 파라미터                    |
| `/reviews`       | ISR (60초)    | 목록 캐시 + 주기적 갱신          |
| `/reviews/[id]`  | SSR           | 동적 파라미터                    |
| `/sitemap.xml`   | ISR (1시간)   | 엣지 캐시로 봇 응답 최적화       |

**기대 효과:** 모든 공개 페이지가 서버에서 완전한 HTML 렌더링 → 크롤러가 JS 실행 없이 콘텐츠 수집 가능.

---

## 8. 시멘틱 HTML

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 사용
- 리뷰 상세: `<article>` 래핑
- 이미지: `alt` 속성에 "경산창호 시공 완료 사진" 등 키워드 포함

**기대 효과:** 크롤러가 페이지 구조를 정확히 이해, 적절한 섹션을 검색 결과에 표시.

---

## 9. 이미지 최적화

- `next/image` 사용 → WebP 자동 변환 + Vercel CDN 캐싱
- `sizes` 속성으로 뷰포트별 적절한 크기 로드
- 업로드 시 클라이언트에서 WebP 200KB 이하 압축

**기대 효과:** 페이지 로드 속도 개선 → Core Web Vitals 점수 향상 → 검색 순위 가산점.

---

## 향후 개선 (Phase)

- [x] 구글 Search Console 등록 + 사이트맵 제출
- [ ] 파비콘 (현재 Vercel 기본)
- [ ] 커스텀 도메인 연결 후 metadataBase 및 canonical URL 업데이트
- [ ] Phase 6: 시공사례 등록 시 SEO/GEO 팩트 자동 완성 어드민 가이드 구현 및 상세 팩트 박스 동적 렌더링

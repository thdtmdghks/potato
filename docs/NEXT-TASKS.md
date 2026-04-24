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

### 주의사항

- 모든 UI에 `dark:` 변형 필수
- 시멘틱 태그 사용 (`<section>`, `<article>`, `<nav>` 등), `<div>` 남용 금지
- 모바일 우선 — 기본 스타일이 모바일, `md:`/`lg:`로 확장
- `src/server/`는 클라이언트에서 import 금지
- 커밋은 `develop` 브랜치에, Conventional Commits 한글

# Project Rules

## Overview

경산창호 — 창호 시공 전문 업체 홈페이지. 원페이지 스크롤 랜딩(히어로 → 서비스 → 시공사례 → 강점 → 연락처) + 시공사례 갤러리 별도 페이지 + 관리자 페이지(시공사례/서비스 CRUD, 문의 관리).

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **DB/Storage**: Supabase (PostgreSQL, Storage) — Repository 패턴으로 추상화됨
- **Auth**: Auth.js v5 (next-auth) — 카카오 로그인, JWT 쿠키, DB role 기반 관리자
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Image**: browser-image-compression (WebP 변환, 최대 200KB)
- **Push**: web-push (PWA 푸시 알림)
- **Package Manager**: pnpm
- **Test**: Vitest + @testing-library/react
- **Dark Mode**: OS 기본 + 토글 (Tailwind `dark:` + localStorage)
- **Deploy**: Vercel (무료 Hobby)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # 공개 페이지 (원페이지 랜딩, 시공사례 갤러리)
│   ├── admin/             # 관리자 페이지 (인증 + role 필요)
│   ├── api/auth/          # Auth.js API Route 핸들러
│   ├── login/             # 카카오 로그인 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 글로벌 스타일 + Tailwind 테마
├── server/                    # 서버 전용 (DB 접근, 시크릿 사용)
│   ├── repositories.ts        # Repository 인터페이스 (DB 비의존)
│   ├── supabase-repositories.ts # Supabase 구현체
│   ├── mock-repositories.ts   # Mock 구현체 (개발/테스트용)
│   ├── supabase-client.ts     # Supabase 연결
│   └── index.ts               # getServerRepositories() 팩토리 (Mock/Supabase 자동 전환)
├── client/                    # 클라이언트 전용 (브라우저 API)
│   ├── image.ts               # 이미지 압축 유틸리티
│   └── theme.ts               # 다크모드 토글 (localStorage)
├── shared/                    # 서버/클라이언트 공용 (순수 로직)
│   ├── types.ts               # DB 타입 정의
│   └── schemas.ts             # Zod 스키마 (폼 유효성 검사)
├── auth.ts                # Auth.js 설정 (카카오 프로바이더 + role 콜백)
├── proxy.ts               # /admin/* 경로 인증+role 보호 (Next.js middleware)
db/                            # DB 설정 (런타임 아님, 수동 적용)
├── schema.sql             # DB 테이블 생성 SQL (users 포함)
└── seed.sql               # 샘플 데이터
```

## Architecture Principles

- **서버/클라이언트/공용 3분할**: `server/`(DB, 시크릿), `client/`(브라우저 API), `shared/`(타입, 스키마). 폴더 경계를 넘는 import 금지 (`client/`에서 `server/` import 불가).
- **클라이언트는 DB를 직접 접근하지 않는다.** 모든 DB/Storage 접근은 서버(Server Component, API Route)에서만.
- **Repository 패턴**: 컴포넌트 → Repository 인터페이스 → 구현체. 백엔드 교체 시 구현체만 변경.
- **인증은 DB와 독립적**: Auth.js가 인증 담당. 카카오 로그인 후 users 테이블에서 role 조회 → 세션에 반영.
- **모바일 최우선**: 사용자 대부분이 모바일 환경. 모든 UI는 모바일 화면(320px~)을 최우선으로 설계하고, `sm:`/`md:`/`lg:`로 데스크톱을 확장한다.

## Page Structure

### 공개 페이지 (원페이지 스크롤 랜딩)

- `/` — 히어로 → 서비스(#services) → 시공사례(#gallery) → 강점(#about) → 연락처(#contact)
- `/projects` — 시공사례 갤러리 (전체 보기, 카테고리 필터)
- `/projects/[id]` — 시공사례 상세

### 숨김 페이지 (네비게이션 미노출, 라우트 유지)

- `/about` — 회사소개 (추후 활용 가능)
- `/products` — 서비스 상세 (추후 활용 가능)
- `/inquiry` — 견적문의 폼 (추후 활용 가능)
- `/contact` — 연락처 (홈 섹션으로 대체)

### 관리자 페이지

- `/admin` — 대시보드
- `/admin/projects` — 시공사례 관리 (CRUD)
- `/admin/products` — 서비스 관리 (CRUD)
- `/admin/inquiries` — 문의 관리

### 인증

- `/login` — 카카오 로그인 페이지
- 관리자 접근: 카카오 로그인 → users.role='admin' 확인 → 관리자 버튼 노출

## Mobile First (최우선 원칙)

모바일 사용자가 주 타겟이므로 아래 규칙을 모든 UI 작업에 적용한다.

- **터치 타겟**: 모든 버튼/링크는 최소 44×44px (WCAG 2.5.5). `min-h-11` 또는 충분한 패딩 사용.
- **이미지 비율**: 고정 높이(`h-48`) 대신 `aspect-4/3` 등 비율 기반. 화면 폭에 비례해 자연스럽게 조절.
- **가로 스크롤**: 카테고리 필터 등 항목이 많은 UI는 `overflow-x-auto`로 가로 스크롤. `flex-wrap`으로 여러 줄 금지.
- **테이블 → 카드**: 모바일에서 테이블은 카드형 레이아웃(`md:hidden` / `hidden md:block`)으로 대체.
- **폼 필드**: 모바일에서 1열, `sm:grid-cols-2`로 확장. 입력 필드는 충분한 크기(`py-2` 이상).
- **텍스트 오버플로우**: 긴 텍스트는 `line-clamp-2` 등으로 잘림 처리.
- **네비게이션**: 모바일 햄버거 메뉴 필수. 메뉴 링크 터치 타겟 확보(`py-3` 이상).

## Coding Conventions

- **Language**: TypeScript strict mode. `any` 사용 금지.
- **Components**: Server Component 기본. 클라이언트 상태가 필요할 때만 `"use client"`.
- **Naming**: 컴포넌트 PascalCase, 함수/변수 camelCase, 파일명 kebab-case (Next.js 라우트 제외).
- **Styling**: Tailwind 유틸리티 클래스 사용. 커스텀 CSS 최소화.
- **HTML**: 시멘틱 태그 필수 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`). `<div>` 남용 금지. `<a>` 안에 `<article>` 금지.
- **Design tokens**: 네이비(`text-navy`, `bg-navy`), 액센트(`text-accent`, `bg-accent`), 다크그레이(`text-gray-dark`), 라이트그레이(`bg-gray-light`). globals.css 참고.
- **Dark mode**: 모든 UI에 `dark:` 변형 필수. 테마 토글은 `@/client/theme`의 `setTheme()` 사용.
- **Imports**: `@/*` alias 사용. 서버 코드는 `@/server/`, 클라이언트 코드는 `@/client/`, 공용은 `@/shared/`.
- **Data access**: 서버에서 `getServerRepositories()` 사용 (`@/server`에서 import). 클라이언트에서 DB 직접 접근 금지.
- **Forms**: react-hook-form + zod 스키마로 유효성 검사. 스키마는 `src/shared/schemas.ts`에 정의. `<fieldset>`에 직접 grid/flex 금지 (Firefox 버그), `<div>` 래퍼 사용.
- **Images**: 업로드 시 `compressImage()` 사용 (`@/client/image`). 표시 시 Next.js `<Image>` 컴포넌트 필수.
- **Accessibility**: `label`/`input`은 `id`/`htmlFor`로 명시적 연결. 에러 메시지는 `aria-describedby`로 연결. 테이블 `<th>`에 `scope="col"` 필수.

## Testing

- **Runner**: Vitest + @testing-library/react
- **테스트 위치**: `src/__tests__/` (소스 구조 미러링)
- **실행**: `pnpm test` (단일 실행), `pnpm test:watch` (감시 모드)
- **백엔드 테스트**: Repository, 스키마, 유틸리티 유닛 테스트
- **프론트엔드 테스트**: 컴포넌트 렌더링 + 인터랙션 테스트 (MSW로 API 모킹)
- **Mock 전환**: `USE_MOCK=true` 또는 `NEXT_PUBLIC_SUPABASE_URL` 미설정 시 자동으로 Mock Repository 사용

## Git Conventions

- **Branch**: `main` ← `develop` ← `feat/*`, `fix/*`, `docs/*`
- **Commit**: Conventional Commits 필수 (commitlint 적용됨). 본문은 한글 사용.
  - 타입: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`
  - 제목은 `타입: 한글 설명` 형식 (50자 이내)
  - 본문에 변경 사항 목록 기재
  - 예시:

    ```
    feat: 원페이지 랜딩 구조로 홈 페이지 재구성

    - 히어로 + 서비스 + 시공사례 + 강점 + 연락처 섹션
    - 앵커 네비게이션 적용
    - 플로팅 CTA 전화 버튼 추가
    ```

- **PR**: 기능 하나 = PR 하나. 한국어 제목 가능.

## Important Notes

- 모든 서비스 무료 플랜. 외부 유료 서비스 추가 금지.
- Supabase Storage 1GB 제한 → 이미지 반드시 압축 후 업로드.
- `/admin/*` 경로는 middleware로 인증+role 보호됨. role='admin'만 접근 가능.
- 자세한 아키텍처는 `docs/ARCHITECTURE.md` 참고.
- 다음 작업 가이드는 `docs/NEXT-TASKS.md` 참고.

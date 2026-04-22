# Project Rules

## Overview

소규모 서비스 회사의 홈페이지. 공개 페이지(홈, 회사소개, 포트폴리오, 제품안내, 견적문의, 연락처) + 관리자 페이지(포트폴리오/제품 CRUD, 문의 관리) + PWA 푸시 알림.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **DB/Auth/Storage**: Supabase (PostgreSQL, Auth, Storage) — Repository 패턴으로 추상화됨
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Image**: browser-image-compression (WebP 변환, 최대 200KB)
- **Push**: web-push (PWA 푸시 알림)
- **Package Manager**: pnpm
- **Deploy**: Vercel (무료 Hobby)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # 공개 페이지 (홈, 회사소개, 포트폴리오, 제품, 견적문의, 연락처)
│   ├── admin/             # 관리자 페이지 (인증 필요)
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 글로벌 스타일 + Tailwind 테마
├── lib/
│   ├── repositories.ts        # Repository 인터페이스 (DB 비의존)
│   ├── supabase-repositories.ts # Supabase 구현체
│   ├── server-repositories.ts # 서버용 팩토리 (진입점)
│   ├── supabase-server.ts     # 서버용 Supabase 클라이언트 (내부용)
│   ├── proxy-auth.ts          # Proxy용 인증 구현체 (Supabase)
│   ├── types.ts               # DB 타입 정의
│   ├── schemas.ts             # Zod 스키마 (폼 유효성 검사)
│   └── image.ts               # 이미지 압축 유틸리티
├── proxy.ts               # /admin/* 경로 인증 보호 (Next.js Proxy)
supabase/
├── schema.sql             # DB 테이블 생성 SQL
└── seed.sql               # 샘플 데이터
```

## Architecture Principles

- **클라이언트는 Supabase를 직접 접근하지 않는다.** 모든 DB/Auth/Storage 접근은 서버(Server Component, API Route)에서만.
- **Repository 패턴**: 컴포넌트 → Repository 인터페이스 → 구현체. 백엔드 교체 시 구현체만 변경.
- **모바일 우선**: Tailwind 기본 스타일이 모바일, `sm:`/`md:`/`lg:`로 확장.

## Coding Conventions

- **Language**: TypeScript strict mode. `any` 사용 금지.
- **Components**: Server Component 기본. 클라이언트 상태가 필요할 때만 `"use client"`.
- **Naming**: 컴포넌트 PascalCase, 함수/변수 camelCase, 파일명 kebab-case (Next.js 라우트 제외).
- **Styling**: Tailwind 유틸리티 클래스 사용. 커스텀 CSS 최소화.
- **Design tokens**: 네이비(`text-navy`, `bg-navy`), 다크그레이(`text-gray-dark`), 라이트그레이(`bg-gray-light`). globals.css 참고.
- **Imports**: `@/*` alias 사용 (예: `@/lib/repositories`).
- **Data access**: 서버에서 `getServerRepositories()` 사용. 클라이언트에서 DB 직접 접근 금지.
- **Forms**: react-hook-form + zod 스키마로 유효성 검사. 스키마는 `src/lib/schemas.ts`에 정의.
- **Images**: 업로드 시 `compressImage()` 사용 (WebP 변환 + 압축). 표시 시 Next.js `<Image>` 컴포넌트 필수.

## Git Conventions

- **Branch**: `main` ← `develop` ← `feat/*`, `fix/*`, `docs/*`
- **Commit**: Conventional Commits 필수 (commitlint 적용됨). 본문은 한글 사용.
  - 타입: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`
  - 제목은 `타입: 한글 설명` 형식 (50자 이내)
  - 본문에 변경 사항 목록 기재
  - 예시:
    ```
    feat: 포트폴리오 갤러리 페이지 추가

    - 카테고리 필터 기능
    - 반응형 그리드 레이아웃
    - Repository 패턴으로 데이터 조회
    ```
- **PR**: 기능 하나 = PR 하나. 한국어 제목 가능.

## Important Notes

- 모든 서비스 무료 플랜. 외부 유료 서비스 추가 금지.
- Supabase Storage 1GB 제한 → 이미지 반드시 압축 후 업로드.
- `/admin/*` 경로는 Proxy로 인증 보호됨. 관리자 전용.
- 자세한 아키텍처는 `docs/ARCHITECTURE.md` 참고.

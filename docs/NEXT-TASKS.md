# 다음 작업 가이드

## 🟠 기능

- [ ] 로그인 callbackUrl 동적 처리 (현재 "/" 고정)

## 🟡 코드 품질

- [ ] `as never` 타입 캐스팅 제거 — Supabase CLI `gen types`로 타입 생성
- [ ] Supabase Repository error 무시 → error 발생 시 throw 또는 로깅
- [ ] `export default` → named export (header, footer, floating-cta, svg-icon, theme-toggle)
- [ ] 순수 함수 분리 + 테스트 (`_actions.ts`의 `extractStoragePath` → `_utils.ts`)
- [ ] `@supabase/ssr` 패키지 제거 (미사용)

## 🟢 개선

- [ ] `<Image>` sizes 속성 추가 (불필요하게 큰 이미지 로드 방지)
- [ ] 모바일 메뉴 포커스 트랩 + ESC 닫기
- [ ] 네비게이션 로딩 피드백 (상단 프로그레스 바)
- [ ] 테스트 추가 — Server Actions 인가, 컴포넌트 테스트

## 🔵 문서

- [ ] ARCHITECTURE.md 현행화

---

## 외부 의존 작업

### 검색 노출

- [ ] 네이버 스마트플레이스 업체 등록 (효과 가장 큼)
- [ ] 네이버 서치어드바이저 등록 + 사이트맵 제출
- [ ] Google Search Console 등록 + 사이트맵 제출
- [ ] OG `og:image` 설정

### 카카오톡 채널

- [ ] https://center-pf.kakao.com 에서 채널 개설
- [ ] 홈페이지에 카카오톡 상담 버튼 연결

### 도메인·배포

- [ ] 커스텀 도메인 연결 시 metadataBase, sitemap URL 업데이트
- [ ] Lighthouse 점수 확인 (목표: 90+)
- [ ] DB 마이그레이션 실행 (`db/migrate-created-by.sql`)

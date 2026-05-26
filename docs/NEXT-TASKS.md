# 다음 작업 가이드

## 🟠 기능

- [ ] 시공사례 상세 페이지 개별 메타데이터 (generateMetadata로 title, description 자동 생성)
- [ ] 기존 시공사례 설명 보강 (관리자 페이지에서 수정)
- [ ] OG `og:image` 설정

## 🟡 코드 품질

- [ ] `export default` → named export (header, footer, floating-cta, svg-icon, theme-toggle)
- [ ] 순수 함수 분리 + 테스트 (`_actions.ts`의 `extractStoragePath` → `_utils.ts`)

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

- [ ] 네이버 블로그 시공 후기 작성 + 사이트 링크 (백링크)
- [ ] 시공사례 꾸준히 추가 (주 1~2개)

### 카카오톡 채널

- [ ] https://center-pf.kakao.com 에서 채널 개설
- [ ] 홈페이지에 카카오톡 상담 버튼 연결

### 도메인·배포

- [ ] 커스텀 도메인 연결 시 metadataBase, sitemap URL 업데이트
- [ ] Lighthouse 점수 확인 (목표: 90+)

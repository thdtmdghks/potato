# 다음 작업 가이드

## 🟠 기능

- [ ] 파비콘 제작 및 적용 (현재 Vercel 기본 아이콘 노출)
- [ ] 홈/프로젝트 페이지 OG `og:image` 설정 (리뷰 상세는 완료)
- [ ] 모바일 메뉴 포커스 트랩 + ESC 닫기

## 🟡 코드 품질

- [ ] 에러 핸들링 고도화 — Repository 에러 전파 + instrumentation.ts 글로벌 훅 (`docs/error_handling_improvement_plan.md` 1~3단계)
- [ ] E2E 관리자 페이지 테스트 (카카오 storageState 설정)

## 🟢 개선

- [ ] ARCHITECTURE.md 현행화 (현재 구조와 맞지 않는 부분 수정)

---

## 외부 의존 작업

### 컨텐츠

- [ ] 기존 시공사례 설명 보강 (관리자 페이지에서 수정)
- [ ] 시공사례 꾸준히 추가 (주 1~2개)
- [ ] 네이버 블로그 시공 후기 작성 + 사이트 링크 (백링크)

### 카카오톡 채널

- [ ] https://center-pf.kakao.com 에서 채널 개설
- [ ] 홈페이지에 카카오톡 상담 버튼 연결 (`constants.ts` TODO)

### 도메인·배포

- [ ] 커스텀 도메인 연결 시 metadataBase, sitemap URL 업데이트
- [ ] Lighthouse 점수 확인 (목표: 90+)

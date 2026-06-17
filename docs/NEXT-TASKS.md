# 다음 작업 가이드

## 🟠 기능

- [ ] 홈/프로젝트 페이지 OG `og:image` 설정 (리뷰 상세는 완료)
- [ ] 모바일 메뉴 포커스 트랩 + ESC 닫기

## 🟡 코드 품질

- [ ] instrumentation.ts 글로벌 에러 훅 (프레임워크 레벨 미처리 예외 수집)
- [ ] E2E 관리자 페이지 테스트 (카카오 storageState 설정)

## 🟢 개선

- [x] ARCHITECTURE.md 현행화
- [x] 파비콘 적용 (icon.png)
- [x] Repository 에러 전파 (throw 방식 전환)
- [x] FloatingCta 제거
- [x] React.cache로 상세 페이지 중복 DB 호출 제거

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

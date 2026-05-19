# 다음 작업 가이드

## 🔴 보안 (최우선)

- [ ] proxy.ts 인증 활성화 — 현재 `/admin/*` 누구나 접근 가능
- [ ] Server Action 인가 체크 — 각 action 시작부에 `auth()` + admin 확인
- [ ] RLS 정책 강화 — 관리자만 쓰기 가능하도록 변경 (현재 인증 사용자 전체 허용)

## 🟠 기능 완성

- [ ] 견적문의 저장 Server Action (`inquiry/_actions.ts`)
- [ ] 제품 CRUD Server Action (`products/_actions.ts`)
- [ ] 문의 상태변경 Server Action
- [ ] 로그인 callbackUrl 동적 처리 (현재 "/" 고정)
- [ ] status 값 통일 — DB `'신규'` / Mock `"pending"` / UI `pending/confirmed/completed` 불일치

## 🟡 코드 품질

- [ ] `as never` 타입 캐스팅 제거 — Supabase CLI `gen types`로 타입 생성
- [ ] `as unknown as` 이중 캐스팅 — `next-auth.d.ts` 타입 확장 파일 생성
- [ ] Supabase Repository error 무시 → error 발생 시 throw 또는 로깅
- [ ] `export default` → named export (header, footer, floating-cta, svg-icon, theme-toggle)
- [ ] Mock Repository 싱글톤 처리 (현재 매 호출 새 인스턴스 → 데이터 리셋)
- [ ] 순수 함수 분리 + 테스트 (`_actions.ts`의 `extractStoragePath` → `_utils.ts`)

## 🔵 문서

- [ ] ARCHITECTURE.md 현행화 — "Google OAuth" → 카카오, 페이지 목록 업데이트

## 🟢 개선

- [ ] `<Image>` sizes 속성 추가 (불필요하게 큰 이미지 로드 방지)
- [ ] 모바일 메뉴 포커스 트랩 + ESC 닫기
- [ ] Google Maps iframe 접근성 ("지도 건너뛰기" 링크)
- [ ] 테스트 추가 — Server Actions 인가, 컴포넌트 테스트
- [ ] 더미 콘텐츠 제거 (IT 회사 연혁, 서울 강남구 주소 등)
- [ ] 카카오톡 채널 링크 "#" → 실제 URL
- [ ] 서비스 아이콘 교체 (Recraft AI)

---

## 외부 의존 작업

### 카카오 개발자 앱 설정

1. https://developers.kakao.com/console/app 에서 앱 생성
2. 카카오 로그인 활성화 → Redirect URI: `https://도메인/api/auth/callback/kakao`
3. REST API 키 → `AUTH_KAKAO_ID`, Client Secret → `AUTH_KAKAO_SECRET`
4. 사장님 카카오 ID 확인 → `ADMIN_KAKAO_IDS`에 등록
5. proxy.ts 주석 해제하여 인증 활성화

### 검색 노출

- [ ] OG `og:image` 설정
- [ ] 네이버 서치어드바이저 등록 + 사이트맵 제출
- [ ] Google Search Console 등록 + 사이트맵 제출
- [ ] 네이버 스마트플레이스 업체 등록 (지도 검색 — 효과 가장 큼)

### 도메인·배포

- [ ] 커스텀 도메인 연결 시 metadataBase, sitemap URL 업데이트
- [ ] Vercel 환경변수 설정
- [ ] Lighthouse 점수 확인 (목표: 90+)

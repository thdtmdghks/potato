# 다음 작업 가이드

## 현재 상태

경산창호 전환 작업 완료. develop 브랜치 `31498f7`.

### 완료된 작업

1. ✅ 문서 업데이트 (AGENTS.md, README.md, NEXT-TASKS.md, .env.local.example)
2. ✅ 포인트 컬러 추가 (accent: #e67e22 주황 계열)
3. ✅ 네비게이션/레이아웃 원페이지 앵커 구조 + 컴포넌트 분리 (\_components/)
4. ✅ 홈 페이지 원페이지 랜딩 (히어로→서비스→시공사례→강점→연락처)
5. ✅ 서비스 SVG 아이콘 (임시 인라인 SVG, 추후 Recraft AI로 교체)
6. ✅ 시공사례 갤러리 페이지 (/projects)
7. ✅ 플로팅 CTA 전화 버튼
8. ✅ 카카오 로그인 + 화이트리스트 기반 관리자 인증 (ADMIN_KAKAO_IDS)
9. ✅ 관리자 접근 제어 (proxy.ts, 현재 임시 비활성화)
10. ✅ Mock 데이터 경산창호 콘텐츠로 교체
11. ✅ SEO (title/description 통일, OG 태그, JSON-LD LocalBusiness, robots.txt)

### 설계 결정사항

- users 테이블 제거 → 환경변수 `ADMIN_KAKAO_IDS` 화이트리스트로 관리자 판단
- 로그인 버튼 네비게이션 미노출 → `/admin` 직접 접근 시 카카오 로그인 유도
- proxy.ts 인증 체크 임시 비활성화 (카카오 앱 미설정 상태)
- SessionProvider는 root layout에 유지 (헤더에서 관리자 버튼 조건부 노출용)

---

## 다음 작업 (코드 작업 가능)

### 1. admin noindex 메타 태그

- `src/app/admin/layout.tsx`에 `<meta name="robots" content="noindex">` 추가
- robots.txt의 disallow는 크롤링 차단이지 인덱싱 차단이 아님 → 둘 다 필요

### 2. 서비스 아이콘 교체

- Recraft AI (https://www.recraft.ai) Icon 모드에서 생성
- 프롬프트: "Simple line icon of [대상], minimal style, single color, 64x64"
  - PVC 샷시: double-pane window with frame
  - 알루미늄 샷시: sliding window with aluminum frame
  - 방충망: window screen mesh with frame
  - 유리교체: glass panel with replacement arrow
  - ABS 도어: bathroom door
  - 방범창: window with security bars
- 생성된 SVG를 `_components/svg-icon.tsx`의 path 데이터로 교체

### 3. NEXT-TASKS.md 완료 항목 체크 업데이트

- Task 1~11 체크 표시 반영 (현재 문서와 실제 상태 동기화)

---

## 외부 의존 작업 (업체/서비스 설정 필요)

### 카카오 개발자 앱 설정

1. https://developers.kakao.com/console/app 에서 앱 생성
2. 카카오 로그인 활성화 → Redirect URI: `https://도메인/api/auth/callback/kakao`
3. REST API 키 → `.env.local`의 `AUTH_KAKAO_ID`
4. Client Secret → `.env.local`의 `AUTH_KAKAO_SECRET`
5. 사장님 카카오 ID 확인 → `ADMIN_KAKAO_IDS`에 등록
6. `src/proxy.ts` 주석 해제하여 인증 활성화

### 카카오톡 채널

1. https://center-pf.kakao.com 에서 채널 개설 (무료)
2. 채널 URL 확인
3. `src/app/(public)/page.tsx` 연락처 섹션의 카카오톡 버튼 `href="#"` → 채널 URL로 교체

### 업체 확인 사항

- [ ] 무료 방문 견적 가능 여부 → 연락처 섹션 문구 수정
- [ ] 시공 사례 사진 제공 → 관리자 페이지에서 등록

---

## 검색 노출 작업 (배포 완료: potato-swart.vercel.app)

### 코드 작업

- [ ] `src/app/sitemap.ts` 생성 (정적: /, /projects / 동적: /projects/[id])
- [ ] `src/app/layout.tsx`에 `metadataBase: new URL('https://potato-swart.vercel.app')` 추가
- [ ] OG `og:image` 설정 (대표 시공 사진 또는 로고 이미지 URL)
- [ ] 네이버 서치어드바이저 소유 확인 메타태그 추가
- [ ] Google Search Console 소유 확인 메타태그 추가

### 네이버 검색 등록

- [ ] 네이버 서치어드바이저 (https://searchadvisor.naver.com) 사이트 등록
- [ ] 소유 확인 (HTML 메타태그 방식)
- [ ] 사이트맵 제출 (`https://potato-swart.vercel.app/sitemap.xml`)
- [ ] 연관채널 설정 (전화번호, 주소)

### 구글 검색 등록

- [ ] Google Search Console (https://search.google.com/search-console) 등록
- [ ] URL 접두어 방식으로 소유 확인
- [ ] 사이트맵 제출

### 네이버 스마트플레이스 (지도 검색 — 효과 가장 큼)

- [ ] https://new.smartplace.naver.com 에서 업체 등록
- [ ] 사업자등록증 준비 필요
- [ ] 업종: 창호/샷시 시공
- [ ] 주소, 전화번호, 영업시간 입력
- [ ] 등록 후 "경산 샷시", "경산 창호" 검색 시 지도에 노출

### 추가 노출 채널 (선택)

- [ ] 카카오맵 업체 등록 (https://business.kakao.com)
- [ ] 네이버 블로그 개설 → 시공사례 포스팅 (SEO 백링크 효과)

---

## 도메인·배포 추가 작업

- [ ] 커스텀 도메인 연결 (선택, 현재 potato-swart.vercel.app 사용 중)
- [ ] 커스텀 도메인 연결 시 metadataBase, sitemap URL 업데이트
- [ ] 환경변수 설정 (AUTH*SECRET, AUTH_KAKAO*_, ADMIN*KAKAO_IDS, SUPABASE*_)
- [ ] Lighthouse 점수 확인 (SEO/성능/접근성 목표: 90+)
- [ ] 카카오톡/슬랙 공유 미리보기 테스트

---

## 기술 참고

### 환경변수 (.env.local)

```
AUTH_SECRET=                   # npx auth secret 으로 생성
AUTH_KAKAO_ID=                 # 카카오 REST API 키
AUTH_KAKAO_SECRET=             # 카카오 Client Secret
ADMIN_KAKAO_IDS=               # 관리자 카카오 ID (콤마 구분)
NEXT_PUBLIC_SUPABASE_URL=      # Supabase 미설정 시 Mock 자동 전환
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 파일 구조 (변경된 부분)

```
src/app/(public)/
├── _components/
│   ├── header.tsx        # 헤더 + 관리자 버튼 (useSession)
│   ├── footer.tsx        # 푸터
│   ├── floating-cta.tsx  # 플로팅 전화 버튼
│   ├── theme-toggle.tsx  # 다크모드 토글
│   └── svg-icon.tsx      # 서비스 아이콘
├── layout.tsx            # import + 조합만 (14줄)
├── page.tsx              # 원페이지 랜딩 + JSON-LD
└── projects/page.tsx     # 시공사례 갤러리
```

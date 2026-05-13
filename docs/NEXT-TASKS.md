# 다음 작업 가이드

## 현재 상태

와이어프레임 프로토타입 완료 → 경산창호 전환 작업 진행 중.

### 완료된 작업 (이전 단계)

1. ✅ Mock 데이터 보강
2. ✅ 홈 페이지 (범용 템플릿)
3. ✅ 포트폴리오 목록/상세
4. ✅ 제품 안내
5. ✅ 견적문의 폼
6. ✅ 회사소개/연락처
7. ✅ 관리자 대시보드
8. ✅ 다크모드 토글
9. ✅ 빌드/테스트 확인

## 경산창호 전환 작업

### 업체 정보

- 업체명: 경산창호 / 대표: 송정관
- 주소: 경산시 원효로40길 64-8
- 연락처: 010-3812-9922
- 휴무: 매주 일요일
- 서비스: PVC 샷시, 알루미늄 샷시, 방충망, 유리교체, ABS도어, 방범창
- 경산·대구 당일 시공 가능, 2014년부터 운영, 40년 경력

### Task 1: 프로젝트 문서 업데이트

- [x] AGENTS.md — 경산창호 전용으로 변경
- [x] README.md — 프로젝트 소개 변경
- [x] NEXT-TASKS.md — 작업 가이드 재작성
- [x] .env.local.example — Google → 카카오

### Task 2: 포인트 컬러 추가

- [ ] `globals.css`에 `--color-accent` (amber/orange 계열) 추가
- [ ] `bg-accent`, `text-accent` 등 Tailwind 토큰 사용 가능하도록

### Task 3: 네비게이션/레이아웃 원페이지 앵커 구조

- [ ] 로고: "경산창호"
- [ ] navItems: #services, #gallery, #about, #contact + /projects
- [ ] 헤더에 전화번호 표시
- [ ] Footer: 경산창호 정보
- [ ] smooth scroll

### Task 4: 홈 페이지 원페이지 랜딩 재구성

- [ ] 히어로: 슬로건 + 배지 + CTA
- [ ] 서비스 (id="services"): 6종 아이콘 그리드
- [ ] 시공사례 (id="gallery"): 이미지 하이라이트 + 더보기 링크
- [ ] 강점 (id="about"): 숫자 강조 4칸
- [ ] 연락처 (id="contact"): 정보 + 버튼 + 지도

### Task 5: 서비스 SVG 아이콘

- [ ] 6종 SVG 아이콘 (PVC샷시, 알루미늄샷시, 방충망, 유리교체, ABS도어, 방범창)
- [ ] 인라인 SVG 또는 public/icons/
- [ ] 임시: Lucide 아이콘 사용 가능

### Task 6: 시공사례 갤러리 페이지

- [ ] /projects 제목: "시공사례"
- [ ] 반응형 이미지 그리드
- [ ] 카테고리 필터 (창호 서비스 종류)
- [ ] 데이터 없을 때 placeholder

### Task 7: 플로팅 CTA 버튼

- [ ] position:fixed 하단 우측
- [ ] accent 컬러, tel: 링크
- [ ] 모바일: 원형, 데스크톱: 텍스트 포함

### Task 8: users 테이블 + Repository

- [ ] db/schema.sql에 users 테이블 추가 (kakao_id, role)
- [ ] shared/types.ts에 User 타입
- [ ] repositories.ts에 UserRepository 인터페이스
- [ ] Mock + Supabase 구현체

### Task 9: 카카오 로그인 연동

- [ ] auth.ts: 카카오 프로바이더
- [ ] 콜백: signIn(자동등록), jwt(role), session(role 노출)
- [ ] login/page.tsx: 카카오 버튼

### Task 10: 관리자 접근 제어

- [ ] proxy.ts: role='admin' 체크
- [ ] 헤더: 관리자 버튼 조건부 노출
- [ ] admin/layout.tsx: 사이드바 라벨 변경

### Task 11: Mock 데이터 교체 + 최종 점검

- [ ] mock-repositories.ts: 경산창호 콘텐츠
- [ ] 테스트 수정
- [ ] pnpm build + pnpm test 통과

---

## 배포 전 체크리스트 (전환 완료 후)

- [ ] 카카오 개발자 앱 생성 및 키 설정
- [ ] 카카오톡 채널 개설 및 URL 연결
- [ ] 실제 시공 사례 사진 등록
- [ ] SEO 메타데이터 설정
- [ ] 도메인 연결 + Vercel 배포
- [ ] Google Search Console 등록

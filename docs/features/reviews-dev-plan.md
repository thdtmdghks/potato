# 후기(리뷰) 시스템 개발 계획 및 가이드 (Step-by-Step)

카카오 로그인 연동 후기 시스템 구축을 위한 단계별 개발 계획 및 카카오 설정 가이드입니다.
본 가이드는 코드 리뷰와 테스트가 쉽도록 최소 단위의 커밋 단위로 나누어 설계되었습니다.

---

## 📊 진행 상황 판 (Progress Tracker)

- [x] **Phase 1**: DB 스키마 생성 및 마이그레이션 (Commit 1)
- [ ] **Phase 2**: Auth.js 세션 정보에 카카오 프로필 매핑 (Commit 2)
- [ ] **Phase 3**: 개인정보 처리방침 페이지 및 푸터 연동 (Commit 3)
- [ ] **Phase 4**: 관리자 페이지: 리뷰 초대 링크 생성 및 카톡 공유 (Commit 4)
- [ ] **Phase 5**: 후기 작성/수정 UI 및 비즈니스 로직 (Commit 5)
- [ ] **Phase 6**: 마이페이지: 내가 쓴 후기 확인 (Commit 6)
- [ ] **Phase 7**: 관리자 페이지: 후기 승인 및 수정 요청 승인 제어 (Commit 7)
- [ ] **Phase 8**: 메인 랜딩 페이지 연동 및 검증 (Commit 8)
- [ ] **Phase 9**: 아키텍처 문서 현행화 (Commit 9)

---

## 🛠️ [사전 준비] 카카오 개발자 센터 설정 가이드 (대표님 직접 수행)

웹사이트가 카카오 로그인 시 사용자의 닉네임과 프로필 사진을 가져올 수 있도록 카카오 개발자 센터 콘솔에서 권한을 켜주어야 합니다.

1. **[카카오 디벨로퍼스](https://developers.kakao.com/)** 로그인 후 **[내 애플리케이션]** 선택
2. 진행 중인 경산창호 애플리케이션 선택
3. 좌측 메뉴 **[카카오 로그인]** -> **[동의 항목]** 메뉴로 이동
4. **[프로필 정보(닉네임/프로필 사진)]** 항목 우측의 **[설정]** 버튼 클릭
5. 동의 목적에 `후기(리뷰) 작성 시 작성자 프로필 노출` 입력 후 **[필수 동의]** 혹은 **[선택 동의]**로 설정하여 저장
   - (가능하면 사용자가 로그인하자마자 바로 노출할 수 있도록 **[필수 동의]**를 권장합니다.)

---

## 📋 단계별 개발 태스크 (코드 리뷰 및 테스트 단위)

### [Phase 1] DB 스키마 생성 및 마이그레이션 (Commit 1)

- **목표**: 리뷰 및 수정 대기 테이블을 Supabase DB에 물리적으로 생성.
- **작업**:
  - [NEW] `supabase/migrations/20260527000001_reviews_schema.sql` 생성
    - `reviews` 테이블 (id, kakao_id, author_name, author_avatar, rating, content, images, status, created_at)
    - `review_edits` 테이블 (review_id, rating, content, images, created_at)

### [Phase 2] Auth.js 세션 정보에 카카오 프로필 매핑 (Commit 2)

- **목표**: 카카오 로그인 완료 시 닉네임과 프로필 사진 주소를 NextAuth 세션 정보에서 읽을 수 있도록 동기화.
- **작업**:
  - [MODIFY] `src/auth.ts` 수정
    - 카카오 로그인 성공 시 반환되는 프로필 객체에서 `name`(닉네임)과 `image`(프로필 사진 URL)를 세션 데이터(`session.user`)에 안정적으로 담아 내보내도록 callback 수정.

### [Phase 3] 개인정보 처리방침 페이지 및 푸터 연동 (Commit 3)

- **목표**: 개인정보보호법 준수 및 네이버 SEO 가산점을 위한 방침 문서 생성.
- **작업**:
  - [NEW] `src/app/(public)/privacy/page.tsx` 생성 (표준 템플릿 기반의 심플한 개인정보 처리방침 페이지)
  - [MODIFY] `src/app/(public)/_components/footer.tsx` 수정 (하단 영역에 "개인정보 처리방침" 링크 삽입)

### [Phase 4] 관리자 페이지: 리뷰 초대 링크 생성 및 카톡 공유 (Commit 4)

- **목표**: 대표님이 터치 한 번으로 리뷰 요청 링크를 생성하고, 카카오톡 또는 OS 기본 공유창을 통해 고객에게 즉시 전송할 수 있게 구현.
- **작업**:
  - [NEW] `src/app/admin/reviews/page.tsx` (초대장 생성 및 공유 UI)
    - 고객 이름을 따로 입력할 필요 없이 **[리뷰 요청 링크 생성]** 버튼만 누르면 즉시 고유 UUID가 발급됨.
    - 모바일 환경을 배려해 브라우저의 **네이티브 공유 기능(Web Share API: `navigator.share`)**을 탑재하여 클릭 시 바로 카카오톡이나 문자 메시지로 고객을 선택해 전송할 수 있게 함.
    - 공유 기능이 지원되지 않는 데스크톱 환경에서는 링크 복사(클립보드) 후 토스트 알림을 띄우는 Fallback 처리 구현.

### [Phase 5] 후기 작성/수정 UI 및 비즈니스 로직 (Commit 5)

- **목표**: 고객이 링크를 타고 들어와 카카오 로그인 후 후기를 등록하거나 수정 요청을 보내는 화면 구현.
- **작업**:
  - [NEW] `src/app/(public)/reviews/write/page.tsx` 생성
    - `id` 파라미터가 유효한지 검증.
    - 카카오 로그인 여부 체크 및 로그인 유도.
    - **신규 작성**: DB에 해당 `id` 데이터가 없으면 새 후기 등록 (`reviews` 테이블에 `INSERT`, status='pending')
    - **수정 작성**: DB에 이미 `approved` 상태의 후기가 있으면 수정 요청 처리 (`review_edits` 테이블에 `UPSERT`)
    - **이미지 깨짐 방지**: 프로필 사진 로드 실패 시 디폴트 회색 아바타 실루엣 노출 예외 처리.

### [Phase 6] 마이페이지: 내가 쓴 후기 확인 (Commit 6)

- **목표**: 고객이 자신이 쓴 후기 목록과 현재 승인 상태를 확인하고, 수정 링크로 다시 들어갈 수 있게 구현.
- **작업**:
  - [NEW] `src/app/(public)/reviews/my/page.tsx` 생성
    - 로그인한 카카오 ID로 작성된 리뷰 목록 렌더링.
    - 각 리뷰 옆에 [수정하기] 버튼 배치 (수정 버튼 클릭 시 `/reviews/write?id=UUID`로 이동).

### [Phase 7] 관리자 페이지: 후기 승인 및 수정 요청 승인 제어 (Commit 7)

- **목표**: 대표님이 신규 리뷰와 수정 요청 건을 최종 검토하고 승인하는 대시보드 구현.
- **작업**:
  - [MODIFY] `src/app/admin/reviews/page.tsx` 보강
    - **신규 승인 목록**: `status = 'pending'` 인 리뷰 목록 렌더링 -> [승인] 누르면 `'approved'`로 업데이트.
    - **수정 요청 목록**: `reviews`와 `review_edits` 조인 목록 렌더링 -> **원본 내용 vs 수정본 내용** 대비표 제공.
      - [수정 승인]: `review_edits` 내용을 원본 `reviews` 행에 업데이트하고 `review_edits` 행 삭제.
      - [수정 반려]: 원본은 둔 채 `review_edits` 행 삭제.

### [Phase 8] 메인 랜딩 페이지 연동 및 검증 (Commit 8)

- **목표**: 승인된 리뷰들을 메인 화면에 고급스러운 UI 슬라이더로 노출하고 전체 빌드 확인.
- **작업**:
  - [MODIFY] `src/app/(public)/page.tsx` 수정 (하단에 시공 후기 캐러셀 섹션 추가, `status = 'approved'` 데이터만 로드)
  - 빌드 및 린트 최종 검증 (`pnpm run build` && `pnpm run lint`)

### [Phase 9] 아키텍처 문서 현행화 (Commit 9)

- **목표**: 새롭게 도입된 리뷰 시스템 설계와 DB 테이블 구조를 프로젝트 전체 아키텍처 문서에 최신화하여 일관성 유지.
- **작업**:
  - [MODIFY] `docs/ARCHITECTURE.md` 수정 (DB 스키마 설명에 `reviews` 및 `review_edits` 추가, 카카오 로그인 기반 리뷰 인증 흐름도 및 RLS 차단 정책 최신화)

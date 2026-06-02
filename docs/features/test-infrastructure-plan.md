# 테스트 인프라 구축 계획

## 설계 원칙

- 프로덕션 코드 변경 없음 — 테스트를 위한 분기/우회 코드 금지
- 테스트 파일은 소스 옆 colocation
- 모든 분기(if/else, try/catch, early return) 커버
- 외부 의존성 없는 실행 — DB/네트워크 없이 Mock 기반

## 인증 전략

| 환경                           | 방식                               | 프로덕션 코드 변경 |
| ------------------------------ | ---------------------------------- | :----------------: |
| dev                            | 카카오 로그인 1회 (세션 쿠키 유지) |        없음        |
| 서버 액션 통합 테스트 (Vitest) | `vi.mock("@/auth")`                |        없음        |
| E2E (Playwright)               | `storageState`로 세션 쿠키 재사용  |        없음        |
| 프로덕션                       | 카카오 로그인                      |        없음        |

---

## Phase 1: 서버 액션 통합 테스트 ✅

### 목표

Server Action의 모든 분기를 Mock Repository 기반으로 검증. next/cache, auth 등 서버 모듈은 전역 mock.

### 인프라 세팅

- [NEW] `src/test-helpers/action-mocks.ts`
  - `mockAdminSession()` — `auth()`가 관리자 세션 반환
  - `mockUserSession(kakaoId)` — `auth()`가 일반 사용자 세션 반환
  - `mockNoSession()` — `auth()`가 null 반환
  - `revalidatePath` no-op mock
  - `getServerRepositories()` → 새 Mock Repository 인스턴스 반환

### 테스트 파일

- [NEW] `src/app/(public)/reviews/write/_actions.test.ts`
  - `submitReview` 모든 분기:
    1. 비로그인 → 에러
    2. 만료된 UUID + 기존 리뷰 없음 → 에러
    3. Zod 검증 실패 (content 부족) → 에러
    4. Zod 검증 실패 (rating 범위 초과) → 에러
    5. 이미지 0장 → 에러
    6. 신규 등록 성공 → Mock에 pending 상태로 적재
    7. 신규 등록 실패 (create null) → 에러 + 이미지 롤백
    8. 타인 리뷰 수정 시도 → 권한 에러
    9. REJECTED/DELETED 상태 수정 시도 → 에러
    10. pending 상태 직접 수정 성공
    11. pending 상태 수정 실패 → 에러 + 이미지 롤백
    12. approved 상태 수정 요청 (upsert) 성공
    13. approved 상태 수정 요청 실패 → 에러 + 이미지 롤백

- [NEW] `src/app/admin/reviews/_actions.test.ts`
  - `approveReview`: 성공 / update 실패 / 비관리자 시도
  - `deleteReview`: 성공 / update 실패
  - `approveReviewEdit`: 성공 (원본 덮어쓰기 + edit 삭제) / edit 미존재 / update 실패
  - `rejectReviewEdit`: 성공 (edit 삭제) / delete 실패

- [NEW] `src/app/admin/projects/_actions.test.ts`
  - `createProject`: 성공 / 비인증 / Zod 검증 실패 / create 실패
  - `updateProject`: 성공 / 비인증 / 프로젝트 미존재 / update 실패
  - `deleteProject`: 성공 / 비인증 / delete 실패

### Mock 데이터 초기화

- 각 테스트의 `beforeEach`에서 Mock Repository 새 인스턴스 생성
- `globalThis` 싱글톤 우회하여 테스트 간 오염 방지

---

## Phase 2: 컴포넌트 테스트 ✅

### 목표

사용자 인터랙션이 있는 클라이언트 컴포넌트의 UI 동작 검증.

### 테스트 파일

- [NEW] `src/app/(public)/reviews/write/_components/review-form.test.tsx`
  1. content 5자 미만 제출 → 에러 메시지 노출
  2. 이미지 0장 + 제출 → "최소 1장" 에러
  3. compressing 중 → 제출 버튼 disabled
  4. 별점 클릭 → rating 값 반영

- [NEW] `src/app/_components/image-upload.test.tsx`
  1. maxCount 도달 시 파일 선택 영역 숨김
  2. 삭제 버튼 클릭 → onRemove 콜백 호출

---

## Phase 3: E2E 테스트 (Playwright)

### 인프라 세팅

- [ADD] `devDependencies`: `@playwright/test`
- [ADD] `scripts`: `test:e2e`, `test:e2e:ui`
- [NEW] `playwright.config.ts`
  - `webServer`: `pnpm build && pnpm start`
  - `fullyParallel: true`, trace on failure

- [NEW] `e2e/auth.setup.ts`
  - 최초 1회 카카오 로그인 수행 (수동 또는 환경변수 기반)
  - 세션 쿠키를 `e2e/.auth/session.json`에 저장
  - 이후 모든 테스트에서 `storageState`로 재사용
  - 관리자/일반 사용자별 별도 state 파일 생성

### 테스트 파일

- [NEW] `e2e/projects.spec.ts`
  1. 메인 → 시공사례 캐러셀 로딩
  2. `/projects` → 카테고리 필터 동작
  3. 상세 페이지 → 제목/사진 로딩

- [NEW] `e2e/reviews.spec.ts`
  1. (관리자) `/admin/reviews` → 초대 링크 생성
  2. (고객) `/reviews/write?id=UUID` → 후기 작성 → 제출
  3. (고객) `/reviews/my` → "검토 대기 중" 확인
  4. (관리자) `/admin/reviews` → 승인
  5. 메인 `/` → 캐러셀에 후기 노출

---

## Phase 4: 테스트 규칙 문서화

### AGENTS.md Conventions에 추가

```
- 순수 함수 (_utils.ts): 모든 분기 단위 테스트 작성.
- Server Action (_actions.ts): 모든 분기 통합 테스트 작성.
- Zod 스키마 추가/수정 시: schemas.test.ts에 유효/무효 케이스 추가.
- 테스트 파일 위치: 소스 옆 colocation.
- 공용 mock 헬퍼: src/test-helpers/ 사용.
```

---

## 실행 명령어

```bash
pnpm test              # Vitest (단위 + 통합 + 컴포넌트)
pnpm test:e2e          # Playwright E2E
pnpm test:e2e:ui       # Playwright UI 모드
```

---

## 우선순위

| Phase | 예상 시간 | 가치                          |
| :---: | :-------: | ----------------------------- |
|   1   |   2시간   | 비즈니스 로직 방어 (ROI 최고) |
|   2   |   1시간   | UI 회귀 방지                  |
|   3   |  2~3시간  | 전체 플로우 보장              |
|   4   |    5분    | 지속적 품질 유지 규칙         |

---

## 커버 안 되는 것 (인지)

- Supabase RLS 정책 (service_role 사용으로 현재 무관)
- 카카오 OAuth 실제 흐름 (수동 확인 필수)
- Discord 웹훅 실제 전송 (mock으로 호출 여부만 확인)
- 이미지 압축 실제 동작 (E2E에서만 가능)

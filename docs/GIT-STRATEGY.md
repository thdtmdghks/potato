# Git 브랜치 전략 및 커밋 규칙

## 브랜치 구조

```
main (운영 배포) ← develop에서 --no-ff 머지
  ↑
develop (개발/통합) ← feature에서 --no-ff 머지
  ↑
feature/{작업명} (작업 브랜치)
```

## 규칙

1. **main, develop에 직접 커밋 금지**
2. 모든 feature 브랜치는 develop에서 분기
3. feature → develop 머지: `git merge --no-ff feature/{name}`
4. develop → main 머지: `git merge --no-ff develop`
5. 긴급 수정: `hotfix/*` → develop, main 각각 머지

## 커밋 메시지 (Conventional Commits)

commitlint로 자동 검증됨 (husky commit-msg 훅).

```
{type}: {설명}
```

### 허용 type

| type       | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 새 기능                  |
| `fix`      | 버그 수정                |
| `refactor` | 기능 변경 없는 코드 개선 |
| `style`    | UI/디자인 변경           |
| `docs`     | 문서                     |
| `test`     | 테스트                   |
| `chore`    | 빌드, 설정, 의존성       |
| `perf`     | 성능 개선                |
| `ci`       | CI/CD                    |
| `build`    | 빌드 시스템              |
| `revert`   | 되돌리기                 |
| `merge`    | 머지 커밋                |

### 예시

```
feat: 시공사례 CRUD Server Action 구현
fix: 카카오 로그인 callbackUrl 미전달 수정
refactor: Mock Repository 싱글톤 패턴 적용
style: 캐러셀 속도 증가, 상세 페이지 UI 개선
docs: ADR-015 디스코드 모니터링 추가
chore: setup Supabase CLI migration
```

## 배포 흐름

```
feature/* → develop (개발 확인) → main (Vercel 자동 배포)
```

Vercel은 main 브랜치 push 시 자동 프로덕션 배포, develop push 시 프리뷰 배포.

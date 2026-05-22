# 경산창호 데이터베이스 개발 가이드 (Supabase CLI)

이 프로젝트는 Docker 기반의 로컬 DB를 띄우지 않고, 원격 Supabase DB를 직접 대상으로 **Supabase CLI**를 사용하여 스키마 마이그레이션을 버전 관리합니다.

새로운 개발 환경이나 다른 컴퓨터에서 이어서 작업할 때, 아래 단계에 따라 1분 만에 환경을 구성할 수 있습니다.

---

## 🚀 최초 환경 셋업 (Git Clone 직후)

### 1단계: Supabase CLI 최초 로그인

로컬 컴퓨터에서 Supabase 클라우드 계정에 인증하기 위해 다음 명령을 실행합니다.

```bash
npx supabase login
```

1. 명령어를 실행하면 브라우저가 열리며 Supabase 권한 요청 페이지가 나타납니다.
2. 로그인을 완료하고 화면에 뜨는 **Access Token(토큰값)**을 복사합니다.
3. 터미널 프롬프트에 토큰값을 붙여넣고 엔터를 치면 인증이 완료됩니다.

### 2단계: 프로젝트 연결 (Link)

로컬 설정을 원격 Supabase 프로젝트와 연결합니다.

```bash
pnpm db:link
```

- **Project Reference ID**와 **Database Password** 입력이 필요합니다.
- _Project ID는 Supabase 대시보드 URL의 `https://supabase.com/dashboard/project/xxxx` 부분에 위치한 문자열입니다._
- 연결이 완료되면 로컬 `.supabase/config.json`에 연동 정보가 기록됩니다.

---

## 🔄 데이터베이스 동기화 워크플로우

연결한 원격 데이터베이스의 상태(이미 테이블이 존재하는지 여부)에 따라 다음 중 하나를 선택해 동기화합니다.

### 케이스 A: 이미 운영/개발 중인 기존 DB에 처음 편입하는 경우 (Baseline 세팅)

원격 DB에 이미 `projects` 테이블 등이 존재하는 상태에서 그냥 `db push`를 실행하면 중복 에러가 납니다.
따라서, 기존 스키마와 동일한 최초 마이그레이션을 **이미 완료된 상태**로 마킹해 줍니다.

```bash
# 0001 최초 완성형 스키마 적용 마크
pnpm supabase migration repair --status applied 20260521000001
```

_(만약 원격 DB에 사용하지 않는 레거시 테이블(inquiries 등)이 남아있다면, Supabase 대시보드의 SQL Editor에서 직접 `DROP TABLE 테이블명 CASCADE;`로 정리해 줍니다.)_

### 케이스 B: 완전히 비어 있는 새 데이터베이스에 세팅할 경우

새로운 Supabase 프로젝트를 만들어 빈 DB에 전체 스키마를 한 번에 빌드할 때는 아래 명령어 한 줄만 실행하면 됩니다.

```bash
pnpm db:migrate
```

- 최초 완성형 마이그레이션 파일이 원격 DB에 즉시 반영됩니다.

---

## 💻 개발 중 사용법 (Code-First 마이그레이션 및 타입 관리)

이 프로젝트는 원격 DB로부터 타입을 역방향으로 추출하지 않고, **로컬 소스 코드의 타입을 기준(Source of Truth)**으로 삼습니다.
따라서 스키마 변경 시에는 다음과 같은 순서로 작업을 진행합니다.

### 1단계: 로컬 TypeScript 타입 수정

먼저 [src/shared/types.ts](file:///Users/a-26-001/Workspace/potato/src/shared/types.ts) 파일을 열고 필요한 테이블 스키마 및 타입을 직접 수정 또는 추가합니다.

### 2단계: 신규 마이그레이션 생성

수정한 타입을 실제 데이터베이스에 반영하기 위해 새로운 마이그레이션 파일을 생성합니다.

```bash
pnpm db:migrate:new add_column_to_projects
```

- 이 명령을 실행하면 `supabase/migrations/` 폴더 내에 타임스탬프가 접두사로 붙은 빈 SQL 파일이 생성됩니다.

### 3단계: SQL 마이그레이션 쿼리 작성

생성된 SQL 파일을 편집기에서 열고, 1단계에서 변경했던 TypeScript 타입에 맞게 SQL DDL 쿼리를 작성합니다.

예시 (컬럼 추가 시):

```sql
ALTER TABLE projects ADD COLUMN new_feature_flag boolean DEFAULT false NOT NULL;
```

### 4단계: 원격 데이터베이스에 적용

마이그레이션 작성이 완료되면 원격 DB에 push하여 반영합니다.

```bash
pnpm db:migrate
```

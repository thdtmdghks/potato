# Code Style Guide

ESLint + Prettier로 대부분 자동 적용됨. 이 문서는 자동화되지 않는 판단 기준을 기록한다.

---

## 함수

### 컴포넌트: function 선언문

```tsx
export default function ProjectsPage() {
  return <main>...</main>;
}

export function DeleteButton({ id }: { id: string }) {
  return <button>삭제</button>;
}
```

### 그 외 모두: arrow function

```ts
// 유틸리티
export const compressImage = async (file: File): Promise<File> => {
  return imageCompression(file, OPTIONS);
};

// 헬퍼
const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("ko").format(new Date(date));
};

// 콜백
items.map((item) => item.id);

// 이벤트 핸들러
const handleSubmit = async (data: ProjectFormData) => {
  // ...
};
```

---

## Naming

| 대상             | 스타일           | 예시                                       |
| ---------------- | ---------------- | ------------------------------------------ |
| 컴포넌트         | PascalCase       | `ProjectForm`, `DeleteButton`              |
| 함수, 변수       | camelCase        | `getAll`, `imageUrls`                      |
| 상수             | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `CATEGORIES`              |
| 파일/폴더        | kebab-case       | `project-form.tsx`, `mock-repositories.ts` |
| 타입, 인터페이스 | PascalCase       | `Project`, `ProjectRepository`             |

- 인터페이스에 `I` 접두사 금지 (`IProject` ❌ → `Project` ✅)
- 약어는 단어 취급 (`loadHttpUrl` ✅, `loadHTTPURL` ❌)
- Boolean 변수/props: `is`, `has`, `should` 접두사 (`isLoading`, `hasError`)

---

## Imports

```ts
// ✅ named export/import 사용
export function ProjectForm() {}
import { ProjectForm } from "./project-form";

// ✅ 타입은 import type 사용
import type { Project } from "@/shared/types";

// ❌ default export 지양 (Next.js 페이지 컴포넌트 제외)
export default function Page() {} // 페이지만 허용

// ❌ namespace import 지양
import * as Utils from "./utils";
```

- Next.js 페이지/레이아웃만 `export default` 사용 (프레임워크 요구사항)
- 그 외 컴포넌트, 유틸리티, 타입은 모두 named export

> 🔧 `import type` — ESLint `@typescript-eslint/consistent-type-imports`로 강제됨

---

## 변수

```ts
// ✅ const 기본
const items = await projects.getAll();

// ✅ 재할당 필요할 때만 let
let retryCount = 0;
retryCount += 1;

// ❌ var 금지
```

> 🔧 ESLint `prefer-const`, `no-var`로 강제됨

---

## 제어문

### Early return 선호

```ts
// ✅
const getUser = async (id: string) => {
  const user = await db.find(id);
  if (!user) return null;
  if (!user.isActive) return null;
  return user;
};

// ❌ 중첩
const getUser = async (id: string) => {
  const user = await db.find(id);
  if (user) {
    if (user.isActive) {
      return user;
    }
  }
  return null;
};
```

### 엄격한 동등 비교

```ts
// ✅
if (status === "pending") {
}
if (value !== null) {
}

// ❌
if (status == "pending") {
}
```

> 🔧 ESLint `eqeqeq`로 강제됨

---

## 에러 처리

```ts
// ✅ Error 객체만 throw
throw new Error("생성에 실패했습니다.");

// ❌ 문자열 throw
throw "something went wrong";
```

---

## React/Next.js

### 컴포넌트 원칙

- 단일 책임: 하나의 컴포넌트는 하나의 역할
- 작게 유지: 200줄 넘으면 분리 검토
- Props는 interface로 정의

```tsx
// ✅
interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {}
```

### Server vs Client Component

- 기본은 Server Component (데이터 표시)
- `"use client"`는 상태/이벤트/브라우저 API 필요할 때만

### 주석

- 주석 처리된 코드 금지 (삭제하고 git에 맡기기)
- "왜"를 설명하는 주석만 남기기 ("무엇"은 코드가 설명)

```ts
// ✅ 이유 설명
// Firefox에서 fieldset에 flex/grid 적용 시 레이아웃 깨짐
<div className="grid grid-cols-2">

// ❌ 코드 반복
// 프로젝트 목록을 가져온다
const items = await projects.getAll();
```

### console.log

- 프로덕션 코드에 `console.log` 금지
- 디버깅용은 `console.warn`, `console.error`만 허용

> 🔧 ESLint `no-console`으로 경고됨 (warn/error는 허용)

---

## Tailwind CSS

- 인라인 `style` 속성 금지 (반응형 불가)
- 하드코딩 색상 금지 → design token 사용 (`text-navy`, `bg-accent`)

> 🔧 클래스 순서 — `prettier-plugin-tailwindcss`로 저장 시 자동 정렬됨

---

## TypeScript

- `any` 사용 금지

> 🔧 ESLint `@typescript-eslint/no-explicit-any`로 강제됨

---

## 의존성 추가 기준

- 직접 구현 가능한 간단한 기능이면 라이브러리 추가 금지
- 활발히 유지보수되고 널리 사용되는 패키지만
- 번들 크기 영향 고려 (lodash 전체 import 금지, tree-shakeable 선호)

---

## 매직 넘버/문자열 금지

의미 있는 숫자나 문자열은 반드시 상수로 선언한다.

```ts
// ❌
if (files.length > 10) {
}
const bucket = "projects";

// ✅
const MAX_UPLOAD_COUNT = 10;
const STORAGE_BUCKET = "projects";

if (files.length > MAX_UPLOAD_COUNT) {
}
```

스코프:

- 여러 파일에서 사용 → `constants.ts` 또는 해당 모듈 상단
- 한 파일에서만 사용 → 파일 상단 `const`

---

## Dead Code 금지

- 사용처가 없는 코드(상수, 타입, 함수)를 작성하지 않는다
- 추후 사용 예정이면 사용 시점에 작성한다
- 미사용 import는 즉시 제거

---

## 미사용 변수

콜백 등에서 사용하지 않는 매개변수는 `_` prefix로 명시적 무시.

```ts
// ✅
const action = async (_prev: unknown, formData: FormData) => {};
items.map((_item, idx) => idx);

// ❌ 경고 무시
const action = async (prev: unknown, formData: FormData) => {}; // prev 미사용 경고
```

---

## non-null assertion(`!`) 금지

`!` 대신 `??` fallback 또는 타입 가드로 대체한다.

```ts
// ❌
const name = user!.name;

// ✅
const name = user?.name ?? "Unknown";

// ✅ 타입 가드
if (!user) return null;
const name = user.name; // 이 시점에서 user는 non-null
```

---

## 구현 체크리스트

코드 작성 시 아래 항목을 확인한다.

### 작성 전

- [ ] 기존 코드에 재사용 가능한 유틸/상수/타입이 있는지 확인했는가?
- [ ] 매직 넘버/문자열 없이 상수로 선언했는가?

### 작성 후

- [ ] 미사용 import/변수가 없는가?
- [ ] `any`, `!` (non-null assertion)을 사용하지 않았는가?
- [ ] 2곳 이상 중복되는 로직이 있으면 함수로 추출했는가?
- [ ] `pnpm lint` 통과하는가?

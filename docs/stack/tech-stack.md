# 기술 스택 가이드

이 문서는 프로젝트에서 사용하는 주요 프론트엔드 기술 스택과 각 도구의 책임 범위를 정리합니다.

## 확정된 기술 스택


| 영역              | 선택 도구               | 역할                                     |
| --------------- | ------------------- | -------------------------------------- |
| Framework       | Next.js App Router  | 프론트엔드 라우팅과 화면 구성                       |
| Language        | TypeScript          | 정적 타입 기반 개발                            |
| Package Manager | pnpm                | 패키지 설치와 스크립트 실행                        |
| Styling         | Tailwind CSS        | 기본 스타일링                                |
| Server State    | TanStack Query      | 서버 데이터 캐싱, 동기화, mutation, invalidation |
| Client State    | Zustand             | 서버 데이터가 아닌 클라이언트 전역 상태 관리              |
| Form            | React Hook Form     | 폼 상태와 submit 처리                        |
| Validation      | Zod                 | 입력값/스키마 검증과 타입 추론                      |
| Form Resolver   | @hookform/resolvers | React Hook Form과 Zod 연결                |
| HTTP Client     | Axios               | 외부 API 호출과 공통 HTTP client 구성           |
| Code Quality    | Biome               | lint, format, import 정리                |
| Unit/Component Test | Vitest + React Testing Library | 유틸, 훅, 컴포넌트 테스트 |
| E2E Test | Playwright | 실제 브라우저 기반 핵심 사용자 플로우 테스트 |

React Query Devtools는 사용하지 않습니다.


## 설치 패키지

프로젝트 생성과 전체 설치 순서는 [초기 세팅 가이드](../setup/initial-setup.md)를 따릅니다.

```bash
pnpm add @tanstack/react-query zustand axios react-hook-form zod @hookform/resolvers
pnpm add -D -E @biomejs/biome
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
pnpm create playwright
```

React Query Devtools를 사용하지 않으므로 `@tanstack/react-query-devtools`는 설치하지 않습니다.

Tailwind CSS는 Next.js 프로젝트 생성 시 함께 설정하는 것을 기본으로 합니다.

## 서버 상태: TanStack Query

TanStack Query는 서버에서 가져온 데이터를 관리합니다.

담당 범위:

- API 데이터 캐싱
- refetch와 동기화
- loading/error 상태 관리
- mutation 처리
- query invalidation

배치 기준:

```text
src/common/query          # 여러 페이지에서 재사용되는 query key/options/hooks
src/app/페이지명/_query     # 해당 페이지 전용 query key/options/hooks
```

규칙:

- 서버에서 가져온 데이터는 Zustand에 저장하지 않습니다.
- query key와 mutation key는 문자열 배열을 흩뿌리지 않고 `.keys.ts`의 factory 형태로 관리합니다.
- `.query.ts`는 queryOptions/useQuery/useMutation을 정의하고, key는 `.keys.ts`에서 가져옵니다.
- query/mutation 함수는 직접 HTTP 요청을 작성하지 않고 `api` 계층의 순수 요청 함수를 호출합니다.
- component 안에서 `queryKey: ['domain', id]` 같은 raw key를 직접 작성하지 않습니다.
- queryFn에서 사용하는 `id`, `filters`, `page`, `status` 같은 값은 반드시 query key에도 포함합니다.
- mutation 성공 후 refetch/invalidation이 필요하면 `.keys.ts`의 key factory를 사용합니다.

예시:

```ts
import { queryOptions } from '@tanstack/react-query';
import { getWhiteboard } from '@/common/api/whiteboard.api';

// whiteboard.keys.ts
export const whiteboardQueryKeys = {
  all: ['whiteboard'] as const,
  lists: () => [...whiteboardQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...whiteboardQueryKeys.all, 'detail', id] as const,
  create: () => [...whiteboardQueryKeys.all, 'create'] as const,
};

// whiteboard.query.ts
export function whiteboardQueryOptions(id: string) {
  return queryOptions({
    queryKey: whiteboardQueryKeys.detail(id),
    queryFn: () => getWhiteboard(id),
  });
}
```

mutation도 같은 key factory를 사용합니다.

```ts
import { useMutation } from '@tanstack/react-query';
import { createWhiteboard } from '../_api';
import { whiteboardQueryKeys } from './whiteboard.keys';

export function useCreateWhiteboardMutation() {
  return useMutation({
    mutationKey: whiteboardQueryKeys.create(),
    mutationFn: createWhiteboard,
  });
}
```

권장 파일 구조:

```text
src/app/whiteboard/_query/
├── whiteboard.keys.ts
├── whiteboard.query.ts
└── index.ts
```

TanStack Query Provider 구성은 [Provider 구성 가이드](../architecture/provider-structure.md)를 따릅니다.

```text
src/app/providers.tsx
src/common/query/query-client.ts
```

React Query Devtools는 사용하지 않습니다.

## 클라이언트 상태: Zustand

Zustand는 서버 데이터가 아닌 클라이언트 상태를 관리합니다.

담당 범위:

- 전역 모달 상태
- UI 토글 상태
- 페이지 간 공유되는 선택값
- 서버와 무관한 임시 클라이언트 상태

배치 기준:

```text
src/common/store          # 여러 페이지에서 공유되는 클라이언트 전역 상태
src/app/페이지명/_hooks     # 해당 페이지 내부에서만 쓰는 상태 로직
```

규칙:

- API 응답 데이터 캐싱은 TanStack Query가 담당합니다.
- Zustand에는 UI 상태나 클라이언트 전용 상태만 둡니다.
- 페이지 하나에서만 쓰는 상태는 전역 store로 올리지 않습니다.

예시:

```ts
import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
```

## 폼 관리: React Hook Form + Zod

폼 관리는 `react-hook-form`을 사용하고, 검증은 `zod`로 작성합니다. 두 라이브러리는 `@hookform/resolvers/zod`로 연결합니다.

```text
Form       : react-hook-form
Validation : zod
Resolver   : @hookform/resolvers/zod
```

배치 기준:

```text
src/app/페이지명/_hooks       # 페이지 전용 form hook
src/app/페이지명/_types       # 페이지 전용 form 타입
src/app/페이지명/_utils       # 페이지 전용 schema/helper, 필요 시
src/common/types            # 여러 페이지에서 공유되는 타입
```

규칙:

- 문서에서는 `react-form`이라고 쓰지 않고 `react-hook-form`으로 명시합니다.
- 폼 검증 schema는 Zod로 작성합니다.
- 폼 submit에서 API 호출이 필요하면 mutation은 `_query`, 실제 HTTP 요청은 `_api`에 둡니다.
- 여러 페이지에서 재사용되는 schema/type만 `src/common`으로 올립니다.

예시:

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const whiteboardFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
});

type WhiteboardFormValues = z.infer<typeof whiteboardFormSchema>;

export function useWhiteboardForm() {
  return useForm<WhiteboardFormValues>({
    resolver: zodResolver(whiteboardFormSchema),
    defaultValues: {
      title: '',
    },
  });
}
```

## HTTP 통신: Axios

HTTP 통신은 Axios를 사용합니다. Axios는 외부 백엔드 API 호출용 클라이언트로 사용하며, Next.js Route Handler를 사용하는 전제는 아닙니다.

API 에러 처리는 [API 에러 처리 가이드](../architecture/api-error-handling.md)를 따릅니다. Axios response interceptor를 사용해 에러를 공통 `ApiError`로 정규화합니다.

배치 기준:

```text
src/common/api/client.ts      # 공통 Axios instance
src/common/api/*.api.ts       # 여러 페이지에서 재사용되는 API 함수
src/app/페이지명/_api/*.api.ts  # 해당 페이지 전용 API 함수
```

규칙:

- Axios instance는 `src/common/api/client.ts`에서 관리합니다.
- `baseURL`은 `NEXT_PUBLIC_API_BASE_URL` 환경 변수를 사용합니다.
- response interceptor를 사용해 API 에러를 정규화합니다.
- API 함수는 순수 요청 함수로 유지합니다.
- `useQuery`, `useMutation`은 `api` 파일에 두지 않고 `query` 파일에 둡니다.

예시:

```ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
});
```

```ts
import { apiClient } from '@/common/api/client';

export async function getWhiteboard(id: string) {
  const { data } = await apiClient.get(`/whiteboards/${id}`);
  return data;
}
```

## 코드 품질: Biome

이 프로젝트는 ESLint와 Prettier를 사용하지 않고, Biome으로 lint, format, import 정리를 통합합니다.

담당 범위:

- formatting
- linting
- import organize
- CI 검사

초기화:

```bash
pnpm exec biome init
```

권장 scripts:

```json
{
  "scripts": {
    "format": "biome format --write .",
    "lint": "biome lint --write .",
    "check": "biome check --write .",
    "ci": "biome ci ."
  }
}
```

권장 설정 파일:

```text
biome.json
```

예시 설정:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

## 상태 관리 분리 기준


| 데이터 종류       | 도구                      | 예시                           |
| ------------ | ----------------------- | ---------------------------- |
| 서버에서 가져온 데이터 | TanStack Query          | 화이트보드 목록, 사용자 정보, 상세 조회      |
| 서버 데이터 변경 요청 | TanStack Query Mutation | 생성, 수정, 삭제                   |
| 클라이언트 UI 상태  | Zustand                 | 모달 열림 여부, 선택된 툴, 사이드바 상태     |
| 폼 입력 상태      | React Hook Form         | 로그인 폼, 생성 폼, 설정 폼            |
| 폼/응답 검증      | Zod                     | form schema, response schema |

## 테스트: Vitest + React Testing Library + Playwright

테스트는 [테스트 전략 가이드](./testing.md)를 따릅니다.

```text
Unit Test      : Vitest
Component Test : Vitest + React Testing Library
E2E Test       : Playwright
```

순수 함수, 유틸, schema, store action은 Vitest로 테스트합니다. React 컴포넌트와 사용자 상호작용은 React Testing Library를 함께 사용합니다. 실제 브라우저에서 사용자의 핵심 흐름을 검증하는 E2E 테스트는 Playwright로 작성합니다.


## 관련 문서

- [프로젝트 폴더 구조 가이드](../architecture/project-structure.md)
- [초기 세팅 가이드](../setup/initial-setup.md)
- [Provider 구성 가이드](../architecture/provider-structure.md)
- [API 에러 처리 가이드](../architecture/api-error-handling.md)
- [Import / Path Alias 컨벤션](../conventions/import-convention.md)
- [네이밍 컨벤션](../conventions/naming-conventions.md)
- [환경 변수 관리 가이드](../setup/environment-variables.md)
- [스타일링 가이드](./styling.md)
- [테스트 전략 가이드](./testing.md)
- [Git 컨벤션](../conventions/git-convention.md)

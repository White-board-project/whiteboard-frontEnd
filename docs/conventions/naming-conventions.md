# 네이밍 컨벤션

이 문서는 프로젝트의 폴더, 파일, 컴포넌트, 훅, 유틸, API, Query 네이밍 규칙을 정리합니다. 기본 방향은 참고한 React 구조 문서의 규칙을 Next.js App Router 구조에 맞게 적용하는 것입니다.

핵심 원칙은 다음과 같습니다.

- 컴포넌트는 `PascalCase`를 사용합니다.
- 구조와 역할을 나타내는 폴더는 `lowercase`를 사용합니다.
- 여러 단어로 된 라우트/asset 이름은 `kebab-case`를 사용합니다.
- 페이지 내부 전용 폴더는 `_` prefix를 사용합니다.
- 파일 suffix는 역할이 드러나도록 통일합니다.

## 폴더 네이밍

### 공용 폴더

`src/common` 하위의 구조 분류용 폴더는 모두 `lowercase`를 사용합니다.

```text
src/common/
├── components/
├── hooks/
├── store/
├── api/
├── query/
├── utils/
├── constants/
├── types/
└── assets/
```

### 페이지 라우트 폴더

`src/app` 하위의 라우트 폴더는 URL path가 되므로 `lowercase`를 기본으로 사용합니다. 여러 단어가 필요하면 `kebab-case`를 사용합니다.

```text
src/app/whiteboard/page.tsx
src/app/login/page.tsx
src/app/user-profile/page.tsx
```

### 페이지 내부 Private Folder

페이지 전용 구현 폴더는 `_` prefix와 `lowercase`를 사용합니다.

```text
src/app/whiteboard/
├── _components/
├── _hooks/
├── _api/
├── _query/
├── _utils/
├── _types/
└── _constants/
```

`_` prefix가 붙은 폴더는 Next.js App Router에서 라우팅 대상이 아닌 Private Folder로 취급됩니다.

## Next.js 예약 파일

Next.js App Router 예약 파일은 프레임워크 규칙을 그대로 따릅니다.

```text
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
```

이 파일들은 임의로 `PascalCase`로 바꾸지 않습니다.

## 컴포넌트 네이밍

React 컴포넌트 파일은 `PascalCase.tsx`를 사용합니다. 컴포넌트명과 파일명은 일치시키는 것을 원칙으로 합니다.

```text
Button.tsx
ToolBar.tsx
WhiteboardCanvas.tsx
ErrorFallback.tsx
```

```tsx
export function WhiteboardCanvas() {
  return null;
}
```

컴포넌트를 폴더로 분리해야 할 정도로 파일이 늘어나는 경우에도 폴더명은 `PascalCase`를 사용할 수 있습니다.

```text
WhiteboardCanvas/
├── WhiteboardCanvas.tsx
├── WhiteboardCanvas.test.tsx
└── index.ts
```

단, 단순 컴포넌트는 폴더를 만들지 않고 `ComponentName.tsx` 파일 하나로 시작합니다.

## Hook 네이밍

커스텀 훅은 `use` prefix와 `camelCase`를 사용합니다.

```text
useWhiteboard.ts
useDebounce.ts
useCanvasPosition.ts
```

```ts
export function useWhiteboard() {
  // ...
}
```

## Store 네이밍

Zustand store 파일은 도메인명 또는 역할명 뒤에 `.store.ts` suffix를 붙입니다.

```text
modal.store.ts
whiteboard-tool.store.ts
sidebar.store.ts
```

store hook 이름은 `use` prefix와 `Store` suffix를 사용합니다.

```ts
export const useModalStore = create(() => ({
  // ...
}));
```

서버에서 가져온 데이터 캐시는 store에 두지 않고 TanStack Query에서 관리합니다.

## Util 네이밍

유틸 함수 파일은 동사 또는 역할이 드러나는 `camelCase`를 사용합니다.

```text
formatDate.ts
calculateCanvasPosition.ts
mergeClassName.ts
parseErrorMessage.ts
```

파일 안의 대표 함수명도 파일명과 맞추는 것을 권장합니다.

```ts
export function calculateCanvasPosition() {
  // ...
}
```

## Constant 네이밍

상수 파일은 도메인명 또는 역할명 뒤에 `.constants.ts` suffix를 붙입니다.

```text
tool.constants.ts
routes.constants.ts
canvas.constants.ts
```

상수 값은 대문자 `SCREAMING_SNAKE_CASE`를 사용합니다.

```ts
export const DEFAULT_CANVAS_WIDTH = 1200;
export const DEFAULT_CANVAS_HEIGHT = 800;
```

객체 형태의 상수 맵은 역할이 드러나는 `camelCase` 또는 `PascalCase`를 사용할 수 있지만, 한 파일 안에서 일관되게 유지합니다.

```ts
export const routePath = {
  home: '/',
  whiteboard: '/whiteboard',
} as const;
```

## Type 네이밍

타입 파일은 도메인명 뒤에 `.type.ts` suffix를 붙입니다.

```text
whiteboard.type.ts
user.type.ts
api.type.ts
```

타입과 인터페이스 이름은 `PascalCase`를 사용합니다.

```ts
export type Whiteboard = {
  id: string;
  title: string;
};
```

여러 타입을 한 파일에 모아야 하는 경우에도 suffix는 `.type.ts`로 통일합니다.

## API 파일 네이밍

API 파일은 도메인명 뒤에 `.api.ts` suffix를 붙입니다.

```text
whiteboard.api.ts
user.api.ts
auth.api.ts
```

API 함수는 HTTP 동작이나 의도가 드러나도록 `get`, `create`, `update`, `delete`, `fetch` 같은 동사로 시작합니다.

```ts
export async function getWhiteboard(id: string) {
  // ...
}

export async function createWhiteboard() {
  // ...
}
```

`api` 파일에는 `useQuery`, `useMutation` 같은 React hook을 두지 않습니다. API 파일은 순수 요청 함수만 담당합니다.

## Index 파일 네이밍

폴더의 public export를 담당하는 파일은 `index.ts`를 사용합니다. App Router 페이지 파일은 항상 `page.tsx`이므로, `index.ts`는 라우트 엔트리가 아니라 모듈 export 엔트리입니다.

```text
src/app/whiteboard/_components/index.ts
src/app/whiteboard/_components/screen/index.ts
src/app/whiteboard/_api/index.ts
src/app/whiteboard/_query/index.ts
src/app/whiteboard/_utils/index.ts
src/app/whiteboard/_types/index.ts
src/app/whiteboard/_constants/index.ts
```

`index.ts`는 명시적 re-export를 기본으로 합니다.

```ts
export { WhiteboardCanvas } from './WhiteboardCanvas';
export { useWhiteboardQuery } from './whiteboard.query';
export type { Whiteboard } from './whiteboard.type';
```

## Query 파일 네이밍

Query key 파일은 도메인명 뒤에 `.keys.ts` suffix를 붙이고, Query options/hook 파일은 도메인명 뒤에 `.query.ts` suffix를 붙입니다.

```text
whiteboard.keys.ts
whiteboard.query.ts
user.keys.ts
user.query.ts
```

TanStack Query를 기준으로 다음 네이밍을 사용합니다.

```ts
export const whiteboardQueryKeys = {
  all: ['whiteboard'] as const,
  detail: (id: string) => [...whiteboardQueryKeys.all, id] as const,
};

export function whiteboardQueryOptions(id: string) {
  // ...
}

export function useWhiteboardQuery(id: string) {
  // ...
}
```

권장 이름은 다음과 같습니다.

| 대상 | 네이밍 |
| --- | --- |
| Query Key 파일 | `도메인.keys.ts` |
| Query Hook/Options 파일 | `도메인.query.ts` |
| Query Key Factory | `도메인QueryKeys` |
| Query Options | `도메인QueryOptions` |
| Query Hook | `use도메인Query` |
| Mutation Hook | `use동작Mutation` |

예시:

```text
whiteboardQueryKeys
whiteboardQueryOptions
useWhiteboardQuery
useCreateWhiteboardMutation
```

query key와 mutation key는 `.query.ts` 안에 문자열 배열로 직접 작성하지 않고, `.keys.ts`의 factory 함수에서 생성합니다.

## Asset 네이밍

이미지, 아이콘, 폰트 등 asset 파일은 `lowercase` 또는 `kebab-case`를 사용합니다.

```text
whiteboard-logo.svg
arrow-left.svg
empty-state.png
pretendard.woff2
```

## 테스트 파일 네이밍

테스트 파일은 대상 파일 옆에 배치하고 `.test` suffix를 사용합니다.

```text
ToolBar.tsx
ToolBar.test.tsx

useWhiteboard.ts
useWhiteboard.test.ts

calculateCanvasPosition.ts
calculateCanvasPosition.test.ts
```

테스트 파일명은 테스트 대상 파일명과 동일하게 맞추고, 확장자 앞에 `.test`를 붙입니다.

## 적용 예시

```text
src/app/whiteboard/
├── page.tsx
├── _components/
│   ├── WhiteboardCanvas.tsx
│   ├── ToolBar.tsx
│   └── ToolBar.test.tsx
├── _hooks/
│   ├── useWhiteboard.ts
│   └── useWhiteboard.test.ts
├── _api/
│   ├── whiteboard.api.ts
│   └── index.ts
├── _query/
│   ├── whiteboard.keys.ts
│   ├── whiteboard.query.ts
│   └── index.ts
├── _utils/
│   ├── calculateCanvasPosition.ts
│   ├── calculateCanvasPosition.test.ts
│   └── index.ts
├── _types/
│   ├── whiteboard.type.ts
│   └── index.ts
└── _constants/
    ├── tool.constants.ts
    └── index.ts
```

## 요약

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 구조 폴더 | `lowercase` | `components`, `hooks`, `utils` |
| 라우트 폴더 | `lowercase` 또는 `kebab-case` | `whiteboard`, `user-profile` |
| 페이지 내부 폴더 | `_` prefix + `lowercase` | `_components`, `_api`, `_query` |
| 컴포넌트 | `PascalCase.tsx` | `WhiteboardCanvas.tsx` |
| 훅 | `use` prefix + `camelCase.ts` | `useWhiteboard.ts` |
| Store | `.store.ts` | `modal.store.ts` |
| 유틸 | `camelCase.ts` | `calculateCanvasPosition.ts` |
| 상수 | `.constants.ts` | `tool.constants.ts` |
| 타입 | `.type.ts` | `whiteboard.type.ts` |
| API | `.api.ts` | `whiteboard.api.ts` |
| Query Key | `.keys.ts` | `whiteboard.keys.ts` |
| Query | `.query.ts` | `whiteboard.query.ts` |
| 폴더 export | `index.ts` | `_query/index.ts` |
| Asset | `lowercase` 또는 `kebab-case` | `whiteboard-logo.svg` |
| 테스트 | 대상 파일명 + `.test` | `ToolBar.test.tsx` |

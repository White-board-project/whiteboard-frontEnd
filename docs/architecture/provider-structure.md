# Provider 구성 가이드

이 문서는 Next.js App Router에서 사용하는 전역 Provider 구성을 정의합니다.

## 기본 결정

```text
Provider 파일 위치     : src/app/providers.tsx
QueryClient 생성 위치  : src/common/query/query-client.ts
layout.tsx 역할        : Server Component 유지, Providers로 children 감싸기
React Query Devtools   : 사용하지 않음
Zustand Provider       : 기본적으로 사용하지 않음
React Hook Form        : 전역 Provider가 아니라 각 form 단위에서 사용
Axios                  : Provider가 아니라 src/common/api/client.ts에서 instance 관리
```

## 추천 구조

```text
src/
├── app/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
│
└── common/
    ├── api/
    │   └── client.ts
    ├── query/
    │   └── query-client.ts
    └── store/
```

## `src/app/layout.tsx`

`layout.tsx`는 기본적으로 Server Component로 유지합니다. 클라이언트 Provider가 필요한 부분만 `Providers` 컴포넌트로 분리해서 감쌉니다.

```tsx
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## `src/app/providers.tsx`

`providers.tsx`는 Client Component입니다. TanStack Query의 `QueryClientProvider`를 이곳에서 설정합니다.

```tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getQueryClient } from '@/common/query/query-client';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## `src/common/query/query-client.ts`

QueryClient 생성 로직은 `src/common/query/query-client.ts`에 둡니다.

```ts
import { QueryClient, isServer } from '@tanstack/react-query';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}
```

서버에서는 요청마다 새 `QueryClient`를 만들고, 브라우저에서는 하나의 `QueryClient`를 재사용합니다. 기본 옵션은 프로젝트 진행 중 필요에 따라 조정할 수 있습니다.

## React Query Devtools

이 프로젝트에서는 **React Query Devtools를 사용하지 않습니다.**

따라서 아래 패키지는 설치하지 않습니다.

```bash
@tanstack/react-query-devtools
```

또한 `providers.tsx`에 아래 컴포넌트를 추가하지 않습니다.

```tsx
// 사용하지 않음
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// <ReactQueryDevtools />
```

Devtools 없이도 TanStack Query는 정상 동작합니다. Query 상태 확인은 필요한 경우 브라우저 네트워크 탭, 로그, 테스트, UI 상태를 통해 확인합니다.

## Zustand Provider

Zustand는 기본적으로 별도 Provider 없이 사용할 수 있습니다.

```text
src/common/store/modal.store.ts
src/common/store/whiteboard-tool.store.ts
```

전역 store 예시:

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

단, 서버 데이터 캐시는 Zustand에 두지 않습니다. 서버 상태는 TanStack Query가 담당합니다.

## React Hook Form

React Hook Form은 전역 Provider로 감싸지 않습니다. 폼이 필요한 페이지 또는 컴포넌트에서 `useForm`을 사용합니다.

```text
src/app/페이지명/_hooks/useExampleForm.ts
src/app/페이지명/_components/ExampleForm.tsx
```

폼 검증은 Zod와 `@hookform/resolvers/zod`를 사용합니다.

## Axios

Axios는 Provider가 필요하지 않습니다. 공통 Axios instance는 `src/common/api/client.ts`에 둡니다.

Axios response interceptor와 공통 API 에러 처리 기준은 [API 에러 처리 가이드](./api-error-handling.md)를 따릅니다.

```text
src/common/api/client.ts
```

```ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
});
```

## Provider에 넣지 않는 것

`providers.tsx`에는 모든 전역 로직을 넣지 않습니다. 꼭 전역 React Context가 필요한 Provider만 둡니다.

넣지 않는 것:

- Axios instance 생성
- Zustand store 생성 코드
- React Hook Form 설정
- 페이지별 상태
- 페이지별 API/query 로직
- React Query Devtools

## 요약

```text
layout.tsx
└── Providers
    └── QueryClientProvider
        └── children

사용하는 Provider       : QueryClientProvider
사용하지 않는 Provider   : React Query Devtools, Zustand Provider, Form Provider
```

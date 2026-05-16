# API 에러 처리 가이드

이 문서는 Axios interceptor와 TanStack Query를 함께 사용할 때의 API 에러 처리 기준을 정의합니다.

## 기본 흐름

```text
Axios instance
  → response interceptor에서 AxiosError/unknown을 ApiError로 정규화
  → API 함수는 data만 반환하거나 ApiError를 그대로 throw
  → TanStack Query가 error state로 수신
  → UI 컴포넌트가 isApiError로 좁혀 메시지 표시
```

## 기본 결정

```text
HTTP Client       : Axios
공통 처리 위치      : src/common/api/client.ts
공통 에러 모델      : src/common/api/error.ts
응답 유틸 위치      : src/common/api/response.ts, 필요할 때만 사용
Interceptor 사용  : 사용함
상태코드별 정책     : 아직 미정(TBD)
```

## 추천 파일 구조

```text
src/common/api/
├── client.ts       # axios instance + response interceptor
├── error.ts        # ApiError, normalizeApiError, isApiError
└── response.ts     # optional: 응답 envelope 처리 유틸

src/app/페이지명/_api/
└── example.api.ts  # 실제 API 함수

src/app/페이지명/_query/
└── example.query.ts # queryOptions/useQuery/useMutation
```

`response.ts`는 API 응답이 `{ data, message }` 같은 envelope 형태로 반복될 때만 추가합니다.

## `ApiError`

공통 API 에러는 `Error`를 확장한 `ApiError` 클래스로 정규화합니다. TanStack Query의 error state와 TypeScript narrowing을 고려해 plain object보다 `Error` subclass를 기본으로 사용합니다.

```ts
export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'cancelled' | 'unknown';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly payload?: unknown;

  constructor(params: {
    message: string;
    kind: ApiErrorKind;
    status?: number;
    code?: string;
    payload?: unknown;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.kind = params.kind;
    this.status = params.status;
    this.code = params.code;
    this.payload = params.payload;
    this.cause = params.cause;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
```

## 에러 정규화

Axios error, network error, timeout, cancelled, unknown error를 모두 `ApiError`로 변환합니다.

```ts
import axios from 'axios';
import { ApiError } from './error';

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({
        message: '요청 시간이 초과되었습니다.',
        kind: 'timeout',
        status,
        code: error.code,
        payload,
        cause: error,
      });
    }

    if (error.code === 'ERR_CANCELED') {
      return new ApiError({
        message: '요청이 취소되었습니다.',
        kind: 'cancelled',
        status,
        code: error.code,
        payload,
        cause: error,
      });
    }

    if (!error.response) {
      return new ApiError({
        message: '네트워크 연결을 확인해주세요.',
        kind: 'network',
        code: error.code,
        cause: error,
      });
    }

    return new ApiError({
      message: extractErrorMessage(payload) ?? '요청 처리 중 오류가 발생했습니다.',
      kind: 'http',
      status,
      code: error.code,
      payload,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      kind: 'unknown',
      cause: error,
    });
  }

  return new ApiError({
    message: '알 수 없는 오류가 발생했습니다.',
    kind: 'unknown',
    payload: error,
  });
}

function extractErrorMessage(payload: unknown): string | undefined {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  return undefined;
}
```

## Axios interceptor

Axios interceptor는 `src/common/api/client.ts`에서 설정합니다.

```ts
import axios from 'axios';
import { normalizeApiError } from './error';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);
```

중요한 규칙:

- interceptor에서 에러를 삼키지 않습니다.
- 실패한 요청은 반드시 `Promise.reject(normalizeApiError(error))` 형태로 넘깁니다.
- 에러를 `return`으로 성공 응답처럼 바꾸지 않습니다.
- Toast, redirect, logout 같은 UI/정책 처리는 아직 interceptor에 넣지 않습니다.

## API 함수 규칙

API 함수는 UI 정책을 몰라야 합니다. 요청하고 `data`만 반환합니다. 에러는 interceptor에서 `ApiError`로 정규화되어 그대로 throw됩니다.

```ts
import { apiClient } from '@/common/api/client';

type UserResponse = {
  id: string;
  name: string;
};

export async function getUser(userId: string): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>(`/users/${userId}`);
  return response.data;
}
```

응답 envelope가 반복되면 `src/common/api/response.ts`를 사용할 수 있습니다.

```ts
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export function unwrapData<T>(response: ApiResponse<T>): T {
  return response.data;
}
```

## TanStack Query 연계

TanStack Query는 query function 또는 mutation function이 throw한 에러를 error state로 받습니다.

```ts
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../_api/user.api';

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  });
}
```

queryOptions를 사용하는 경우:

```ts
import { queryOptions } from '@tanstack/react-query';
import { getUser } from '../_api/user.api';

export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  });
}
```

## UI에서 에러 소비

UI는 `isApiError`로 에러 타입을 좁힌 뒤 사용자에게 보여줄 메시지를 결정합니다.

```tsx
import { isApiError } from '@/common/api/error';
import { useUserQuery } from './_query/user.query';

export function UserProfile({ userId }: { userId: string }) {
  const { data, isPending, isError, error } = useUserQuery(userId);

  if (isPending) {
    return <div>불러오는 중...</div>;
  }

  if (isError) {
    const message = isApiError(error) ? error.message : '알 수 없는 오류가 발생했습니다.';

    return <div role="alert">{message}</div>;
  }

  return <div>{data.name}</div>;
}
```

UI의 책임:

- 사용자에게 보여줄 메시지 선택
- 재시도 버튼 표시 여부 결정
- 폼 field error와 연결할지 결정
- 페이지별 fallback UI 표시

## 상태코드별 정책

`ApiError.status`에는 HTTP status를 보존합니다. 하지만 `401`, `403`, `500` 등 상태코드별 동작 정책은 아직 정하지 않았습니다.

현재는 아래처럼 TBD로 둡니다.

```ts
// TODO: 프로젝트 정책 결정 필요
// 401: TBD - 로그인 만료 처리? 로그인 페이지 이동? 조용한 실패?
// 403: TBD - 권한 없음 페이지? toast? inline message?
// 500: TBD - 공통 서버 오류 toast? 페이지 fallback? retry 정책?
```

현재 결정:

- status code는 `ApiError.status`에 보존합니다.
- 401/403/500에 대한 행동은 아직 결정하지 않습니다.
- 임의로 interceptor에서 redirect/logout/toast를 실행하지 않습니다.
- 추후 전역 error policy가 정해지면 이 문서를 갱신합니다.

## 테스트 기준

API 에러 처리의 세부 로직은 E2E보다 unit test로 검증합니다.

권장 테스트:

- `normalizeApiError`가 AxiosError를 `ApiError`로 변환하는지
- network/timeout/cancelled/unknown 케이스가 구분되는지
- API 함수가 성공 시 `data`만 반환하는지
- UI 컴포넌트가 `ApiError.message`를 표시하는지

E2E에서는 Axios interceptor 내부 분기를 직접 테스트하지 않습니다. E2E는 사용자 흐름에서 에러 메시지가 보이는지 정도만 확인합니다.

## 요약

```text
src/common/api/client.ts
  → axios instance + response interceptor

src/common/api/error.ts
  → ApiError + normalizeApiError + isApiError

src/app/페이지명/_api/*.api.ts
  → data 반환, 에러는 잡지 않음

src/app/페이지명/_query/*.query.ts
  → TanStack Query로 error state 수신

UI 컴포넌트
  → isApiError로 좁혀 메시지 표시

상태코드별 정책
  → TBD
```

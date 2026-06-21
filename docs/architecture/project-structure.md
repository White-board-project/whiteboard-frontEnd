

# 프로젝트 폴더 구조 가이드

이 프로젝트는 최신 Next.js App Router 기반의 프론트엔드 프로젝트입니다. 전체 구조는 `src/app`과 `src/common`을 중심으로 나누고, 페이지 전용 코드는 각 페이지 폴더 안에 함께 배치합니다.

## 기본 구조

프로젝트 초기 생성 순서는 [초기 세팅 가이드](../setup/initial-setup.md)를 따릅니다. 프로젝트의 주요 기술 선택은 [기술 스택 가이드](../stack/tech-stack.md)를 따릅니다. Provider 구성은 [Provider 구성 가이드](./provider-structure.md)를 따릅니다. import 경로는 [Import / Path Alias 컨벤션](../conventions/import-convention.md)을 따릅니다. 파일과 폴더의 자세한 이름 규칙은 [네이밍 컨벤션](../conventions/naming-conventions.md)을 따릅니다. 환경 변수는 [환경 변수 관리 가이드](../setup/environment-variables.md)를 따르고, 스타일링은 [스타일링 가이드](../stack/styling.md), 테스트는 [테스트 전략 가이드](../stack/testing.md)를 따릅니다.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   │
│   ├── 페이지명/
│   │   ├── page.tsx
│   │   ├── _components/
│   │   ├── _hooks/
│   │   ├── _api/
│   │   ├── _query/
│   │   ├── _utils/
│   │   ├── _types/
│   │   ├── _constants/
│   │   └── 각 폴더의 index.ts
│   │
│   └── whiteboard/
│       ├── page.tsx
│       ├── _components/
│       ├── _hooks/
│       ├── _api/
│       ├── _query/
│       ├── _utils/
│       ├── _types/
│       └── _constants/
│
└── common/
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   └── feedback/
    ├── hooks/
    ├── store/
    ├── api/
    ├── query/
    │   └── query-client.ts
    ├── utils/
    ├── constants/
    ├── types/
    └── assets/
```

## `src/app`

`src/app`은 Next.js App Router의 라우팅 영역입니다. 실제 페이지는 기본적으로 `src/app/페이지명/page.tsx` 형태로 작성합니다.

예시:

```text
src/app/whiteboard/page.tsx
src/app/dashboard/page.tsx
src/app/login/page.tsx
```

### 라우트 공통 파일


| 파일              | 역할                      |
| --------------- | ----------------------- |
| `layout.tsx`    | 앱 전체 또는 특정 라우트 영역의 레이아웃 |
| `page.tsx`      | 해당 경로의 페이지 컴포넌트         |
| `globals.css`   | 전역 스타일                  |
| `loading.tsx`   | 로딩 UI                   |
| `error.tsx`     | 에러 UI                   |
| `not-found.tsx` | 404 UI                  |


## 페이지별 내부 구조

각 페이지에서만 사용하는 컴포넌트, 훅, API, Query, 유틸, 타입, 상수는 해당 페이지 폴더 하위에 `_` prefix를 붙인 폴더로 관리합니다.

```text
src/app/whiteboard/
├── page.tsx
├── _components/
│   ├── WhiteboardCanvas.tsx
│   ├── ToolBar.tsx
│   └── ColorPicker.tsx
├── _hooks/
│   └── useWhiteboard.ts
├── _api/
│   ├── whiteboard.api.ts
│   └── index.ts
├── _query/
│   ├── whiteboard.keys.ts
│   ├── whiteboard.query.ts
│   └── index.ts
├── _utils/
│   ├── calculateCanvasPosition.ts
│   └── index.ts
├── _types/
│   ├── whiteboard.type.ts
│   └── index.ts
└── _constants/
    ├── tool.constants.ts
    └── index.ts
```

### 페이지 내부 폴더 역할


| 폴더            | 역할                  |
| ------------- | ------------------- |
| `_components` | 해당 페이지에서만 사용하는 컴포넌트 |
| `_hooks`      | 해당 페이지 전용 커스텀 훅     |
| `_api`        | 해당 페이지 전용 API 호출 함수/엔드포인트 모듈 |
| `_query`      | 해당 페이지 전용 서버 상태 쿼리 정의 및 훅 |
| `_utils`      | 해당 페이지 전용 유틸 함수     |
| `_types`      | 해당 페이지에서만 사용하는 타입   |
| `_constants`  | 해당 페이지 전용 상수        |


`_components`, `_hooks`처럼 `_`로 시작하는 폴더는 라우트 경로로 사용하지 않는 내부 구현 폴더라는 의미를 줍니다.

Next.js App Router에서 `_`로 시작하는 폴더는 Private Folder로 취급되어 라우팅 시스템에서 제외됩니다. 따라서 페이지 내부 구현을 `app` 폴더 안에 함께 두면서도 URL 경로와 명확히 분리할 수 있습니다.

각 private folder와 그 하위 역할 폴더에는 `index.ts`를 두고, 폴더 밖에서 사용할 public export를 명시적으로 관리합니다. 예를 들어 `src/app/whiteboard/_query/index.ts`는 `whiteboard.keys.ts`와 `whiteboard.query.ts`에서 외부에 공개할 항목만 re-export합니다. 폴더 밖에서는 `./_query/whiteboard.query` 같은 세부 파일 경로가 아니라 `./_query`처럼 폴더 index를 import합니다.

예를 들어 아래 구조에서 실제 라우트는 `/whiteboard` 하나이고, `_components`, `_hooks`, `_api`, `_query`, `_utils`, `_types`는 URL 경로가 되지 않습니다.

```text
src/app/whiteboard/
├── page.tsx              # /whiteboard
├── _components/          # 라우팅 제외
├── _hooks/               # 라우팅 제외
├── _api/                 # 라우팅 제외
├── _query/               # 라우팅 제외
├── _utils/               # 라우팅 제외
└── _types/               # 라우팅 제외
```

## React 구조를 Next.js 구조로 적용하는 방식

이 프로젝트의 구조는 일반 React 프로젝트에서 자주 사용하는 “공용 코드와 페이지 전용 코드를 분리하는 방식”을 Next.js App Router에 맞게 변환한 형태입니다.

React 프로젝트에서는 보통 다음과 같은 구조를 사용할 수 있습니다.

```text
pages/
└── whiteboard/
    └── index/
        ├── components/
        ├── hooks/
        ├── api/
        ├── query/
        ├── utils/
        ├── types/
        └── index.tsx
```

하지만 Next.js App Router에서는 폴더가 URL segment가 되고, 페이지 파일은 `index.tsx`가 아니라 `page.tsx`를 사용합니다. 따라서 위 구조는 다음처럼 적용합니다.

```text
src/app/whiteboard/
├── page.tsx
├── _components/
├── _hooks/
├── _api/
├── _query/
├── _utils/
└── _types/
```

핵심 차이는 다음과 같습니다.


| React 구조     | Next.js App Router 구조 | 이유                    |
| ------------ | --------------------- | --------------------- |
| `pages`      | `src/app`             | App Router의 라우팅 기준 폴더 |
| `index.tsx`  | `page.tsx`            | App Router의 페이지 예약 파일 |
| `components` | `_components`         | 페이지 내부 구현 폴더이며 라우팅 제외 |
| `hooks`      | `_hooks`              | 페이지 내부 구현 폴더이며 라우팅 제외 |
| `api`        | `_api`                | 페이지 내부 API 호출 폴더이며 라우팅 제외 |
| `query`      | `_query`              | 페이지 내부 서버 상태 쿼리 폴더이며 라우팅 제외 |
| `utils`      | `_utils`              | 페이지 내부 구현 폴더이며 라우팅 제외 |
| `types`      | `_types`              | 페이지 내부 구현 폴더이며 라우팅 제외 |


즉, React 구조의 핵심인 “페이지 가까이에 관련 코드를 모아두는 방식”은 유지하되, Next.js에서는 App Router의 예약 파일과 Private Folder 규칙에 맞춰 적용합니다.

## `src/common`

`src/common`은 여러 페이지에서 공용으로 사용하는 코드를 모아두는 영역입니다. 특정 페이지에 강하게 종속되지 않는 코드만 이곳에 둡니다.

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

### 공용 폴더 역할


| 폴더           | 역할                        |
| ------------ | ------------------------- |
| `components` | 여러 페이지에서 재사용되는 공용 컴포넌트    |
| `hooks`      | 여러 페이지에서 재사용되는 커스텀 훅      |
| `store`      | 여러 페이지에서 공유되는 Zustand 클라이언트 전역 상태 |
| `api`        | 여러 페이지에서 재사용되는 순수 API 요청 함수와 공용 HTTP 레이어 |
| `query`      | 여러 페이지에서 재사용되는 서버 상태 쿼리 key/options/hooks |
| `utils`      | 범용 유틸 함수                  |
| `constants`  | 공통 상수                     |
| `types`      | 공통 타입                     |
| `assets`     | 공용 이미지, 아이콘, SVG 등 정적 리소스 |


## 공용 컴포넌트 분류

```text
src/common/components/
├── ui/
├── layout/
└── feedback/
```


| 폴더         | 역할                                                                   |
| ---------- | -------------------------------------------------------------------- |
| `ui`       | Button, Input, Modal처럼 재사용 가능한 기본 UI 컴포넌트                            |
| `layout`   | Header, Footer, Sidebar, AppShell 같은 레이아웃 컴포넌트                       |
| `feedback` | EmptyState, LoadingSpinner, ErrorFallback처럼 사용자 상태 피드백을 보여주는 공통 컴포넌트 |


`src/common/components/common`처럼 `common` 아래에 다시 `common`을 두면 의미가 중복됩니다. 따라서 `src/common`은 공용 영역이라는 큰 분류로 유지하고, 그 아래 컴포넌트 폴더는 `ui`, `layout`, `feedback`처럼 역할이 드러나는 이름을 사용합니다.

## API와 Query 분리 기준

`api`와 `query`는 모두 서버 데이터와 관련이 있지만 역할이 다릅니다. `api`는 서버에 요청하는 순수 함수 계층이고, `query`는 TanStack Query 같은 서버 상태 관리 도구의 캐시 key, options, hook을 정의하는 계층입니다.

API 에러 처리는 [API 에러 처리 가이드](./api-error-handling.md)를 따릅니다. 공통 Axios response interceptor에서 에러를 정규화하고, 상태코드별 세부 정책은 추후 결정합니다.

이 프로젝트의 `src/common/api`와 `src/app/페이지명/_api`는 Next.js Route Handler가 아니라, 프론트엔드에서 외부 API를 호출하기 위한 클라이언트 요청 함수 모음입니다. 현재 프로젝트는 `src/app/api/route.ts` 같은 Next 서버 API를 사용하지 않는 것을 기본 전제로 합니다.

```text
src/common/api       # 여러 페이지에서 재사용되는 순수 API 요청 함수
src/common/query     # 여러 페이지에서 재사용되는 query key/options/hooks와 QueryClient 설정

src/app/페이지명/_api    # 해당 페이지 전용 순수 API 요청 함수
src/app/페이지명/_query  # 해당 페이지 전용 query key/options/hooks
```

### `api`에 두는 것

- `getWhiteboard`, `createWhiteboard`, `updateWhiteboard` 같은 순수 요청 함수
- 공용 `fetch`/HTTP client 래퍼
- endpoint 상수, 요청/응답 변환 로직

`api`에는 `useQuery`, `useMutation` 같은 React hook을 두지 않습니다.

### `query`에 두는 것

- `whiteboardQueryKeys` 같은 query key factory
- `whiteboardQueryOptions` 같은 query options 함수
- `useWhiteboardQuery`, `useCreateWhiteboardMutation` 같은 서버 상태 hook 래퍼

`query`에는 직접 `fetch` 호출을 흩뿌리지 않고, `api`의 순수 요청 함수를 가져와 사용합니다.

`_query` 폴더는 역할별 파일을 분리합니다.

```text
src/app/whiteboard/_query/
├── whiteboard.keys.ts  # query/mutation key factory
├── whiteboard.query.ts # queryOptions/useQuery/useMutation 정의
└── index.ts            # public export
```

query key와 mutation key는 hook 안에 문자열 배열로 직접 작성하지 않습니다. 반드시 `.keys.ts`의 factory에서 만들고, `.query.ts`는 그 key factory와 `_api`의 순수 요청 함수를 조합합니다.

## 코드 배치 기준

### 페이지 폴더에 두는 경우

다음 조건에 해당하면 `src/app/페이지명` 하위에 둡니다.

- 해당 페이지에서만 사용한다.
- 페이지의 상태나 UI 흐름에 강하게 묶여 있다.
- 다른 페이지에서 재사용될 가능성이 낮다.

예시:

```text
src/app/whiteboard/_components/ToolBar.tsx
src/app/whiteboard/_hooks/useWhiteboard.ts
src/app/whiteboard/_api/whiteboard.api.ts
src/app/whiteboard/_query/whiteboard.query.ts
src/app/whiteboard/_utils/calculateCanvasPosition.ts
```

### `common`에 두는 경우

다음 조건에 해당하면 `src/common` 하위에 둡니다.

- 여러 페이지에서 재사용한다.
- 특정 페이지의 도메인에 종속되지 않는다.
- 범용 UI, 범용 훅, 범용 API, 범용 Query, 범용 유틸이다.

예시:

```text
src/common/components/ui/Button.tsx
src/common/hooks/useDebounce.ts
src/common/store/modal.store.ts
src/common/api/whiteboard.api.ts
src/common/query/whiteboard.query.ts
src/common/utils/formatDate.ts
src/common/constants/routes.ts
src/common/types/api.type.ts
```

## Import 규칙

자세한 import 기준은 [Import / Path Alias 컨벤션](../conventions/import-convention.md)을 따릅니다. 프로젝트 생성 시 `@/*` alias를 사용합니다.

```ts
import { Button } from '@/common/components/ui/Button';
import { getWhiteboard } from '@/common/api/whiteboard.api';
import { whiteboardQueryOptions } from '@/common/query/whiteboard.query';
import { ROUTES } from '@/common/constants/routes';
```

페이지 내부 전용 파일은 같은 페이지 폴더 안에서 상대 경로를 사용합니다. private folder 경계를 넘을 때는 해당 폴더의 `index.ts`를 경유합니다.

```ts
import { ToolBar } from './_components';
import { useWhiteboard } from './_hooks';
import { getWhiteboardDetail } from './_api';
import { useWhiteboardDetailQuery } from './_query';
```

## 권장 규칙

1. `src/app`은 라우팅과 페이지 조립을 담당합니다.
2. 페이지별 세부 구현은 해당 페이지 폴더의 `_components`, `_hooks`, `_api`, `_query`, `_utils`, `_types`, `_constants`에 둡니다.
3. 여러 페이지에서 재사용되기 전까지는 성급하게 `common`으로 올리지 않습니다.
4. 두 개 이상의 페이지에서 실제로 재사용되면 `src/common`으로 이동합니다.
5. `common`은 특정 페이지의 비즈니스 흐름을 알지 않도록 유지합니다.
6. `store`는 서버 데이터가 아닌 클라이언트 전역 상태만 담당합니다.
7. `api`는 순수 요청 함수, `query`는 query key/options/hooks를 담당하도록 섞지 않습니다.
8. query key와 mutation key는 `.keys.ts`의 factory에서 만들고, `.query.ts`에서는 key factory를 사용합니다.
9. private folder와 하위 역할 폴더는 `index.ts`에서 명시적 public export를 관리합니다.
10. Server Component를 기본으로 사용하고, 상태/effect/브라우저 API가 필요한 경우에만 `"use client"`를 사용합니다.

## 초기 생성 순서

프로젝트 생성, 패키지 설치, 설정 파일 생성, 초기 검증 순서는 [초기 세팅 가이드](../setup/initial-setup.md)를 따릅니다.

구조 관점의 핵심 순서는 다음과 같습니다.

1. Next.js 프로젝트를 `src` 디렉토리와 App Router 기준으로 생성합니다.
2. `src/app` 기본 파일과 `providers.tsx`를 확인합니다.
3. `src/common` 하위 공용 폴더를 생성합니다.
4. `src/common/query/query-client.ts`, `src/common/api/client.ts`, `src/common/api/error.ts`를 생성합니다.
5. 첫 페이지를 `src/app/페이지명/page.tsx` 형태로 생성합니다.
6. 페이지 전용 기능이 생기면 `_components`, `_hooks`, `_api`, `_query`, `_utils`, `_types`, `_constants`를 추가합니다.
7. 각 private folder의 `index.ts`를 만들고, `_query`에는 `.keys.ts`와 `.query.ts`를 분리합니다.
8. 실제로 여러 페이지에서 재사용되는 코드만 `src/common`으로 이동합니다.

# Import / Path Alias 컨벤션

이 문서는 프로젝트의 import 경로와 path alias 사용 기준을 정의합니다.

## 기본 결정

```text
사용 alias              : @/*
alias 대상              : src/*
공용 모듈 import         : @/common/...
페이지 내부 전용 import   : 상대경로 ./_components/..., ./_hooks/...
깊은 상대경로             : 사용하지 않음
추가 alias               : 만들지 않음
```

## tsconfig 설정

`@/*` alias는 `src/*`를 가리킵니다.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Next.js 프로젝트 생성 시 `--import-alias "@/*"` 옵션을 사용하면 이 기준에 맞출 수 있습니다.

```bash
pnpm create next-app@latest . \
  --ts \
  --app \
  --src-dir \
  --tailwind \
  --import-alias "@/*"
```

## 공용 모듈 import

`src/common` 하위의 공용 모듈은 alias로 import합니다.

```ts
import { Button } from '@/common/components/ui/Button';
import { apiClient } from '@/common/api/client';
import { isApiError } from '@/common/api/error';
import { cn } from '@/common/utils/cn';
import { useModalStore } from '@/common/store/modal.store';
```

공용 모듈을 깊은 상대경로로 가져오지 않습니다.

```ts
// 사용하지 않음
import { Button } from '../../../common/components/ui/Button';
```

## 페이지 내부 전용 import

페이지 내부에서만 사용하는 `_components`, `_hooks`, `_api`, `_query`, `_utils`, `_types`, `_constants`는 같은 페이지 폴더 안에서 상대경로를 사용합니다. private folder 경계를 넘는 import는 해당 폴더의 `index.ts`를 경유합니다.

```ts
import { ToolBar } from './_components';
import { useWhiteboard } from './_hooks';
import { getWhiteboardDetail } from './_api';
import { useWhiteboardDetailQuery } from './_query';
```

이유:

- 해당 코드가 페이지 내부 전용이라는 의도가 명확합니다.
- 같은 route segment 안에서 파일 위치 관계를 쉽게 파악할 수 있습니다.
- 페이지 전용 코드를 공용 코드처럼 오해하지 않게 합니다.

## 폴더 index export 규칙

페이지 private folder와 하위 역할 폴더는 `index.ts`에서 외부 공개 API를 관리합니다.

```text
src/app/workspace-access/
├── _components/
│   ├── screen/
│   │   ├── WorkspaceAccessContainer.tsx
│   │   └── index.ts
│   └── index.ts
├── _query/
│   ├── workspace-access.keys.ts
│   ├── workspace-access.query.ts
│   └── index.ts
└── _utils/
    ├── workspace-access-path.ts
    └── index.ts
```

`index.ts`는 명시적 re-export를 기본으로 합니다.

```ts
export { WorkspaceAccessContainer } from './WorkspaceAccessContainer';
export type { WorkspaceAccessSubmitHandler } from './workspace-access.type';
```

무분별한 `export *`는 피합니다. 공개해야 하는 항목을 파일마다 명시해야 리뷰 시 public surface가 분명해지고, 의도하지 않은 내부 구현 export를 막을 수 있습니다.

같은 폴더 내부 구현끼리는 자기 폴더의 `index.ts`에서 다시 import하지 않습니다. 내부 구현 간 의존성은 `./WorkspaceAccessPage`처럼 sibling 경로를 사용해 순환 import를 피합니다. 단, 폴더 밖에서 접근할 때는 `./_query`, `../_utils`처럼 폴더 index를 사용합니다.

## 페이지 내부에서 공용 모듈을 사용할 때

페이지 내부 파일에서도 `src/common` 모듈을 가져올 때는 alias를 사용합니다.

```ts
import { Button } from '@/common/components/ui/Button';
import { apiClient } from '@/common/api/client';

import { ToolBar } from './_components';
```

즉, 기준은 다음과 같습니다.

```text
같은 페이지 내부 코드  → 상대경로
src/common 공용 코드   → @/common alias
```

## 금지하는 import 패턴

### 깊은 상대경로

```ts
// 사용하지 않음
import { formatDate } from '../../../../common/utils/formatDate';
```

### 여러 alias 추가

```ts
// 사용하지 않음
import { Button } from '@components/ui/Button';
import { formatDate } from '@utils/formatDate';
```

이 프로젝트에서는 `@/*` 하나만 사용합니다.

### 페이지 전용 코드를 다른 페이지에서 직접 import

```ts
// 사용하지 않음
import { ToolBar } from '@/app/whiteboard/_components/ToolBar';
```

다른 페이지에서도 필요해진 코드는 `src/common`으로 이동한 뒤 import합니다.

`index.ts`가 있어도 다른 페이지의 private folder를 import할 수 없습니다.

```ts
// 사용하지 않음
import { ToolBar } from '@/app/whiteboard/_components';
```

## 테스트 설정

Vitest에서 `@/*` alias를 사용하려면 `vite-tsconfig-paths`를 사용합니다.

```ts
// vitest.config.mts
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

## 정리 기준

| 상황 | import 기준 | 예시 |
| --- | --- | --- |
| 공용 컴포넌트 | alias | `@/common/components/ui/Button` |
| 공용 API client | alias | `@/common/api/client` |
| 공용 유틸 | alias | `@/common/utils/cn` |
| 페이지 내부 컴포넌트 | 상대경로 + 폴더 index | `./_components` |
| 페이지 내부 훅 | 상대경로 + 폴더 index | `./_hooks` |
| 페이지 내부 API | 상대경로 + 폴더 index | `./_api` |
| 페이지 내부 Query | 상대경로 + 폴더 index | `./_query` |
| 다른 페이지의 private folder | import 금지 | `@/app/other/_components/...` 금지 |

## 요약

```text
alias는 @/* 하나만 사용한다.
@/*는 src/*를 가리킨다.
공용 코드는 @/common/...으로 가져온다.
페이지 내부 전용 코드는 ./_components, ./_query처럼 폴더 index 경유 상대경로로 가져온다.
../../../common/... 같은 깊은 상대경로는 사용하지 않는다.
다른 페이지의 _components/_hooks 등 private folder를 직접 import하지 않는다.
index.ts는 명시적 re-export로 public export를 관리한다.
```

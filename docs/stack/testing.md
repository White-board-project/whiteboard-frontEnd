# 테스트 전략 가이드

이 프로젝트의 테스트 전략은 **Vitest + React Testing Library + Playwright** 조합을 사용합니다.

## 확정된 테스트 스택

| 영역 | 도구 | 역할 |
| --- | --- | --- |
| Unit Test | Vitest | 순수 함수, 유틸, schema, store 로직 테스트 |
| Component Test | Vitest + React Testing Library | React 컴포넌트 렌더링과 사용자 상호작용 테스트 |
| DOM Matcher | @testing-library/jest-dom | DOM assertion 확장 matcher 제공 |
| User Event | @testing-library/user-event | 실제 사용자에 가까운 클릭/입력 이벤트 시뮬레이션 |
| DOM Environment | jsdom | Node 환경에서 DOM API 에뮬레이션 |
| E2E Test | Playwright | 실제 브라우저 기반 핵심 사용자 플로우 테스트 |

## 설치 패키지

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
pnpm create playwright
```

Playwright 초기 설정 시에는 TypeScript 사용을 선택하고, 브라우저 설치도 함께 진행합니다.

## 테스트 역할 분리

### Vitest만 사용하는 경우

DOM이나 React 렌더링이 필요 없는 테스트는 Vitest만 사용합니다.

예시:

- 순수 유틸 함수
- Zod schema validation
- Axios helper 함수
- Zustand store action 로직
- 날짜/문자열/좌표 계산 함수

### Vitest + React Testing Library를 사용하는 경우

React 컴포넌트를 렌더링하거나 사용자의 클릭/입력을 검증해야 하면 React Testing Library를 함께 사용합니다.

예시:

- Button, Input, Modal 렌더링
- React Hook Form 기반 폼 입력/검증 메시지
- Zustand 상태를 읽는 컴포넌트
- TanStack Query 상태에 따른 loading/error/success UI
- 사용자 클릭/입력 후 UI 변화

### Playwright를 사용하는 경우

Playwright는 실제 브라우저를 실행해서 사용자의 핵심 흐름을 검증합니다.

예시:

- 랜딩 페이지 접속
- 로그인/로그아웃
- 주요 페이지 이동
- 새 화이트보드 생성
- 보드 상세 페이지 진입
- 폼 제출 성공/실패 흐름

## 테스트 파일 위치

Unit/Component 테스트는 테스트 대상 파일 옆에 둡니다.

```text
src/app/whiteboard/_components/ToolBar.tsx
src/app/whiteboard/_components/ToolBar.test.tsx

src/app/whiteboard/_utils/calculateCanvasPosition.ts
src/app/whiteboard/_utils/calculateCanvasPosition.test.ts

src/common/components/ui/Button.tsx
src/common/components/ui/Button.test.tsx
```

E2E 테스트는 루트의 `e2e` 폴더에 둡니다.

```text
e2e/
├── smoke.spec.ts
├── auth.spec.ts
└── whiteboard.spec.ts
```

## Vitest 설정

Import alias 설정은 [Import / Path Alias 컨벤션](../conventions/import-convention.md)을 따릅니다.

권장 설정 파일:

```text
vitest.config.mts
vitest.setup.ts
```

예시:

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

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

## Playwright 설정

권장 설정 파일:

```text
playwright.config.ts
```

E2E는 Next.js 앱을 실제로 실행한 뒤 브라우저로 접속해서 테스트합니다. `webServer` 옵션을 사용하면 Playwright가 테스트 전에 개발 서버를 자동으로 실행할 수 있습니다.

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

## 권장 scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:headed": "playwright test --headed",
    "e2e:report": "playwright show-report"
  }
}
```

## E2E 테스트 작성 기준

E2E 테스트는 느리고 비용이 크기 때문에 모든 기능을 테스트하지 않습니다. 깨지면 서비스 핵심 사용성이 망가지는 흐름만 작게 시작합니다.

처음 작성할 추천 E2E 테스트:

```text
e2e/smoke.spec.ts       # 홈/주요 페이지가 열리는지
e2e/auth.spec.ts        # 로그인/로그아웃 흐름
e2e/whiteboard.spec.ts  # 핵심 화이트보드 생성/진입 흐름
```

E2E로 테스트하지 않는 것:

- Tailwind className이 정확히 붙었는지
- 모든 버튼의 모든 스타일
- Zustand store 내부 값 직접 검사
- TanStack Query 내부 캐시 동작
- Zod schema의 모든 validation case
- Axios interceptor의 세부 분기
- 순수 함수 로직

이런 항목은 Vitest 또는 React Testing Library로 테스트합니다.

## 테스트 선택 기준

| 테스트 대상 | 사용 도구 |
| --- | --- |
| 순수 함수 | Vitest |
| 유틸 함수 | Vitest |
| Zod schema | Vitest |
| Zustand store action | Vitest |
| React 컴포넌트 렌더링 | Vitest + React Testing Library |
| 폼 입력/검증 메시지 | Vitest + React Testing Library |
| 사용자 클릭/타이핑 | React Testing Library + user-event |
| 실제 브라우저 사용자 흐름 | Playwright |

## 요약

```text
Unit Test      : Vitest
Component Test : Vitest + React Testing Library
E2E Test       : Playwright

Unit/Component 테스트 위치 : 테스트 대상 파일 옆
E2E 테스트 위치            : e2e/
```

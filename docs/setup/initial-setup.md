# 초기 세팅 가이드

이 문서는 빈 Git repository에서 Next.js 프론트엔드 프로젝트를 생성하고, 현재까지 결정한 기술 스택과 컨벤션을 적용하는 순서를 정리합니다.

## 전제

```text
Framework       : Next.js App Router
Language        : TypeScript
Package Manager : pnpm
Styling         : Tailwind CSS
Code Quality    : Biome
Server State    : TanStack Query
Client State    : Zustand
Form            : React Hook Form + Zod
HTTP Client     : Axios
Test            : Vitest + React Testing Library + Playwright
Path Alias      : @/*
```

## 1. pnpm 준비

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## 2. Next.js 프로젝트 생성

현재 repository 루트에서 실행합니다.

```bash
pnpm create next-app@latest . \
  --ts \
  --app \
  --src-dir \
  --tailwind \
  --import-alias "@/*"
```

### ESLint 옵션에 대한 기준

이 프로젝트는 ESLint/Prettier를 사용하지 않고 Biome을 사용합니다.

`create-next-app` 실행 중 ESLint 선택지가 나오면 선택하지 않습니다. 만약 템플릿 생성 과정에서 ESLint 관련 파일이 생기면 Biome 설정 후 제거하거나 사용하지 않습니다.

기준:

```text
ESLint   : 사용하지 않음
Prettier : 사용하지 않음
Biome    : 사용함
```

## 3. 런타임 의존성 설치

```bash
pnpm add @tanstack/react-query zustand axios react-hook-form zod @hookform/resolvers clsx tailwind-merge
```

역할:

| 패키지 | 역할 |
| --- | --- |
| `@tanstack/react-query` | 서버 상태 관리 |
| `zustand` | 클라이언트 전역 상태 관리 |
| `axios` | HTTP 통신 |
| `react-hook-form` | 폼 상태 관리 |
| `zod` | schema validation |
| `@hookform/resolvers` | React Hook Form과 Zod 연결 |
| `clsx` | 조건부 className 조합 |
| `tailwind-merge` | Tailwind className 충돌 병합 |

React Query Devtools는 사용하지 않으므로 설치하지 않습니다.

```bash
# 설치하지 않음
@tanstack/react-query-devtools
```

## 4. 개발 의존성 설치

```bash
pnpm add -D -E @biomejs/biome
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
```

Playwright는 별도 초기화 명령으로 추가합니다.

```bash
pnpm create playwright
```

Playwright 초기 설정 시 권장 선택:

```text
TypeScript: Yes
Test folder: e2e
Install browsers: Yes
GitHub Actions workflow: 필요 시 선택
```

## 5. Biome 초기화

```bash
pnpm exec biome init
```

권장 `biome.json` 기준:

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

## 6. package.json scripts 정리

권장 scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "format": "biome format --write .",
    "lint": "biome lint --write .",
    "check": "biome check --write .",
    "ci": "biome ci .",
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

`next lint`는 사용하지 않습니다.

## 7. 기본 폴더 생성

```text
src/
├── app/
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── page.tsx
│   └── globals.css
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
    ├── utils/
    ├── constants/
    ├── types/
    └── assets/
```

## 8. 기본 파일 생성

### Provider

```text
src/app/providers.tsx
src/common/query/query-client.ts
```

자세한 내용은 [Provider 구성 가이드](../architecture/provider-structure.md)를 따릅니다.

### API

```text
src/common/api/client.ts
src/common/api/error.ts
```

필요 시 추가:

```text
src/common/api/response.ts
```

자세한 내용은 [API 에러 처리 가이드](../architecture/api-error-handling.md)를 따릅니다.

### Style Utility

```text
src/common/utils/cn.ts
```

자세한 내용은 [스타일링 가이드](../stack/styling.md)를 따릅니다.

### Environment

```text
.env.example
```

예시:

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

자세한 내용은 [환경 변수 관리 가이드](./environment-variables.md)를 따릅니다.

## 9. 테스트 설정 파일 생성

```text
vitest.config.mts
vitest.setup.ts
playwright.config.ts
e2e/
```

Vitest alias 설정은 `vite-tsconfig-paths`를 사용합니다.

자세한 내용은 [테스트 전략 가이드](../stack/testing.md)와 [Import / Path Alias 컨벤션](../conventions/import-convention.md)을 따릅니다.

## 10. tsconfig alias 확인

`tsconfig.json`에 아래 설정이 있는지 확인합니다.

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

자세한 내용은 [Import / Path Alias 컨벤션](../conventions/import-convention.md)을 따릅니다.

## 11. 초기 E2E smoke test 추가

처음에는 E2E 테스트를 많이 만들지 않고 smoke test만 둡니다.

```text
e2e/smoke.spec.ts
```

예시:

```ts
import { expect, test } from '@playwright/test';

test('홈 페이지가 열린다', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL('/');
});
```

## 12. 초기 검증 명령어

세팅 후 아래 명령어로 확인합니다.

```bash
pnpm check
pnpm test:run
pnpm build
```

E2E smoke test를 추가한 뒤에는 아래도 확인합니다.

```bash
pnpm e2e
```

## 추천 진행 순서 요약

```text
1. pnpm 준비
2. Next.js 프로젝트 생성
3. 런타임 의존성 설치
4. 개발 의존성 설치
5. Biome 초기화
6. package.json scripts 정리
7. src/common 폴더 생성
8. providers/query-client/api/error/cn/env 파일 생성
9. Vitest/Playwright 설정
10. tsconfig alias 확인
11. smoke test 추가
12. check/test/build/e2e 검증
```

## 관련 문서

- [기술 스택 가이드](../stack/tech-stack.md)
- [프로젝트 폴더 구조 가이드](../architecture/project-structure.md)
- [Provider 구성 가이드](../architecture/provider-structure.md)
- [API 에러 처리 가이드](../architecture/api-error-handling.md)
- [Import / Path Alias 컨벤션](../conventions/import-convention.md)
- [환경 변수 관리 가이드](./environment-variables.md)
- [스타일링 가이드](../stack/styling.md)
- [테스트 전략 가이드](../stack/testing.md)

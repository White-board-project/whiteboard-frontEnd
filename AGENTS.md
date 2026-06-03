# AGENTS.md

## 저장소 핵심

- 단일 패키지 Next.js App Router 프론트엔드입니다. `pnpm-lock.yaml`이 있으므로 `pnpm`을 사용합니다.
- `src/app`은 라우팅과 페이지 조립 영역이고, `src/common`은 여러 페이지에서 실제로 재사용되는 코드만 두는 공용 영역입니다.
- 페이지 전용 구현은 해당 라우트 폴더 안의 `_components`, `_hooks`, `_api`, `_query`, `_utils`, `_types`, `_constants`에 둡니다.
- 다른 페이지의 `_...` private folder를 직접 import하지 마세요. 여러 페이지에서 필요해지면 `src/common`으로 올린 뒤 사용합니다.
- `src/common/api`와 `src/app/페이지명/_api`는 Next Route Handler가 아니라 외부 API를 호출하는 Axios 요청 함수 계층입니다.

## 구조 규칙

- 새 페이지는 `src/app/페이지명/page.tsx` 형태로 만듭니다. 라우트 폴더명은 `lowercase` 또는 `kebab-case`를 사용합니다.
- 페이지에 묶인 UI/상태/API/query/util/type/constant는 페이지 폴더 옆에 모읍니다. 예: `src/app/whiteboard/_components/ToolBar.tsx`.
- `src/common/components`는 역할별로 `ui`, `layout`, `feedback`을 사용합니다. `src/common/components/common`처럼 의미가 중복되는 폴더는 만들지 않습니다.
- `api` 파일은 순수 요청 함수만 담당하고, `useQuery`/`useMutation`은 `.query.ts` 파일에 둡니다.
- 서버 데이터 캐시는 TanStack Query가 담당합니다. Zustand는 모달/토글/선택값 같은 클라이언트 전용 상태에만 사용합니다.
- Server Component를 기본으로 두고, 상태/effect/브라우저 API가 필요한 컴포넌트에만 `'use client'`를 붙입니다.

## 명령어

- 설치: `pnpm install`
- 개발 서버: `pnpm dev`
- 빌드/타입 검증: `pnpm build` (`typecheck` 전용 script는 없음)
- 읽기 전용 Biome CI 검사: `pnpm run ci` (bare `pnpm ci`는 install 계열 명령처럼 동작하므로 쓰지 마세요)
- 포맷/lint/import 정리 적용: `pnpm check` (`format`, `lint`도 `--write`를 사용)
- Unit/Component 테스트: `pnpm test:run`; 단일 테스트 예: `pnpm exec vitest run src/common/utils/cn.test.ts`
- E2E 테스트: `pnpm e2e`; 단일 E2E 예: `pnpm exec playwright test e2e/smoke.spec.ts`

## 검증 기준

- 일반 코드 변경 후에는 `pnpm run ci` → `pnpm test:run` → `pnpm build` 순서로 확인합니다.
- 라우팅, 브라우저 동작, 사용자 플로우가 바뀌면 `pnpm e2e`도 실행합니다.
- Playwright는 `http://localhost:3000`에서 `pnpm dev`를 자동 실행하고, CI가 아니면 기존 서버를 재사용합니다.
- Vitest는 `src/**/*.{test,spec}.{ts,tsx}`만 `jsdom`에서 실행하고 `vitest.setup.ts`를 로드합니다. unit/component 테스트는 대상 파일 옆에 둡니다.

## 스타일과 네이밍

- 이 repo는 ESLint/Prettier를 쓰지 않습니다. Biome이 formatting, lint, import organization을 담당합니다.
- 현재 `biome.json`은 4-space indentation과 100자 line width입니다. 오래된 docs 예시는 2-space를 보여주므로 실제 config를 우선합니다.
- alias는 `@/*` 하나뿐이고 `src/*`를 가리킵니다. 공용 코드는 `@/common/...`, 같은 페이지 내부 전용 코드는 `./_components/...`처럼 상대 경로를 사용합니다.
- 컴포넌트 파일은 `PascalCase.tsx`, 훅은 `useCamelCase.ts`, store는 `.store.ts`, 타입은 `.type.ts`, 상수는 `.constants.ts`, API는 `.api.ts`, Query는 `.query.ts` suffix를 사용합니다.
- Next.js 예약 파일(`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)은 프레임워크 이름 그대로 둡니다.

## Provider/API/환경 gotcha

- `src/app/layout.tsx`는 Server Component로 유지하고, 클라이언트 provider는 `src/app/providers.tsx`에 둡니다.
- 현재 provider는 TanStack Query의 `QueryClientProvider` 중심입니다. React Query Devtools는 의도적으로 설치/사용하지 않습니다.
- Axios 공통 instance는 `src/common/api/client.ts`에 있고 `NEXT_PUBLIC_API_BASE_URL`을 사용합니다.
- API 에러는 `ApiError`로 정규화합니다. 401/403/500 정책은 아직 TBD이므로 interceptor에 redirect/logout/toast를 임의로 넣지 마세요.
- 로컬 환경은 `cp .env.example .env.local`로 시작합니다. 문서화된 값은 `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_API_BASE_URL`뿐입니다.
- `NEXT_PUBLIC_*` 값은 브라우저 번들에 포함되므로 secret을 넣지 않습니다.

## 건드리지 말 것

- `.next/`, `out/`, `coverage/`, `playwright-report/`, `test-results/`, `next-env.d.ts`는 생성/무시되는 산출물입니다.
- `pnpm-lock.yaml`은 의존성 변경이 있을 때만 바꿉니다.
- `src/common`으로 성급히 올리지 마세요. 두 개 이상의 페이지에서 실제 재사용될 때만 이동합니다.

## 참고할 문서

- 구조/배치: `docs/architecture/project-structure.md`
- Provider: `docs/architecture/provider-structure.md`
- API 에러 처리: `docs/architecture/api-error-handling.md`
- import와 네이밍: `docs/conventions/import-convention.md`, `docs/conventions/naming-conventions.md`
- 테스트: `docs/stack/testing.md`
- UI/비주얼 작업: `DESIGN.md`

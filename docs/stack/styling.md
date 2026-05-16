# 스타일링 가이드

이 프로젝트의 기본 스타일링 도구는 **Tailwind CSS**입니다. Next.js App Router 기반 프로젝트에서 빠르게 UI를 구성하고, 공통 디자인 규칙을 일관되게 관리하기 위해 Tailwind CSS를 기본값으로 사용합니다.

## 선택한 스타일링 스택

```text
기본 스타일링 : Tailwind CSS
보조 스타일링 : CSS Modules, 필요할 때만 사용
UI 컴포넌트   : 추후 shadcn/ui 도입 검토 가능
전역 스타일   : src/app/globals.css 최소 사용
```

## Tailwind CSS를 기본으로 사용하는 이유

- Next.js와 공식적으로 잘 맞습니다.
- className 기반으로 빠르게 UI를 만들 수 있습니다.
- 별도 런타임 CSS-in-JS 비용이 없습니다.
- 디자인 토큰과 반응형 규칙을 일관되게 관리하기 좋습니다.
- shadcn/ui 같은 Tailwind 기반 UI 컴포넌트와 함께 쓰기 좋습니다.
- 사이드 프로젝트에서 초기 개발 속도와 유지보수 균형이 좋습니다.

## 기본 규칙

1. 대부분의 스타일은 Tailwind className으로 작성합니다.
2. 전역 스타일은 `src/app/globals.css`에 최소한만 작성합니다.
3. 반복되는 스타일 조합은 공용 컴포넌트로 분리합니다.
4. `className`이 과도하게 길어지면 컴포넌트 분리 또는 `cn()` 유틸 사용을 검토합니다.
5. 복잡한 애니메이션, 특수 선택자, Tailwind로 표현하기 불편한 스타일만 CSS Modules를 보조로 사용합니다.
6. CSS-in-JS는 기본 스택에 포함하지 않습니다.

## 전역 스타일 위치

전역 스타일은 Next.js App Router 기준으로 `src/app/globals.css`에서 관리합니다.

```text
src/app/globals.css
```

`globals.css`에는 다음 정도만 둡니다.

- Tailwind import
- 기본 reset/base 스타일
- 전역 CSS 변수
- 폰트 기본값
- `body` 배경색/글자색 같은 앱 전체 기본 스타일

페이지나 컴포넌트별 세부 스타일은 `globals.css`에 넣지 않습니다.

## 공용 스타일 유틸

조건부 className 조합이 필요하면 `cn()` 유틸을 사용할 수 있습니다.

권장 위치:

```text
src/common/utils/cn.ts
```

예시:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

필요한 패키지:

```bash
pnpm add clsx tailwind-merge
```

`cn()`은 조건부 클래스, variant, 외부에서 받은 `className` 병합에 사용합니다.

```tsx
import { cn } from '@/common/utils/cn';

type ButtonProps = {
  className?: string;
};

export function Button({ className }: ButtonProps) {
  return (
    <button className={cn('rounded-md px-4 py-2 text-sm font-medium', className)}>
      Button
    </button>
  );
}
```

## 공용 컴포넌트와 Tailwind

반복되는 Tailwind 스타일은 공용 컴포넌트로 감쌉니다.

```text
src/common/components/ui/Button.tsx
src/common/components/ui/Input.tsx
src/common/components/feedback/EmptyState.tsx
```

예시:

```tsx
import { cn } from '@/common/utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        'bg-black text-white hover:bg-neutral-800',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
```

## 페이지 전용 스타일

페이지에서만 사용하는 스타일 조합은 해당 페이지의 `_components` 안에서 관리합니다.

```text
src/app/whiteboard/_components/ToolBar.tsx
src/app/whiteboard/_components/WhiteboardCanvas.tsx
```

페이지 전용 스타일을 `src/common`으로 성급하게 올리지 않습니다. 두 개 이상의 페이지에서 실제로 재사용될 때 공용 컴포넌트로 이동합니다.

## CSS Modules 사용 기준

Tailwind CSS를 기본으로 사용하되, 아래 경우에는 CSS Modules를 보조로 사용할 수 있습니다.

- 복잡한 keyframe animation
- 복잡한 selector 조합
- Tailwind className으로 표현하면 가독성이 크게 떨어지는 스타일
- 특정 컴포넌트에 완전히 닫힌 스타일이 필요한 경우

예시:

```text
src/app/whiteboard/_components/WhiteboardCanvas.module.css
src/app/whiteboard/_components/WhiteboardCanvas.tsx
```

CSS Modules는 예외적인 보조 수단이며, 기본 스타일링 방식은 Tailwind CSS입니다.

## shadcn/ui 사용 기준

shadcn/ui는 필수 스택이 아니라 추후 도입 가능한 UI 컴포넌트 소스입니다.

도입을 검토할 수 있는 경우:

- Dialog, Dropdown, Select, Toast 같은 접근성 있는 UI가 필요할 때
- Tailwind 기반 컴포넌트를 빠르게 구성하고 싶을 때
- 컴포넌트 코드를 프로젝트 안에서 직접 수정하며 관리하고 싶을 때

현재 기본 결정은 다음과 같습니다.

```text
Tailwind CSS는 확정
shadcn/ui는 필요 시 검토
```

## 권장 작성 순서

1. Tailwind className으로 먼저 구현합니다.
2. 동일한 스타일 패턴이 반복되면 공용 컴포넌트로 분리합니다.
3. 조건부 className이 복잡해지면 `cn()` 유틸을 사용합니다.
4. Tailwind로 표현하기 어려운 스타일만 CSS Modules로 분리합니다.
5. 접근성 있는 복합 UI가 필요하면 shadcn/ui 도입을 검토합니다.

## 요약

| 항목 | 결정 |
| --- | --- |
| 기본 스타일링 | Tailwind CSS |
| 전역 스타일 | `src/app/globals.css` 최소 사용 |
| 공용 스타일 조합 | 공용 컴포넌트로 분리 |
| className 병합 | `src/common/utils/cn.ts` |
| 보조 스타일링 | CSS Modules |
| UI 컴포넌트 소스 | shadcn/ui 추후 검토 |

# 환경 변수 관리 가이드

이 프로젝트는 개발기(`development`)와 운영기(`production`) 환경만 구분합니다. 프론트엔드 전용 Next.js 프로젝트이며, 현재는 `src/app/api/route.ts` 같은 Next 서버 API를 사용하지 않는 것을 기본 전제로 합니다.

## 기본 원칙

1. 필요한 환경 변수 목록은 `.env.example`에 문서화합니다.
2. 실제 값이 들어간 `.env` 파일은 커밋하지 않습니다.
3. 브라우저에서 사용하는 값은 반드시 `NEXT_PUBLIC_` prefix를 붙입니다.
4. `NEXT_PUBLIC_` 값은 클라이언트 번들에 포함되므로 비밀값을 넣지 않습니다.
5. 운영 값은 배포 환경에서 `next build` 전에 설정합니다.

## 파일 구성

```text
.env.example      # 커밋 O: 필요한 변수 목록과 예시 값
.env.local        # 커밋 X: 개인 로컬 개발 값
.env.development  # 커밋 X: 개발기 실제 값
.env.production   # 커밋 X: 운영기 실제 값
```

실제로 Git에 커밋하는 파일은 `.env.example`만 두는 것을 기본 원칙으로 합니다.

## 환경 구분

이 프로젝트는 환경을 두 가지만 구분합니다.

| 환경 | 설명 | 예시 |
| --- | --- | --- |
| 개발기 | 로컬 개발 또는 개발 서버 | `development` |
| 운영기 | 실제 사용자에게 배포되는 환경 | `production` |

환경 값은 아래처럼 명시합니다.

```env
NEXT_PUBLIC_APP_ENV=development
```

운영 배포에서는 다음처럼 설정합니다.

```env
NEXT_PUBLIC_APP_ENV=production
```

## `.env.example`

`.env.example`은 팀원이 어떤 환경 변수를 설정해야 하는지 확인하기 위한 문서 역할을 합니다. 실제 운영 URL, 개인 토큰, 비밀키는 넣지 않습니다.

```env
# Application
NEXT_PUBLIC_APP_ENV=development

# External API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 로컬 개발 설정

로컬 개발 시에는 `.env.example`을 복사해서 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

그리고 개인 개발 환경에 맞는 값을 입력합니다.

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

`.env.local`은 개인 로컬 값이므로 커밋하지 않습니다.

## 운영 배포 설정

운영 값은 `.env.production` 파일을 Git에 커밋해서 관리하지 않습니다. Vercel, GitHub Actions, 배포 서버 등 실제 배포 환경의 환경 변수 설정 기능을 사용합니다.

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

`NEXT_PUBLIC_` 환경 변수는 `next build` 시점에 클라이언트 번들에 포함됩니다. 따라서 운영 값은 반드시 빌드 전에 설정되어 있어야 합니다.

## `NEXT_PUBLIC_` 사용 기준

Next.js에서 브라우저 코드가 접근해야 하는 환경 변수는 `NEXT_PUBLIC_` prefix가 필요합니다.

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

클라이언트 코드에서는 다음처럼 사용할 수 있습니다.

```ts
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

단, `NEXT_PUBLIC_` 값은 브라우저에 노출됩니다. 따라서 다음 값들은 프론트엔드 환경 변수에 넣지 않습니다.

- DB 비밀번호
- 서버 전용 API secret
- 개인 access token
- private key
- 외부 서비스 secret key

## 로딩 우선순위

Next.js는 같은 이름의 환경 변수가 여러 곳에 있을 때 다음 순서로 값을 찾습니다.

```text
1. process.env
2. .env.$(NODE_ENV).local
3. .env.local
4. .env.$(NODE_ENV)
5. .env
```

위쪽에 있는 값이 더 높은 우선순위를 가집니다.

## 권장 규칙

1. 실제 값은 커밋하지 않습니다.
2. `.env.example`에는 변수 이름과 안전한 예시 값만 작성합니다.
3. 브라우저에서 필요한 값만 `NEXT_PUBLIC_`으로 선언합니다.
4. 비밀값은 프론트엔드 환경 변수에 두지 않습니다.
5. 개발기와 운영기 외의 환경은 현재 기본 구조에 포함하지 않습니다.
6. 운영 환경 변수는 배포 플랫폼에서 관리합니다.

## 요약

```text
커밋 O  : .env.example
커밋 X  : .env.local, .env.development, .env.production

개발기  : NEXT_PUBLIC_APP_ENV=development
운영기  : NEXT_PUBLIC_APP_ENV=production
```

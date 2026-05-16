# Git 컨벤션

이 문서는 프로젝트의 커밋 메시지, 브랜치 전략, PR, merge 방식을 통일하기 위한 규칙을 정의합니다.

기본 방향은 Git Flow를 가볍게 적용하되, 이 프로젝트에서는 `feature/*` 브랜치를 `develop`에 병합할 때 **Squash Merge**를 사용합니다.

## Commit Convention

커밋 메시지는 다음 형식을 사용합니다.

```text
type: 변경 내용 요약
```

예시:

```text
feat: 로그인 페이지 추가
fix: 모바일 헤더 레이아웃 깨짐 수정
docs: Git 컨벤션 문서 추가
refactor: 버튼 컴포넌트 구조 정리
chore: 패키지 의존성 업데이트
```

### Commit Type

| Type | 의미 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | 코드 포맷 변경, 간단한 수정, 코드 동작 변경이 없는 경우 |
| `refactor` | 코드 리팩토링 |
| `docs` | 문서 수정 |
| `chore` | 빌드, 패키지 매니저, 설정 변경 |
| `rename` | 파일 또는 폴더명 수정/이동만 수행 |
| `remove` | 파일 삭제만 수행 |
| `test` | 테스트 코드 추가/수정 |

`test`는 참고한 Git 문서에는 없지만, 이 프로젝트는 Vitest/Playwright 테스트를 사용하므로 테스트 변경을 명확히 구분하기 위해 추가합니다.

## Branch Convention

이 프로젝트는 다음 브랜치를 기본으로 사용합니다.

| Branch | 역할 |
| --- | --- |
| `main` | 배포 가능한 안정 상태 |
| `develop` | 기능이 통합되는 개발 브랜치 |
| `feature/*` | 개별 기능 개발 브랜치 |

## Branch Naming

브랜치명은 소문자를 사용하고, 여러 단어는 `kebab-case`로 작성합니다.

```text
feature/기능이름
```

예시:

```text
feature/login
feature/signup
feature/whiteboard-create
feature/project-docs
```

필요 시 아래 prefix를 사용할 수 있습니다.

| Prefix | 용도 | 예시 |
| --- | --- | --- |
| `feature/*` | 기능 개발 | `feature/whiteboard-create` |
| `fix/*` | 버그 수정 | `fix/login-validation` |
| `docs/*` | 문서 작업 | `docs/git-convention` |
| `chore/*` | 설정/패키지 작업 | `chore/setup-biome` |
| `test/*` | 테스트 작업 | `test/add-playwright` |

## Workflow

기본 작업 흐름은 다음과 같습니다.

1. `develop`에서 작업 브랜치를 생성합니다.
2. 작업 브랜치에서 기능 개발 또는 수정 작업을 진행합니다.
3. 작업 단위에 맞춰 커밋합니다.
4. 작업이 완료되면 `develop`으로 PR을 생성합니다.
5. 리뷰 후 `develop`에 **Squash Merge**합니다.
6. 병합이 완료된 작업 브랜치는 삭제합니다.
7. 배포 준비가 완료되면 `develop`을 `main`에 병합합니다.

## Merge Rule

### feature → develop

`feature/*` 브랜치는 `develop`에 **Squash Merge**합니다.

```text
feature/* → develop: Squash Merge
```

이유:

- feature 브랜치의 자잘한 커밋을 `develop` 히스토리에 그대로 남기지 않습니다.
- 하나의 기능 또는 작업 단위를 하나의 커밋으로 정리합니다.
- `develop` 브랜치 히스토리를 읽기 쉽게 유지합니다.

Squash Merge 커밋 메시지는 PR 제목을 기준으로 정리합니다.

예시:

```text
feat: 화이트보드 생성 플로우 추가
docs: 테스트 전략 가이드 추가
chore: biome 설정 추가
```

### develop → main

`develop`에서 `main`으로 병합할 때는 merge commit 방식을 사용합니다.

```text
develop → main: Merge Commit
```

이유:

- 어떤 시점의 `develop`이 `main`에 배포되었는지 추적하기 쉽습니다.
- 배포 이슈가 발생했을 때 병합 시점을 기준으로 히스토리를 확인하기 쉽습니다.

## Pull Request Rule

PR은 작업 내용을 리뷰하고 `develop`에 병합하기 위한 단위입니다.

### PR 제목

PR 제목은 squash merge 커밋 메시지가 될 수 있으므로 커밋 메시지 규칙과 동일하게 작성합니다.

```text
feat: 로그인 페이지 추가
fix: 로그인 검증 에러 처리
docs: Git 컨벤션 문서 추가
```

### PR 본문

PR 본문에는 최소한 다음 내용을 작성합니다.

```md
## Summary
- 변경 사항 요약

## Test
- 확인한 테스트 또는 실행 명령

## Note
- 리뷰어가 알아야 할 내용
```

## Review Comment Rule

코드 리뷰 코멘트는 Pn 룰을 사용합니다.

| Priority | 의미 |
| --- | --- |
| `P1` | 꼭 반영해주세요 |
| `P2` | 적극적으로 고려해주세요 |
| `P3` | 웬만하면 반영해주세요 |
| `P4` | 반영해도 좋고 넘어가도 좋습니다 |
| `P5` | 사소한 의견입니다 |

예시:

```md
P1: 이 로직은 런타임 에러가 발생할 수 있어 수정이 필요합니다.
P3: 변수명을 조금 더 명확하게 바꾸면 좋겠습니다.
P5: 개인적으로는 이 줄바꿈이 더 읽기 좋아 보입니다.
```

## 운영 규칙

1. `main`에는 직접 커밋하지 않습니다.
2. 기능 작업은 `feature/*` 브랜치에서 진행합니다.
3. `feature/*` 브랜치는 `develop`에서 생성합니다.
4. `feature/*` 브랜치는 `develop`에 Squash Merge합니다.
5. 병합 완료 후 사용한 작업 브랜치는 삭제합니다.
6. PR 제목은 squash merge 후 남을 커밋 메시지처럼 작성합니다.
7. 커밋은 작업 의도가 드러나도록 작성합니다.

## 요약

```text
main       : 배포 가능한 안정 브랜치
develop    : 개발 통합 브랜치
feature/*  : 기능 개발 브랜치

feature/* → develop : Squash Merge
develop → main      : Merge Commit

commit format: type: 변경 내용 요약
review comment: P1 ~ P5
```

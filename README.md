## Recipot Monorepo

### 개발 실행

- 웹(Next.js):

  - 개발 서버: `pnpm web dev` (http://localhost:3000)
  - 빌드/실행: `pnpm web build` / `pnpm web start`

- 모바일(Expo):

  - 개발 서버: `pnpm mobile dev`
  - 네이티브 빌드: `pnpm mobile ios` / `pnpm mobile android`

- 전체(모노레포):

  - 병렬 개발: `pnpm dev`
  - 전체 빌드/실행: `pnpm build` / `pnpm start`
  - 린트/타입체크: `pnpm lint` / `pnpm typecheck`

### 폴더 구조

- `apps/web`: Next.js 앱(앱 라우터 `src/app`).
- `apps/mobile`: Expo 앱(`expo-router`).
- `packages/config`: ESLint/TS/PostCSS 등 공통 설정.
- `packages/ui`, `packages/lib`, `packages/types`: 공용 UI/유틸/타입.

### 브랜치 전략

- 메인 도메인 브랜치: `feat/<도메인>`

  - 예) `feat/auth`, `feat/recipe`

- 서브 작업 브랜치: `feat/<도메인>/<작업>`

  - 예) `feat/auth/login`, `feat/recipe/detail-page`

- PR 플로우 예시

  - 작업 PR: `feat/<도메인>/<작업>` → `feat/<도메인>`
    - 예) `feat/auth/login` → `feat/auth`
  - 도메인 통합 PR: `feat/<도메인>` → dev

- 권장 규칙

  - 한 PR은 한 작업 단위로 작게 유지(리뷰 용이)
  - PR 제목: `[<앱>] <도메인>: <작업>` (예: `[web] auth: 로그인 페이지 마크업`)
  - PR 설명: 변경 요약, 스크린샷/동작 GIF, 테스트 노트

### 기타

- 패키지 매니저: `pnpm@8.15.4` (corepack 사용)
- Turborepo 파이프라인: `turbo.json` 참고
- 경로 별칭: 루트 `tsconfig.json`의 `paths` 참고

# 📦 shared

앱 전반에서 **재사용 가능한 공통 모듈**을 저장하는 계층입니다.  
비즈니스 로직과 관계 없는 범용 요소들을 위치시킵니다.

## 🔖 구조 가이드

```
shared/
  ├── ui/          # Button, Modal 등 공통 컴포넌트
  ├── lib/         # formatter, fetcher 등 범용 유틸
  ├── hooks/       # useDebounce, useIntersectionObserver 등
  ├── model/       # 글로벌 상태 또는 공유 context
  ├── config/      # 환경변수, 라우팅 상수 등
```

## ✅ 포함될 내용
- 범용 컴포넌트 (Button, Input 등)
- 공통 유틸 함수
- 글로벌 상태 (예: ThemeStore)
- 상수, env 설정 등

## 📌 예시
- `fetcher.ts`, `Button.tsx`, `constants.ts`, `useMediaQuery.ts`
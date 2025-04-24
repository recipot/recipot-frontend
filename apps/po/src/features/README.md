# 🧪 features

작은 단위의 **기능 단위 컴포넌트** 계층입니다.  
하나의 도메인 또는 유즈케이스를 구현하며, 독립적이거나 재사용 가능한 단위로 나눕니다.

## 🔖 구조 가이드

```
features/
└── auth/
    └── login-form/
          ├── ui/        # 시각 요소
          ├── model/     # 상태, hook
          └── lib/       # 유틸, 밸리데이션
```

## ✅ 포함될 내용
- 작고 단일한 목적의 기능 (토글, 폼, 모달 등)
- UI, 상태 로직, 유틸을 모듈화하여 self-contained 구성
- `features`는 다른 계층의 종속성이 없어야 이상적

## 📌 예시
- `login-form`, `favorite-toggle`, `comment-editor`, `search-bar` 등
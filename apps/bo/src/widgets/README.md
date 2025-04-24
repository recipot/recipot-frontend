# 🧱 widgets

여러 `features`, `entities`를 조합하여 구성된 **UI 블록 단위**입니다.  
각 `page.tsx`에서 사용되는 주요 인터페이스 단위를 만듭니다.

## 🔖 구조 가이드

```
widgets/
└── user-profile/
        ├── ui/        # 전체 조합된 뷰
        └── model/     # 조합 단위 상태
```

## ✅ 포함될 내용
- 하나 이상의 `features`, `entities`를 조합
- UI 중심적 단위 → 페이지에서 직접 사용
- 페이지 진입점(`app/page.tsx`)에서 주요 구성요소로 배치

## 📌 예시
- `user-profile`, `product-list-with-filter`, `checkout-summary` 등
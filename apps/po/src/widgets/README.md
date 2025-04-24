# 🧩 entities

도메인의 **핵심 객체(엔티티)**와 그에 따른 상태, API, UI 등을 관리하는 계층입니다.  
`features`는 `entities`를 기반으로 동작합니다.

## 🔖 구조 가이드

```
entities/
  └── user/
      ├── api/           # 유저 관련 API 호출
      ├── model/         # Zustand, react-query, types 등 상태 정의
      ├── ui/            # Avatar, Badge 등 도메인 전용 UI
```

## ✅ 포함될 내용
- 실제 서비스 도메인에 가까운 객체
- 해당 객체의 API fetcher, 타입, 상태 로직
- 엔티티에 종속된 단위 UI (재사용보단 목적 특화)

## 📌 예시
- `user`, `product`, `order`, `post`, `review` 등
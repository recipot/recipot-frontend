# Development Guide

## 🚀 Quick Start

### 개발 명령어
```bash
pnpm web dev      # 웹 개발 서버
pnpm mobile dev   # 모바일 개발 서버
pnpm lint         # 코드 검사
pnpm typecheck    # 타입 검사
pnpm test         # 테스트 실행
pnpm build        # 빌드
```

### 브랜치 전략
```
feat/<domain>/<task>  # 예: feat/auth/kakao-login
↓
PR: task → domain → dev → main
```

---

## 👥 팀 도메인 분할

### 👤 개발자 A: 인증 & 설문
- **카카오/구글 소셜 로그인**
- **로그아웃**
- **못먹는 음식 선택**
- **상태 + 재료 입력** (개발자 B 컴포넌트 재사용)
- **온보딩 플로우**

### 🏠 개발자 B: 메인 & 재료입력
- **메인** (레시피 추천 카드)
- **상태 + 재료 입력** 통합 페이지
- **재료 검색/자동완성**

### 👨‍🍳 개발자 C: 레시피 & 요리
- **레시피 상세 페이지**
- **리뷰 시스템**
- **요리 과정 가이드**
- **후기 리마인드 모달**

### ⚙️ 개발자 D: 마이페이지 & UI
- **마이페이지 전체**
- **즐겨찾기, 최근 본 레시피, 내가 만든 요리**
- **못먹는음식 관리, FAQ, 앱피드백, 이용약관**
- **모든 공통 UI 컴포넌트**

---

## 📂 폴더 구조 규칙

### 페이지별 컴포넌트 (`_components`)
```
app/recipes/
├── page.tsx
└── _components/          # 이 페이지에서만 사용
    ├── RecipeList/
    ├── RecipeFilter/
    └── RecipeSearch/
```

### 전역 컴포넌트 (`components/common`)
```
components/
├── ui/                   # shadcn 원본 (수정금지)
└── common/              # 래핑된 공통 컴포넌트
    ├── Button/
    ├── Modal/
    └── Card/
```

### 언제 어디에 놓을까?
- **한 페이지에서만 사용** → `_components`
- **여러 페이지에서 재사용** → `components/common`

---

## 🏗️ 개발 패턴

### Container-Presenter 패턴
**언제 사용?** 서버 데이터 + 복잡한 로직이 있을 때

```typescript
// RecipeCardContainer.tsx - 로직
export function RecipeCardContainer({ recipeId }: Props) {
  const { data: recipe, isLoading } = useRecipeQuery(recipeId);
  const handleLike = () => likeRecipe(recipeId);
  
  return <RecipeCardPresenter recipe={recipe} onLike={handleLike} />;
}

// RecipeCardPresenter.tsx - UI만
export function RecipeCardPresenter({ recipe, onLike }: Props) {
  return (
    <Card>
      <h3>{recipe.title}</h3>
      <Button onClick={onLike}>좋아요</Button>
    </Card>
  );
}
```

### Custom Hook 패턴
**언제 사용?** 여러 컴포넌트에서 같은 로직을 쓸 때

```typescript
function useRecipeCard(recipeId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const { data: recipe } = useRecipeQuery(recipeId);
  
  const handleLike = () => {
    setIsLiked(prev => !prev);
    // API 호출
  };
  
  return { recipe, isLiked, handleLike };
}
```

---

## 🔧 상태 관리 가이드

### 어떤 상태 관리를 쓸까?

#### 컴포넌트 내부 (useState)
- 폼 입력값
- 모달 열림/닫힘
- 로딩 상태

#### 전역 상태 (Zustand)
- 사용자 정보
- 테마 설정
- 장바구니

#### 서버 상태 (TanStack Query)
- API 데이터
- 캐싱이 필요한 데이터

```typescript
// 전역 상태 예시
export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// 서버 상태 예시
function useRecipeQuery(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeApi.getRecipe(id),
  });
}
```

---

## 👥 도메인 간 협업

### UI 컴포넌트 요청 (→ 개발자 D)
1. **GitHub Issue 생성** (라벨: `ui-component`)
2. **Discord #ui-components** 채널에 알림
3. **필요한 정보**:
   - 컴포넌트명
   - 사용 목적
   - 필요한 props
   - 우선순위

### 다른 도메인 API/상태 사용
```typescript
// C가 D의 즐겨찾기 상태 사용
import { useProfileStore } from '@/stores/profileStore'; // D 담당

function RecipeDetail() {
  const { favorites, addFavorite } = useProfileStore(); // D의 상태 사용
  // ...
}
```

---

## ⚡ 성능 & 품질 체크

### 성능 최적화
- [ ] **React.memo()** 적절히 사용
- [ ] **큰 리스트엔 가상화** 적용
- [ ] **이미지 최적화** (next/image)
- [ ] **코드 분할** (lazy loading)

### 코드 냄새 감지
🚨 **즉시 리팩토링**:
- 파일 200줄 초과
- 함수 50줄 초과
- if-else 4단계 이상 중첩

⚠️ **주의 깊게 관찰**:
- 파일 100줄 초과
- useState 5개 이상
- Props 8개 이상

### 핵심 원칙
1. **하나의 컴포넌트 = 하나의 역할**
2. **같은 코드 3번 반복 = 함수로 분리**
3. **복잡하게 말고 단순하게**
4. **조기 반환으로 중첩 줄이기**

```typescript
// ❌ 나쁜 예
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doSomething();
      }
    }
  }
}

// ✅ 좋은 예  
function processUser(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  
  return doSomething();
}
```

---

## 📋 PR 체크리스트

### 필수 체크
- [ ] ESLint 통과
- [ ] TypeScript 에러 없음
- [ ] 테스트 작성/업데이트
- [ ] 관련 도메인 담당자 리뷰

### 도메인 체크
- [ ] 내 도메인: A(인증&설문) / B(메인&재료) / C(레시피&요리) / D(마이페이지&UI)
- [ ] 다른 도메인 API/상태 사용 여부
- [ ] 공통 컴포넌트 수정 여부

### 성능 체크
- [ ] 불필요한 리렌더링 없음
- [ ] 번들 사이즈 체크
- [ ] 모바일 반응형 확인

---

## 🎯 실천 방법

### 단계별 적용
**1주차**: 조기 반환, 명확한 함수명
**2주차**: Container-Presenter 패턴
**3주차**: Custom Hook 분리
**4주차**: 성능 최적화

### 팀 협업
- **매주 금요일**: 좋은 코드 공유
- **월 1회**: 새로운 패턴 학습
- **PR 리뷰**: 24시간 내 완료

---

## 📚 참고 링크

- [Container-Presenter Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
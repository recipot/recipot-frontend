# Icons 컴포넌트

이 폴더에는 SVG 아이콘들을 React 컴포넌트로 변환한 파일들이 포함되어 있습니다.

## 사용법

### 기본 사용법

```tsx
import { CheckIcon, AddIcon, SearchIcon } from '@/components/Icons';

function MyComponent() {
  return (
    <div>
      <CheckIcon size={24} color="#68982D" />
      <AddIcon size={18} color="#868E96" />
      <SearchIcon size={32} color="#333" />
    </div>
  );
}
```

### Props

모든 아이콘 컴포넌트는 다음 props를 지원합니다:

- `size`: 아이콘의 크기 (기본값: 원본 SVG 크기)
- `color`: 아이콘의 색상 (기본값: 원본 색상)
- 기타 모든 SVG 속성들 (`className`, `onClick`, `style` 등)

### 아이콘 목록

#### 기본 아이콘들

- `CheckIcon` - 체크 표시 (14x14)
- `AddIcon` - 더하기 표시 (18x18)
- `ArrowIcon` - 화살표 (18x18)
- `SearchIcon` - 검색 (24x24)
- `CloseIcon` - 닫기 (24x24)

#### 감정 아이콘들

- `EmotionGoodIcon` - 좋은 감정 (24x24)
- `EmotionBadIcon` - 나쁜 감정 (24x24)
- `EmotionNeutralIcon` - 중립 감정 (24x24)

#### 기능 아이콘들

- `CookIcon` - 요리 (24x24)
- `SourceIcon` - 소스 (24x24)
- `MyFileIcon` - 내 파일 (18x18)
- `MyOpenFileIcon` - 열린 파일 (18x18)
- `SettingsIcon` - 설정 (18x18)

#### 단계 아이콘들

- `IngredientIcon` - 1단계 (24x24)
- `CookwareIcon` - 2단계 (24x24)
- `CookOrderIcon` - 3단계 (24x24)
- `ReviewIcon` - 4단계 (24x24)

#### 카드 아이콘들

- `CardTimeIcon` - 시간 (22x22)

#### 네비게이션 아이콘들

- `UserIcon` - 내 정보 (24x24)
- `RefreshIcon` - 새로고침 (24x24)
- `ShareIcon` - 공유 (24x24)

#### 소셜 로그인 아이콘들

- `GoogleIcon` - 구글 (24x24)
- `KakaoIcon` - 카카오 (24x24)

#### 찜 아이콘

- `HeartIcon` - 찜하기 (24x24)

## 커스터마이징

### 색상 변경

```tsx
<CheckIcon color="#FF0000" /> // 빨간색으로 변경
<AddIcon color="currentColor" /> // 현재 텍스트 색상 사용
```

### 크기 변경

```tsx
<SearchIcon size={48} /> // 48x48 크기로 변경
<CloseIcon size={16} /> // 16x16 크기로 변경
```

### 스타일 추가

```tsx
<CheckIcon className="my-custom-class" style={{ marginRight: '8px' }} onClick={() => console.log('clicked')} />
```

## 주의사항

- 모든 아이콘은 `viewBox`를 유지하여 비율이 깨지지 않습니다
- `size` prop은 width와 height를 동시에 설정합니다
- 원본 SVG의 색상이 `fill` 속성으로 설정된 경우 `color` prop으로 변경 가능합니다
- 원본 SVG의 색상이 `stroke` 속성으로 설정된 경우 `color` prop으로 변경 가능합니다

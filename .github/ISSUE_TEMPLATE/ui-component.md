---
name: UI 컴포넌트 요청
about: 공통 UI 컴포넌트 개발 요청 
title: '[UI] 컴포넌트명'
labels: ['ui-component']
assignees: '' # D 담당자 GitHub ID
---

## 📋 컴포넌트 정보

### 컴포넌트명
<!-- 예: RecipeCard, LoadingSpinner, Modal -->

### 사용 목적
<!-- 어떤 페이지/화면에서 어떤 용도로 사용할지 -->

### 요청자 도메인
- [ ] 인증 & 설문
- [ ] 메인 & 재료입력  
- [ ] 레시피 & 요리
- [ ] 마이페이지 & UI

## 🎨 디자인 요구사항

### 디자인 링크
- Figma: 
- 참고 이미지: 

### 상태별 디자인
- [ ] 기본 상태
- [ ] 호버 상태
- [ ] 클릭 상태  
- [ ] 비활성 상태
- [ ] 로딩 상태
- [ ] 에러 상태

## 🔧 기술 요구사항

### 필요한 Props
```typescript
interface ComponentProps {
  // 예시
  title: string;
  onClick: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}
```

### 이벤트 핸들러
- [ ] onClick
- [ ] onSubmit  
- [ ] onChange
- [ ] 기타: 

### 특별한 기능
- [ ] 애니메이션 효과
- [ ] 키보드 탐색 지원
- [ ] 드래그 앤 드롭
- [ ] 가상화 (큰 리스트)
- [ ] 기타: 

## ♿ 접근성 요구사항

- [ ] 스크린 리더 지원 (ARIA 속성)
- [ ] 키보드 탐색 가능
- [ ] 색상 대비 충족 (WCAG 2.1 AA)
- [ ] 포커스 표시 명확
- [ ] 기타: 

## 🎯 완료 기준

### 구현 완료
- [ ] 기본 컴포넌트 구현
- [ ] 모든 props와 이벤트 핸들러 구현
- [ ] 모든 상태(기본/호버/클릭 등) 구현
- [ ] 반응형 디자인 구현

### 문서화
- [ ] Storybook 스토리 작성
- [ ] Props 타입 정의 문서화
- [ ] 사용 예시 코드 작성

### 품질 검증  
- [ ] 디자인 QA 통과
- [ ] 접근성 검증 완료
- [ ] 성능 테스트 (필요시)
- [ ] 요청자 테스트 완료

## ⏰ 일정

### 우선순위
- [ ] 🔴 High (1-2일 내)
- [ ] 🟡 Medium (1주 내)  
- [ ] 🟢 Low (2주 내)

### 완료 희망일
YYYY-MM-DD

## 📋 사용 예시

```typescript
// 이런 식으로 사용하고 싶어요
<ComponentName 
  title="제목"
  onClick={handleClick}
  variant="primary"
/>
```

## 💬 추가 논의사항

<!-- 특별히 논의하고 싶은 내용 -->
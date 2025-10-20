// Compound Components
import AllergyContent from './compound/Content';
import AllergyErrorState from './compound/ErrorState';
import AllergyLoadingState from './compound/LoadingState';
import AllergyNavigation from './compound/Navigation';
import AllergyResetButton from './compound/ResetButton';
import AllergyRoot from './compound/Root';
import AllergySubmitButton from './compound/SubmitButton';

// Hooks
export { default as useAllergyCheck } from './hooks/useAllergyCheck';
export { default as useAllergyData } from './hooks/useAllergyData';

// Context
export { useAllergyContext } from './context/AllergyContext';

// Compound Component 구조
export const Allergy = Object.assign(AllergyRoot, {
  Content: AllergyContent,
  ErrorState: AllergyErrorState,
  LoadingState: AllergyLoadingState,
  Navigation: AllergyNavigation,
  ResetButton: AllergyResetButton,
  Root: AllergyRoot,
  SubmitButton: AllergySubmitButton,
});

// 기본 export (Root 컴포넌트)
export default Allergy;

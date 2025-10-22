// Auth API
export { authService } from './auth';

// Allergy API
export { allergy } from './allergy';

// Food API
export { food } from './food';
export type {
  SubmitSelectedFoodsRequest,
  SubmitSelectedFoodsResponse,
} from './food';

// Onboarding API
export { onboarding } from './onboarding';
export type { OnboardingCompleteResponse } from './onboarding';

// Condition API
export { condition } from './condition';
export type {
  SaveDailyConditionRequest,
  SaveDailyConditionResponse,
} from './condition';

// API Instance Creator
export { createApiInstance } from './createApiInstance';
export type { CreateApiInstanceOptions } from './createApiInstance';

// Types
export type {
  Food,
  FoodListApiResponse,
  CompleteOnboardingData,
} from './types';

// Auth API
export { authService } from './auth';

// Allergy API
export {
  fetchRestrictedIngredients,
  updateRestrictedIngredients,
} from './allergyAPI';

// Food API
export { foodAPI } from './foodAPI';
export type {
  SubmitSelectedFoodsRequest,
  SubmitSelectedFoodsResponse,
} from './foodAPI';

// Onboarding API
export { onboardingAPI } from './onboardingAPI';
export type { OnboardingCompleteResponse } from './onboardingAPI';

// API Instance Creator
export { createApiInstance } from './createApiInstance';
export type { CreateApiInstanceOptions } from './createApiInstance';

// Types
export type {
  Food,
  FoodListApiResponse,
  CompleteOnboardingData,
} from './types';

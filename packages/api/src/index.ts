// Auth API
export { authService, tokenUtils } from './auth.api';

// Allergy API
export { allergy } from './allergy.api';

// Food API
export { food } from './food.api';
export type {
  SubmitSelectedFoodsRequest,
  SubmitSelectedFoodsResponse,
} from './food.api';

// Onboarding API
export { onboarding } from './onboarding.api';

// Condition API
export { condition } from './condition.api';
export type {
  SaveDailyConditionRequest,
  SaveDailyConditionResponse,
} from './condition.api';

// API Instance Creator
export { createApiInstance, setApiErrorHandler } from './createApiInstance';
export type { CreateApiInstanceOptions } from './createApiInstance';

// Debug API
export { debugAuth } from './debug';

export { recipe } from './recipe.api';

// Types
export type {
  Food,
  FoodListApiResponse,
  CompleteOnboardingData,
  ReviewData,
  ReviewOption,
  ReviewSubmitData,
} from './types';

// Health Survey API
export {
  healthSurvey,
  type HealthSurveyEligibilityResponse,
  type HealthSurveyPreparationResponse,
  type HealthSurveyPreparationOption,
  type HealthSurveyRequest,
  type HealthSurveySubmitResponse,
} from './healthSurvey.api';

// Mypage API
export type {
  CompletedRecipe,
  CompletedRecipesResponse,
  GetCompletedRecipesParams,
} from './mypage.api';
export { recipesAPI, storedAPI, recentAPI } from './mypage.api';

// Review Reminder API
export {
  reviewReminder,
  type PendingReviewsResponse,
  type PendingReviewItem,
} from './review.api';

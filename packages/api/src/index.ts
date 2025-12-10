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

// Condition API
export { condition } from './condition';
export type {
  SaveDailyConditionRequest,
  SaveDailyConditionResponse,
} from './condition';

// API Instance Creator
export { createApiInstance, setApiErrorHandler } from './createApiInstance';
export type { CreateApiInstanceOptions } from './createApiInstance';

// Debug API
export { debugAuth } from './debug';

export { recipe } from './recipeAPI';

// Types
export type {
  AdminRecipe,
  AdminRecipesResponse,
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
} from './healthSurvey';

// Mypage API
export type {
  CompletedRecipe,
  CompletedRecipesResponse,
  GetCompletedRecipesParams,
} from './mypageAPI';
export { recipesAPI, storedAPI, recentAPI } from './mypageAPI';

// Review Reminder API
export {
  reviewReminder,
  type PendingReviewsResponse,
  type PendingReviewItem,
} from './review';

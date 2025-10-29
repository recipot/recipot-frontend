/**
 * API 관련 공통 타입 정의
 */

// Food API Types
export interface Food {
  categoryId: number;
  categoryName: string;
  id: number;
  isUserRestricted: boolean;
  name: string;
}

export interface FoodListApiResponse {
  data: {
    data: Food[];
  };
  status: number;
}

// Onboarding API Types
export interface CompleteOnboardingData {
  allergies: number[];
  mood: string;
  selectedFoods: number[];
  sessionId?: string; // Optional: not currently used
}

import { allergy } from './allergy';
import { createApiInstance } from './createApiInstance';
import { guestSessionUtils } from './guestSession';
import type { CompleteOnboardingData } from './types';

const onboardingApi = createApiInstance({ apiName: 'Onboarding' });

const isProduction = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
  return env !== 'development' && env !== 'local';
};

const isGuestUser = (): boolean => !!guestSessionUtils.getSessionId();

export const onboarding = {
  async submitComplete(data: CompleteOnboardingData): Promise<void> {
    const apiCalls: Promise<unknown>[] = [];

    // 게스트 사용자는 /v1/users/onboarding/complete 호출 스킵
    // 로그인 후 게스트 데이터 마이그레이션 시 처리됨
    if (isProduction() && !isGuestUser()) {
      apiCalls.push(onboardingApi.post('/v1/users/onboarding/complete'));
    }

    // 게스트 사용자는 /v1/users/ingredients/unavailable 호출 스킵
    if (data.allergies?.length > 0 && !isGuestUser()) {
      apiCalls.push(allergy.updateRestrictedIngredients(data.allergies));
    }

    if (apiCalls.length > 0) {
      await Promise.all(apiCalls);
    }
  },

  validateOnboardingData(data: CompleteOnboardingData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!Array.isArray(data.allergies)) {
      errors.push('알레르기 데이터는 배열이어야 합니다');
    }

    if (!data.mood || !['bad', 'neutral', 'good'].includes(data.mood)) {
      errors.push('Invalid mood state');
    }

    if (!Array.isArray(data.selectedFoods) || data.selectedFoods.length < 2) {
      errors.push('At least 2 ingredients required');
    }

    // sessionId는 현재 사용하지 않으므로 검증 제외

    return {
      errors,
      isValid: errors.length === 0,
    };
  },
};

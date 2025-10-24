import { allergy } from './allergy';
import { createApiInstance } from './createApiInstance';
import type { CompleteOnboardingData } from './types';

const onboardingApi = createApiInstance({ apiName: 'Onboarding' });

const isProduction = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
  return env !== 'development' && env !== 'local';
};

export const onboarding = {
  async submitComplete(data: CompleteOnboardingData): Promise<void> {
    const apiCalls: Promise<unknown>[] = [];

    if (isProduction()) {
      apiCalls.push(onboardingApi.post('/v1/users/onboarding/complete'));
    }

    if (data.allergies?.length > 0) {
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
      errors.push('Invalid allergy data');
    }

    if (!data.mood || !['bad', 'neutral', 'good'].includes(data.mood)) {
      errors.push('Invalid mood state');
    }

    if (!Array.isArray(data.selectedFoods) || data.selectedFoods.length < 2) {
      errors.push('At least 2 ingredients required');
    }

    if (!data.sessionId || typeof data.sessionId !== 'string') {
      errors.push('Invalid session information');
    }

    return {
      errors,
      isValid: errors.length === 0,
    };
  },
};

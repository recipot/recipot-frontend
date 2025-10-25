import axios from 'axios';

import { allergy } from './allergy';
import { createApiInstance } from './createApiInstance';
import type { CompleteOnboardingData } from './types';

// API 인스턴스
const onboardingApi = createApiInstance({ apiName: 'Onboarding' });

/**
 * 온보딩 관련 API
 */
export const onboarding = {
  /**
   * 통합 온보딩 완료 처리
   * 1. 못먹는 음식 저장 (allergies)
   * 2. 온보딩 완료 플래그 업데이트
   * 3. (추후) 레시피 추천 API 호출
   *
   * 참고: 컨디션 저장은 RefrigeratorStep에서 별도로 처리됨
   */
  submitComplete: async (data: CompleteOnboardingData): Promise<void> => {
    try {
      const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
      const apiCalls: Promise<unknown>[] = [];

      // 1. 온보딩 완료 플래그 업데이트 (development에서는 건너뛰기)
      if (APP_ENV !== 'development' && APP_ENV !== 'local') {
        apiCalls.push(onboardingApi.post('/v1/users/onboarding/complete'));
      } else {
        console.info('⏭️ [development, local] 온보딩 완료 플래그 API 건너뛰기');
      }

      // 2. 못먹는 음식 저장 (모든 환경에서 호출)
      if (data.allergies && data.allergies.length > 0) {
        apiCalls.push(allergy.updateRestrictedIngredients(data.allergies));
      }

      // 병렬 실행
      if (apiCalls.length > 0) {
        await Promise.all(apiCalls);
      }

      // TODO: 레시피 추천 API 호출 (아직 개발 전)
      // 온보딩에서 수집한 데이터를 기반으로 첫 레시피 추천 생성
      // await recipeApi.post('/v1/recipes/recommend/initial', {
      //   allergies: data.allergies,
      //   mood: data.mood,
      //   selectedFoods: data.selectedFoods,
      // });
    } catch (error) {
      throw new Error('온보딩 완료 처리 실패');
    }
  },

  /**
   * 온보딩 데이터 유효성 검증
   */
  validateOnboardingData: (
    data: CompleteOnboardingData
  ): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    // 알레르기 데이터 검증
    if (!Array.isArray(data.allergies)) {
      errors.push('알레르기 정보가 올바르지 않습니다.');
    } else if (data.allergies.length === 0) {
      // 알레르기가 없는 경우도 허용 (빈 배열)
      console.info('ℹ️ 알레르기 정보가 없습니다. (정상)');
    }

    // 기분 상태 검증
    if (!data.mood || !['bad', 'neutral', 'good'].includes(data.mood)) {
      errors.push('기분 상태가 올바르지 않습니다.');
    }

    // 선택된 재료 검증
    if (!Array.isArray(data.selectedFoods)) {
      errors.push('선택된 재료 정보가 올바르지 않습니다.');
    } else if (data.selectedFoods.length < 2) {
      errors.push('최소 2개 이상의 재료를 선택해야 합니다.');
    }

    // 세션 ID 검증
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      errors.push('세션 정보가 올바르지 않습니다.');
    }

    return {
      errors,
      isValid: errors.length === 0,
    };
  },
};

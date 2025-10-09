import axios from 'axios';

import type { CompleteOnboardingData } from '@/app/onboarding/_utils/onboardingStorage';

interface ApiRequest {
  call: Promise<unknown>;
  name: string;
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
  data?: {
    userId?: string;
    preferences?: {
      allergies: number[];
      mood: string;
      selectedFoods: number[];
    };
  };
}

/**
 * 온보딩 관련 API 함수들
 */
export const onboardingAPI = {
  /**
   * 통합 온보딩 완료 처리
   * 기존 개별 API들을 순차적으로 호출하여 모든 데이터를 전송
   */
  submitComplete: async (
    data: CompleteOnboardingData
  ): Promise<OnboardingCompleteResponse> => {
    try {
      console.info('🚀 통합 온보딩 데이터 전송 시작:', data);

      // API 이름 상수 정의
      const API_NAMES = {
        ALLERGY: '알레르기 정보',
        MOOD: '기분 상태',
        SELECTED_FOODS: '선택된 재료',
      } as const;

      // API 호출과 이름을 객체로 묶어서 관리
      const apiRequests: ApiRequest[] = [
        {
          call: axios.post('/api/allergy', {
            categories: data.allergies,
          }),
          name: API_NAMES.ALLERGY,
        },
        {
          call: axios.post('/api/user/mood', {
            mood: data.mood,
          }),
          name: API_NAMES.MOOD,
        },
        {
          call: axios.post('/api/user/selected-foods', {
            selectedFoodIds: data.selectedFoods,
          }),
          name: API_NAMES.SELECTED_FOODS,
        },
      ];

      // 모든 API 호출을 병렬로 실행
      const results = await Promise.allSettled(
        apiRequests.map(request => request.call)
      );

      // 결과 분석
      const failures: string[] = [];
      const successes: string[] = [];

      // 결과와 API 이름을 안전하게 매핑
      const resultPairs = results.map((result, index) => {
        let name: string;
        switch (index) {
          case 0:
            name = API_NAMES.ALLERGY;
            break;
          case 1:
            name = API_NAMES.MOOD;
            break;
          case 2:
            name = API_NAMES.SELECTED_FOODS;
            break;
          default:
            name = `API ${index + 1}`;
        }
        return { name, result };
      });

      resultPairs.forEach(({ name, result }) => {
        if (result.status === 'rejected') {
          failures.push(name);
          console.error(`❌ ${name} 전송 실패:`, result.reason);
        } else {
          successes.push(name);
          console.info(`✅ ${name} 전송 성공`);
        }
      });

      console.info(
        `📊 API 호출 결과: 성공 ${successes.length}개, 실패 ${failures.length}개`
      );

      // 일부 실패가 있어도 성공으로 처리 (부분 성공)
      if (failures.length > 0) {
        console.warn('⚠️ 일부 데이터 전송 실패:', failures);

        // 실패한 API가 전체의 50% 이상이면 전체 실패로 처리
        if (failures.length >= 2) {
          throw new Error(
            `다음 데이터 전송에 실패했습니다: ${failures.join(', ')}`
          );
        }
      }

      console.info('✅ 온보딩 데이터 전송 완료');

      return {
        data: {
          preferences: {
            allergies: data.allergies,
            mood: data.mood,
            selectedFoods: data.selectedFoods,
          },
        },
        message: '온보딩이 성공적으로 완료되었습니다.',
        success: true,
      };
    } catch (error) {
      console.error('❌ 온보딩 완료 처리 실패:', error);

      // 에러 메시지 정제
      let errorMessage = '온보딩 완료 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = '입력 데이터에 오류가 있습니다. 다시 확인해주세요.';
        } else if (error.response && error.response.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = '네트워크 연결을 확인해주세요.';
        }
      }

      throw new Error(errorMessage);
    }
  },

  /**
   * 개별 스텝 데이터 전송 (필요 시 사용)
   * 기존 방식과의 호환성을 위해 유지
   */
  submitStepData: {
    // 알레르기 정보만 전송
    allergy: async (allergies: number[]) => {
      const response = await axios.post('/api/allergy', {
        categories: allergies,
      });
      return response.data;
    },

    // 기분 상태만 전송
    mood: async (mood: string) => {
      const response = await axios.post('/api/user/mood', {
        mood,
      });
      return response.data;
    },

    // 선택된 재료만 전송
    selectedFoods: async (selectedFoodIds: number[]) => {
      const response = await axios.post('/api/user/selected-foods', {
        selectedFoodIds,
      });
      return response.data;
    },
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

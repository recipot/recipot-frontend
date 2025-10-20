import axios, { AxiosInstance } from 'axios';

/**
 * Allergy API용 Axios 인스턴스 생성
 */
const createAllergyApiInstance = (): AxiosInstance => {
  // 개발 환경에서는 Mock 서버를 사용하기 위해 baseURL을 비워둡니다
  // NEXT_PUBLIC_APP_ENV=production이면 실제 API 사용
  const shouldUseMock =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_APP_ENV !== 'production';

  const baseURL = shouldUseMock
    ? '' // MSW가 현재 도메인에서 요청을 가로챔
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.recipot.com';

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    config => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Allergy API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    error => {
      console.error('[Allergy API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    response => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Allergy API Response] ${response.status} ${response.config.url}`
        );
      }
      return response;
    },
    error => {
      console.error(
        '[Allergy API Response Error]',
        error.response?.data || error.message
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

// API 인스턴스
const allergyApi = createAllergyApiInstance();

/**
 * 못먹는 재료 목록 조회
 * @returns 백엔드에서 관리하는 재료 목록
 */
export const fetchRestrictedIngredients = async () => {
  const response = await allergyApi.get('/v1/ingredients/restricted');
  return response.data.data.data;
};

/**
 * 사용자가 선택한 못먹는 재료 저장
 * @param ingredientIds - 선택된 재료 ID 배열
 */
export const updateRestrictedIngredients = async (ingredientIds: number[]) => {
  const response = await allergyApi.post('/v1/ingredients/unavailable', {
    ingredientIds,
  });
  return response.data;
};

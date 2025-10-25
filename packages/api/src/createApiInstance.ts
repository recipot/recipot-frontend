import axios, { AxiosInstance } from 'axios';

export interface CreateApiInstanceOptions {
  /**
   * API 이름 (로깅용)
   * @example 'Allergy', 'Food', 'Recipe'
   */
  apiName: string;

  /**
   * 기본 URL (선택적, 없으면 환경 변수 사용)
   */
  baseURL?: string;

  /**
   * 타임아웃 (ms)
   * @default 10000
   */
  timeout?: number;

  /**
   * 추가 헤더
   */
  headers?: Record<string, string>;

  /**
   * 인증 토큰 (선택적) - 삭제 예정
   */
  token?: string;
}

/**
 * 공통 Axios 인스턴스 생성 유틸리티
 *
 * Mock API와 실제 API를 자동으로 전환하며,
 * 개발 환경에서 요청/응답 로깅을 제공합니다.
 *
 * @param options - API 인스턴스 옵션
 * @returns 설정된 Axios 인스턴스
 *
 * @example
 * ```ts
 * const api = createApiInstance({ apiName: 'Food' });
 * const response = await api.get('/v1/ingredients');
 * ```
 */
export const createApiInstance = (
  options: CreateApiInstanceOptions
): AxiosInstance => {
  const {
    apiName,
    baseURL: customBaseURL,
    headers = {},
    timeout = 10000,
    token,
  } = options;

  // 환경별 baseURL 설정
  // - local: MSW 사용 (baseURL = '')
  // - development: 실제 백엔드 + 디버그 토큰 (baseURL = NEXT_PUBLIC_BACKEND_URL)
  // - production: 실제 백엔드 + OAuth (baseURL = NEXT_PUBLIC_BACKEND_URL)
  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'production';
  const shouldUseMock = APP_ENV === 'local';

  const baseURL =
    customBaseURL ??
    (shouldUseMock
      ? '' // MSW가 현재 도메인에서 요청을 가로챔
      : (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://api.hankkibuteo.com'));

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    timeout,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    config => {
      // LocalStorage에서 토큰을 읽어서 Authorization 헤더에 추가
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.info(
          `[${apiName} API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    error => {
      console.error(`[${apiName} API Request Error]`, error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    response => {
      if (process.env.NODE_ENV === 'development') {
        console.info(
          `[${apiName} API Response] ${response.status} ${response.config.url}`
        );
      }
      return response;
    },
    error => {
      console.error(
        `[${apiName} API Response Error]`,
        error.response?.data ?? error.message
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

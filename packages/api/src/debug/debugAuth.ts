import { createApiInstance } from '../createApiInstance';
import type { DebugTokenRequest, DebugTokenResponse } from './types';

// API 인스턴스
const debugApi = createApiInstance({ apiName: 'DebugAuth' });

/**
 * 디버그 토큰 관련 API
 * 테스트 환경에서만 사용하는 임시 토큰 발급 기능
 */
export const debugAuth = {
  /**
   * 디버그 토큰 발급
   * @param request - 사용자 ID와 역할 정보
   * @returns 발급된 액세스 토큰과 리프레시 토큰
   */
  generateDebugToken: async (
    request: DebugTokenRequest
  ): Promise<DebugTokenResponse> => {
    const response = await debugApi.post<{ data: DebugTokenResponse }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/debug`,
      request
    );
    return response.data.data;
  },
};

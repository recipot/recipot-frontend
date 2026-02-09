import axios from 'axios';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 인증 에러(401) 처리 및 리다이렉트
 * @returns 인증 에러인 경우 true, 그 외 false
 */
export const handleAuthError = (
  error: unknown,
  router: AppRouterInstance
): boolean => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    console.info('🔒 인증 오류, 로그인 페이지로 이동');
    router.push('/signin');
    return true;
  }
  return false;
};


import { tokenUtils } from '@recipot/api';
import { useAuthStore } from '@recipot/contexts';

import { isProduction } from '@/lib/env';

/**
 * 로그인 상태를 확인하는 커스텀 훅
 *
 * 프로덕션 환경에서는 쿠키 기반 인증을 사용하므로 user 상태를 확인하고,
 * 개발 환경에서는 토큰을 확인합니다.
 *
 */
export function useIsLoggedIn() {
  const user = useAuthStore(state => state.user);
  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  return useCookieAuth ? user !== null : token !== null;
}

import { useEffect, useState } from 'react';

import { isKakaoTalkInAppBrowser } from '@/lib/kakao';

/**
 * 카카오톡 인앱 브라우저에서 접속했는지 확인하는 커스텀 훅
 * @returns 카카오톡 인앱 브라우저 여부
 */
export const useIsKakaoInApp = (): boolean => {
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsKakaoInApp(isKakaoTalkInAppBrowser());
    }
  }, []);

  return isKakaoInApp;
};


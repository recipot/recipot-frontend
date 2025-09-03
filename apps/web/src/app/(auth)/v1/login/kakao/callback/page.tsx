'use client';

import { CallbackSpinner, useOAuthCallback } from '../../_components';

export default function KakaoCallback() {
  const { status } = useOAuthCallback({ provider: 'kakao' });

  return <CallbackSpinner provider="kakao" status={status} />;
}

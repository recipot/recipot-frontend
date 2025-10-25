'use client';

import { Suspense } from 'react';

import { CallbackSpinner, useOAuthCallback } from '../../_components';

const KakaoLoadingFallback = (
  <CallbackSpinner provider="kakao" status="카카오 로그인 처리 중..." />
);

function KakaoCallbackContent() {
  const { status } = useOAuthCallback({ provider: 'kakao' });
  return <CallbackSpinner provider="kakao" status={status} />;
}

export default function KakaoCallback() {
  return (
    <Suspense fallback={KakaoLoadingFallback}>
      <KakaoCallbackContent />
    </Suspense>
  );
}

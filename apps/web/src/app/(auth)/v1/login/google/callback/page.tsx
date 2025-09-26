'use client';

import { Suspense } from 'react';

import { CallbackSpinner, useOAuthCallback } from '../../_components';

// fallback JSX를 컴포넌트로 분리하여 성능 최적화
const GoogleLoadingFallback = (
  <CallbackSpinner provider="google" status="구글 로그인 처리 중..." />
);

function GoogleCallbackContent() {
  const { status } = useOAuthCallback({ provider: 'google' });
  return <CallbackSpinner provider="google" status={status} />;
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={GoogleLoadingFallback}>
      <GoogleCallbackContent />
    </Suspense>
  );
}

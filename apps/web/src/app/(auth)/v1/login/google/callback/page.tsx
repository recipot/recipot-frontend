'use client';

import { CallbackSpinner, useOAuthCallback } from '../../_components';

export default function GoogleCallback() {
  const { status } = useOAuthCallback({ provider: 'google' });

  return <CallbackSpinner provider="google" status={status} />;
}

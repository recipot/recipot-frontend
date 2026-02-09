'use client';

import ABTestVariantA from '@/app/ab-test/_components/ABTestVariantA';
import ABTestVariantB from '@/app/ab-test/_components/ABTestVariantB';

export default function OnboardingContent({ variant }: { variant: 'A' | 'B' }) {
  if (variant === 'A') {
    return <ABTestVariantA />;
  }

  return (
    <div className="flex justify-center">
      <ABTestVariantB />
    </div>
  );
}

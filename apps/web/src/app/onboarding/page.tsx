import { cookies } from 'next/headers';

import OnboardingContent from './_components/OnboardingContent';

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const variant = cookieStore.get('ab-onboarding-variant')?.value ?? 'B';

  return <OnboardingContent variant={variant as 'A' | 'B'} />;
}

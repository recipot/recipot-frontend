'use client';

import { ReviewRemindBottomSheet } from '@/components/review/ReviewRemindBottomSheet';
import { useSplash } from '@/contexts/SplashContext';

export default function Home() {
  const { isCompleted } = useSplash();

  return <div>{isCompleted && <ReviewRemindBottomSheet />}</div>;
}

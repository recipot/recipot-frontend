'use client';

import { WeeklySurveyBottomSheet } from '@/components/review/WeeklySurveyBottomSheet';
import { useSplash } from '@/contexts/SplashContext';

export default function Home() {
  const { isCompleted } = useSplash();

  return <div>{isCompleted && <WeeklySurveyBottomSheet />}</div>;
}

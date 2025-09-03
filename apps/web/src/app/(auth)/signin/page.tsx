'use client';

import './styles.css';

import { AuthButtons } from './_components/AuthButtons';
import { IntroSlider } from './_components/IntroSlider';
import { useIntroSlider } from './_components/useIntroSlider';

export default function SignInPage() {
  const { current, handleSlideChange, intro } = useIntroSlider();

  return (
    <div className="mx-auto min-h-screen w-full">
      <IntroSlider
        intro={intro}
        current={current}
        onSlideChange={handleSlideChange}
      />
      <AuthButtons />
    </div>
  );
}

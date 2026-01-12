'use client';

import { Button } from '@/components/common/Button';
import { EmotionBackground, type MoodType } from '@/components/EmotionState';

import ABCardContainer from './ABCardContainer';
import ABStepIndicator from './ABStepIndicator';

interface ABPageLayoutProps {
  currentStep: number;
  title: string;
  question?: string;
  children: React.ReactNode;
  buttonText: string;
  buttonDisabled?: boolean;
  onButtonClick: () => void;
  showButton?: boolean;
  mood?: MoodType | null;
}

/**
 * A/B 테스트 B안 페이지 레이아웃
 * 상단 헤더 (인디케이터 + 제목) + 카드 컨테이너 (질문 + 콘텐츠 + 버튼)
 */
export default function ABPageLayout({
  buttonDisabled = false,
  buttonText,
  children,
  currentStep,
  mood,
  onButtonClick,
  question,
  showButton = true,
  title,
}: ABPageLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-transparent">
      {/* 배경 그래디언트 - mood에 따라 변경 */}
      <EmotionBackground mood={mood ?? null} className="fixed inset-0 -z-10" />

      {/* 상단 헤더 영역 */}
      <div className="flex flex-col items-center px-4 pt-6 pb-8">
        <ABStepIndicator currentStep={currentStep} />
        <h1 className="text-24b text-center whitespace-pre-line text-gray-900">
          {title}
        </h1>
      </div>

      {/* 카드 컨테이너 */}
      <ABCardContainer>
        {/* 질문 텍스트 */}
        {question && (
          <div className="text-20r mt-[70px] w-full text-center whitespace-pre-wrap text-gray-600">
            {question}
          </div>
        )}

        {/* 콘텐츠 영역 */}
        <div className="flex-1">{children}</div>

        {/* 버튼 영역 */}
        {showButton && (
          <div className="mt-auto px-[10px] py-8 pt-6">
            <Button
              size="full"
              onClick={onButtonClick}
              disabled={buttonDisabled}
            >
              {buttonText}
            </Button>
          </div>
        )}
      </ABCardContainer>
    </div>
  );
}

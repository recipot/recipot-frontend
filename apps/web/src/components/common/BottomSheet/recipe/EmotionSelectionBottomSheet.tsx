import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Image from 'next/image';

import { useReviewForm } from '@/hooks/useReviewForm';

import { BottomSheet } from '../BottomSheet';

import { ReviewForm } from './ReviewForm';

const CONFETTI_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
];

const CONFETTI_STYLE = {
  left: 0,
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  zIndex: 9999,
} as const;

interface EmotionSelectionBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timesCooked?: number;
}

export default function EmotionSelectionBottomSheet({
  onOpenChange,
  open,
  timesCooked = 2,
}: EmotionSelectionBottomSheetProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    height: 0,
    width: 0,
  });

  const reviewForm = useReviewForm(timesCooked, () => {
    onOpenChange(false);
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      // 3초 후 컨페티 효과 중지
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      {/* 컨페티 효과 */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          initialVelocityY={20}
          colors={CONFETTI_COLORS}
          style={CONFETTI_STYLE}
        />
      )}

      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <div className="xs:px-4 flex w-full flex-col items-center justify-center px-2">
          {/* ReviewHeader 스타일 */}
          <div className="flex w-full flex-col items-center justify-center">
            {/* 해먹은 횟수 */}
            <div className="text-14 xs:mt-4 xs:mb-5 xs:h-[31px] xs:w-[11.25rem] xs:px-4 xs:py-[5px] mt-6 mb-2 flex h-[28px] w-[10rem] items-center justify-center rounded-2xl bg-gray-100 px-3 py-[4px] text-xs text-gray-700">
              {timesCooked}번째 해먹기 완료
            </div>

            {/* 레시피 타이틀 + 이미지 */}
            <div className="flex flex-col items-center justify-center">
              <div className="xs:mb-2 xs:text-lg mb-1 text-base font-semibold">
                양배추 계란 샐러드
              </div>
              <Image
                src="/recipeImage.png"
                alt="양배추 계란 샐러드"
                width={72}
                height={72}
                className="rounded-[10.67px]"
              />
            </div>
            <div className="xs:mt-5 xs:max-w-[342px] mt-2 h-[1px] w-full max-w-[280px] border border-dashed border-neutral-100" />
          </div>

          {/* ReviewForm 컴포넌트 사용 */}
          <ReviewForm form={reviewForm} />
        </div>
      </BottomSheet>
    </>
  );
}

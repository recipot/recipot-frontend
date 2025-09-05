import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { CloseIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useReviewForm } from '@/hooks/useReviewForm';
import { cn } from '@/lib/utils';

import { ReviewForm } from './ReviewForm';
import { ReviewHeader } from './ReviewHeader';

import type { ReviewBottomSheetProps } from './types';

// Canvas API 모킹 (react-confetti를 위한)
const mockCanvasContext = {
  arc: vi.fn(),
  beginPath: vi.fn(),
  clearRect: vi.fn(),
  clip: vi.fn(),
  closePath: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  drawImage: vi.fn(),
  fill: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  lineTo: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  moveTo: vi.fn(),
  putImageData: vi.fn(),
  rect: vi.fn(),
  restore: vi.fn(),
  rotate: vi.fn(),
  save: vi.fn(),
  scale: vi.fn(),
  setTransform: vi.fn(),
  stroke: vi.fn(),
  transform: vi.fn(),
  translate: vi.fn(),
};

// HTMLCanvasElement 모킹
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => mockCanvasContext),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: vi.fn(() => 'data:image/png;base64,test'),
});

// react-confetti 컴포넌트 모킹
vi.mock('react-confetti', () => ({
  default: vi.fn(() => null),
}));

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

export function ReviewBottomSheet({
  onOpenChange,
  open,
  recipeImageUrl,
  recipeTitle,
  timesCooked = 1,
}: ReviewBottomSheetProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    height: 0,
    width: 0,
  });

  const handleReviewSubmit = () => {
    onOpenChange(false);
  };

  const form = useReviewForm(timesCooked, handleReviewSubmit);

  // 윈도우 크기 감지
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

  // 바텀시트가 열릴 때 컨페티 효과 트리거
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

      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        aria-labelledby="review-bottomsheet"
      >
        <DrawerContent
          aria-describedby={undefined}
          className={cn(
            `mx-auto w-full`,
            // 모바일: 기본 바텀시트
            'max-w-sm sm:max-w-lg',
            // 태블릿: 더 큰 크기
            'md:max-w-2xl',
            // 데스크톱: 바텀시트 유지, 더 큰 크기
            'lg:max-w-4xl xl:max-w-5xl',
            // 높이 조정 - 모든 사이즈에서 바텀시트로 동작
            form.feeling === 'good'
              ? 'h-[52rem] sm:h-[44rem] md:h-[38rem] lg:h-[41rem] xl:h-[44rem]'
              : 'h-[41rem] sm:h-[34rem] md:h-[31rem] lg:h-[34rem] xl:h-[38rem]'
          )}
        >
          <DrawerHeader className="sr-only">
            <VisuallyHidden asChild>
              <DrawerTitle>{recipeTitle} 리뷰 작성</DrawerTitle>
            </VisuallyHidden>
          </DrawerHeader>
          <DrawerClose className="absolute top-4 right-5">
            <CloseIcon />
          </DrawerClose>

          <div className="flex flex-col">
            <ReviewHeader
              recipeTitle={recipeTitle}
              recipeImageUrl={recipeImageUrl}
              timesCooked={timesCooked}
            />
            <div className="flex-1">
              <ReviewForm form={form} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ReviewBottomSheet;

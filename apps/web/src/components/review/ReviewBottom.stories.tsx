import { useState } from 'react';

import type { ReviewData } from '@/types/review.types';

import { ReviewBottomSheet } from './ReviewBottomSheet';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReviewBottomSheet> = {
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '바텀시트 열림/닫힘 상태',
    },
    reviewData: {
      control: 'object',
      description: '레시피 데이터 (이미지, 이름, 완료 횟수 등)',
    },
  },
  component: ReviewBottomSheet,
  parameters: {
    docs: {
      description: {
        component: '레시피 완료 후 후기를 작성하는 바텀시트 컴포넌트입니다.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Components/ReviewBottomSheet',
};

export default meta;
type Story = StoryObj<typeof ReviewBottomSheet>;

const mockReviewData: ReviewData = {
  completionCount: 2,
  recipeId: 'recipe-1',
  recipeImage: '/recipeImage.png',
  recipeName: '김치찌개',
};

// 실제 상태 관리를 하는 래퍼 컴포넌트
function ReviewBottomSheetWrapper() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (data: {
    comment: string;
    emotions: {
      difficulty: string | null;
      experience: string | null;
      taste: string | null;
    };
  }) => {
    // eslint-disable-next-line no-console
    console.log('Review submitted:', data);
    setIsOpen(false);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        바텀시트 열기
      </button>
      <ReviewBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        reviewData={mockReviewData}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ReviewBottomSheetWrapper />,
};

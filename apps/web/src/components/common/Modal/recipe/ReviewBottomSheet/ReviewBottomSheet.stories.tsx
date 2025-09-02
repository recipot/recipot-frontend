import { useState } from 'react';

import { Button } from '@/components/common/Button/Button';

import ReviewBottomSheet from './ReviewBottomSheet';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  component: ReviewBottomSheet,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Common/ReviewBottomSheet',
} satisfies Meta<typeof ReviewBottomSheet>;
export default meta;

type Story = StoryObj<typeof meta>;

const Template = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>리뷰 모달 열기</Button>
      <ReviewBottomSheet
        open={open}
        onOpenChange={setOpen}
        recipeTitle="양배추 계란 샐러드"
        recipeImageUrl="/recipeImage.png"
        timesCooked={2}
      />
    </div>
  );
};

export const Initial: Story = {
  args: {
    onOpenChange: () => {},
    open: true,
    recipeImageUrl: '/recipeImage.png',
    recipeTitle: '양배추 계란 샐러드',
    timesCooked: 2,
  },
  render: () => <Template key="initial" />,
};

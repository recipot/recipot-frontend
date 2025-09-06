import { useState } from 'react';

import { Button } from '@/components/common/Button';

import { BottomSheet } from '../BottomSheet';
import EmotionSelectionBottomSheet from '../recipe/EmotionSelectionBottomSheet';

// 간단한 바텀시트 컴포넌트
const SimpleBottomSheet = ({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) => (
  <BottomSheet onOpenChange={onOpenChange} open={open} title="기본 바텀시트">
    <div className="p-6">
      <p className="text-gray-600">바텀시트 내용이 여기에 표시됩니다.</p>
    </div>
  </BottomSheet>
);

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof BottomSheet> = {
  argTypes: {
    open: {
      control: 'boolean',
      description: '바텀시트 열림/닫힘 상태',
    },
  },
  component: BottomSheet,
  parameters: {
    docs: {
      description: {
        component:
          'shadcn drawer를 기반으로 한 재사용 가능한 바텀시트 컴포넌트입니다.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Common/BottomSheet',
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

// 감정 선택 바텀시트
export const EmotionSelection: Story = {
  render: function EmotionSelectionStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>감정 선택 바텀시트</Button>
        <EmotionSelectionBottomSheet open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

// 기본 스타일 바텀시트
export const BasicStyle: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            enabled: false,
            id: 'aria-hidden-focus',
          },
        ],
      },
    },
  },
  render: function BasicStyleStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>기본 스타일 바텀시트</Button>
        <SimpleBottomSheet open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

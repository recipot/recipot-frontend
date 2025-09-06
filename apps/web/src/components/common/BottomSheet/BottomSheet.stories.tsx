import { useState } from 'react';

import { Button } from '@/components/common/Button';

import { BottomSheet } from './BottomSheet';
import {
  SimpleBottomSheet,
  EmotionSelectionBottomSheet,
} from './BottomSheetTemplates';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof BottomSheet> = {
  argTypes: {
    hideCloseButton: {
      control: 'boolean',
      description: '닫기 버튼 숨기기',
    },
    open: {
      control: 'boolean',
      description: '바텀시트 열림/닫힘 상태',
    },
    size: {
      control: 'select',
      description: '바텀시트 크기',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    stickyFooter: {
      control: 'boolean',
      description: '푸터 고정 여부',
    },
    stickyHeader: {
      control: 'boolean',
      description: '헤더 고정 여부',
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

// 알레르기/음식 제한 선택 바텀시트
// export const AllergySelection: Story = {
//   render: () => {
//     const [open, setOpen] = useState(false);

//     return (
//       <>
//         <Button onClick={() => setOpen(true)}>알레르기 선택 바텀시트</Button>
//         <AllergyBottomSheet open={open} onOpenChange={setOpen} />
//       </>
//     );
//   },
// };

// 기본 스타일 바텀시트
export const BasicStyle: Story = {
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

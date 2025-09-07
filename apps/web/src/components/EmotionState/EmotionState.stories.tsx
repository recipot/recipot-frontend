import EmotionState from './EmotionState';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof EmotionState> = {
  argTypes: {
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스를 설정합니다.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '컴포넌트의 비활성화 상태를 설정합니다.',
    },
    initialMood: {
      control: { type: 'select' },
      description: '초기 선택된 감정을 설정합니다.',
      options: [null, 'bad', 'neutral', 'good'],
    },
    onMoodChange: {
      action: 'moodChanged',
      description: '감정이 변경될 때 호출되는 함수입니다.',
    },
  },
  component: EmotionState,
  parameters: {
    docs: {
      description: {
        component:
          '감정 상태를 선택할 수 있는 완전한 컴포넌트입니다. Figma 디자인과 정확히 일치하는 레이아웃을 제공합니다.',
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'Components/EmotionState',
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {},
};

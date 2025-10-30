import EmotionBackground from './EmotionBackground';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof EmotionBackground> = {
  argTypes: {
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스를 설정합니다.',
    },
    mood: {
      control: { type: 'select' },
      description: '기분 상태에 따른 배경 그라디언트를 설정합니다.',
      options: [null, 'bad', 'neutral', 'good', 'default'],
    },
  },
  component: EmotionBackground,
  parameters: {
    docs: {
      description: {
        component:
          '감정 상태에 따른 배경 그라디언트 컴포넌트입니다. mood에 따라 다른 그라디언트 색상을 표시합니다.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Components/EmotionState/EmotionBackground',
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: (
      <div className="flex h-screen items-center justify-center text-2xl font-bold">
        배경 그라디언트 테스트
      </div>
    ),
    mood: null,
  },
};

// 힘들어 상태
export const Bad: Story = {
  args: {
    children: (
      <div className="flex h-screen items-center justify-center text-2xl font-bold">
        힘들어 - 파란색 그라디언트
      </div>
    ),
    mood: 'bad',
  },
};

// 그럭저럭 상태
export const Neutral: Story = {
  args: {
    children: (
      <div className="flex h-screen items-center justify-center text-2xl font-bold">
        그럭저럭 - 노란색 그라디언트
      </div>
    ),
    mood: 'neutral',
  },
};

// 충분해 상태
export const Good: Story = {
  args: {
    children: (
      <div className="flex h-screen items-center justify-center text-2xl font-bold">
        충분해 - 빨간색 그라디언트
      </div>
    ),
    mood: 'good',
  },
};

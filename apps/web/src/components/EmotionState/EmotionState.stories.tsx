import EmotionContainer from './EmotionContainer';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof EmotionContainer> = {
  argTypes: {
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스를 설정합니다.',
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
    showImage: {
      control: { type: 'boolean' },
      description: '캐릭터 이미지 표시 여부를 설정합니다.',
    },
  },
  component: EmotionContainer,
  parameters: {
    docs: {
      description: {
        component:
          '감정 상태를 선택할 수 있는 완전한 컴포넌트입니다. 단일책임원칙에 따라 배경, 선택기, 캐릭터로 분리되어 구성됩니다.',
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
  args: {
    showImage: true,
  },
};

// 이미지 없이
export const WithoutImage: Story = {
  args: {
    showImage: false,
  },
};

// 초기 선택된 상태
export const WithInitialMood: Story = {
  args: {
    initialMood: 'good',
    showImage: true,
  },
};

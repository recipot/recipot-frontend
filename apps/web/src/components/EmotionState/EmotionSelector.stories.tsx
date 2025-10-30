import EmotionSelector from './EmotionSelector';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof EmotionSelector> = {
  argTypes: {
    onMoodSelect: {
      action: 'moodSelected',
      description: '기분이 선택될 때 호출되는 함수입니다.',
    },
    selectedMood: {
      control: { type: 'select' },
      description: '현재 선택된 기분 상태입니다.',
      options: [null, 'bad', 'neutral', 'good'],
    },
  },
  component: EmotionSelector,
  parameters: {
    docs: {
      description: {
        component:
          '기분 선택 버튼 영역 컴포넌트입니다. 3개의 기분 버튼을 표시합니다.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/EmotionState/EmotionSelector',
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    selectedMood: null,
  },
};

// 선택된 상태 - 힘들어
export const SelectedBad: Story = {
  args: {
    selectedMood: 'bad',
  },
};

// 선택된 상태 - 그럭저럭
export const SelectedNeutral: Story = {
  args: {
    selectedMood: 'neutral',
  },
};

// 선택된 상태 - 충분해
export const SelectedGood: Story = {
  args: {
    selectedMood: 'good',
  },
};

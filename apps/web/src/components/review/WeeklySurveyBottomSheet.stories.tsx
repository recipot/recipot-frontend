import { WeeklySurveyBottomSheet } from './WeeklySurveyBottomSheet';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  component: WeeklySurveyBottomSheet,
  parameters: {
    docs: {
      description: {
        component:
          '주간 건강 설문 바텀시트 컴포넌트입니다. 사용자가 집밥을 챙겨 먹은 후 건강에 어떤 변화가 있었는지 설문할 수 있습니다.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Review/WeeklySurveyBottomSheet',
} satisfies Meta<typeof WeeklySurveyBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 상태',
  parameters: {
    docs: {
      description: {
        story:
          '설문 바텀시트의 기본 상태입니다. 데이터 로딩 후 설문을 시작할 수 있습니다.',
      },
    },
  },
};

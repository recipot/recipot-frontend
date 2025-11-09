import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WeeklySurveyBottomSheet } from './WeeklySurveyBottomSheet';

const meta = {
  component: WeeklySurveyBottomSheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '주간 건강 설문 바텀시트 컴포넌트입니다. 사용자가 집밥을 챙겨 먹은 후 건강에 어떤 변화가 있었는지 설문할 수 있습니다.',
      },
    },
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

export const Loading: Story = {
  name: '로딩 상태',
  parameters: {
    docs: {
      description: {
        story: '데이터를 불러오는 중인 상태입니다.',
      },
    },
  },
  decorators: [
    Story => {
      React.useEffect(() => {
        // 로딩 상태를 시뮬레이션하기 위해 API 호출을 지연시킴
        const originalFetch = window.fetch;
        let fetchCount = 0;

        window.fetch = async (...args) => {
          fetchCount++;
          // 첫 번째와 두 번째 fetch만 지연 (eligibility, preparation)
          if (fetchCount <= 2) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          return originalFetch(...args);
        };

        return () => {
          window.fetch = originalFetch;
        };
      }, []);

      return <Story />;
    },
  ],
};


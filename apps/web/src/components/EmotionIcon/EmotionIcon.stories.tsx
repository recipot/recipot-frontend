import React from 'react';

import EmotionIcon from './EmotionIcon';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof EmotionIcon> = {
  argTypes: {
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스를 설정합니다.',
    },
    size: {
      control: { max: 64, min: 16, step: 4, type: 'range' },
      description: '아이콘 크기를 설정합니다.',
    },
    type: {
      control: { type: 'select' },
      description: '감정 타입을 설정합니다.',
      options: ['bad', 'neutral', 'good'],
    },
  },
  component: EmotionIcon,
  parameters: {
    docs: {
      description: {
        component:
          '감정을 표현하는 아이콘 컴포넌트입니다. 3가지 타입(bad, neutral, good)과 다양한 크기를 지원합니다.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/EmotionIcon',
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    size: 24,
    type: 'bad',
  },
};

// 나쁜 감정
export const Bad: Story = {
  args: {
    size: 24,
    type: 'bad',
  },
  parameters: {
    docs: {
      description: {
        story: '힘들어, 별로예요 등의 부정적인 감정을 표현합니다.',
      },
    },
  },
};

// 보통 감정
export const Neutral: Story = {
  args: {
    size: 24,
    type: 'neutral',
  },
  parameters: {
    docs: {
      description: {
        story: '그럭저럭, 그저 그래요 등의 중립적인 감정을 표현합니다.',
      },
    },
  },
};

// 좋은 감정
export const Good: Story = {
  args: {
    size: 24,
    type: 'good',
  },
  parameters: {
    docs: {
      description: {
        story: '충분해, 또 해먹을래요 등의 긍정적인 감정을 표현합니다.',
      },
    },
  },
};

// 크기 변형
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 감정 아이콘을 보여줍니다.',
      },
    },
  },
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="bad" size={16} />
        <span className="text-xs text-gray-600">16px</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="neutral" size={24} />
        <span className="text-xs text-gray-600">24px</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="good" size={32} />
        <span className="text-xs text-gray-600">32px</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="bad" size={48} />
        <span className="text-xs text-gray-600">48px</span>
      </div>
    </div>
  ),
};

// 모든 타입 비교
export const AllTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: '모든 감정 타입을 한 번에 비교해볼 수 있습니다.',
      },
    },
  },
  render: () => (
    <div className="flex items-center space-x-6">
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="bad" size={32} />
        <span className="text-sm font-medium text-blue-600">Bad</span>
        <span className="text-xs text-gray-500">힘들어</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="neutral" size={32} />
        <span className="text-sm font-medium text-yellow-600">Neutral</span>
        <span className="text-xs text-gray-500">그럭저럭</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionIcon type="good" size={32} />
        <span className="text-sm font-medium text-red-500">Good</span>
        <span className="text-xs text-gray-500">충분해</span>
      </div>
    </div>
  ),
};

// 인터랙티브 예제
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '버튼을 클릭하여 감정 타입을 변경할 수 있는 인터랙티브 예제입니다.',
      },
    },
  },
  render: () => {
    const [selectedType, setSelectedType] = React.useState<
      'bad' | 'neutral' | 'good'
    >('bad');

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          {(['bad', 'neutral', 'good'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <EmotionIcon type={selectedType} size={48} />
        </div>
        <p className="text-sm text-gray-600">
          선택된 타입: <span className="font-semibold">{selectedType}</span>
        </p>
      </div>
    );
  },
};

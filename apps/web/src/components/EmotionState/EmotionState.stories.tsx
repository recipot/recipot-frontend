import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EmotionState from './EmotionState';

const meta: Meta<typeof EmotionState> = {
  title: 'Components/EmotionState',
  component: EmotionState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '감정 상태를 선택할 수 있는 완전한 컴포넌트입니다. Figma 디자인과 정확히 일치하는 레이아웃을 제공합니다.',
      },
    },
  },
  argTypes: {
    onMoodChange: {
      action: 'moodChanged',
      description: '감정이 변경될 때 호출되는 함수입니다.',
    },
    initialMood: {
      control: { type: 'select' },
      options: [null, 'bad', 'neutral', 'good'],
      description: '초기 선택된 감정을 설정합니다.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '컴포넌트의 비활성화 상태를 설정합니다.',
    },
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스를 설정합니다.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {},
};

// 초기 선택된 상태
export const WithInitialSelection: Story = {
  args: {
    initialMood: 'neutral',
  },
  parameters: {
    docs: {
      description: {
        story: '초기에 중립적인 감정이 선택된 상태로 시작합니다.',
      },
    },
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '모든 버튼이 비활성화된 상태입니다.',
      },
    },
  },
};

// 인터랙티브 예제
export const Interactive: Story = {
  render: () => {
    const [selectedMood, setSelectedMood] = React.useState<
      'bad' | 'neutral' | 'good' | null
    >(null);
    const [isDisabled, setIsDisabled] = React.useState(false);

    const handleMoodChange = (mood: 'bad' | 'neutral' | 'good' | null) => {
      setSelectedMood(mood);
    };

    return (
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setIsDisabled(!isDisabled)}
            className={`rounded px-4 py-2 font-medium transition-colors ${
              isDisabled
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isDisabled ? '활성화' : '비활성화'}
          </button>

          <button
            onClick={() => setSelectedMood(null)}
            className="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            선택 해제
          </button>
        </div>

        <EmotionState
          onMoodChange={handleMoodChange}
          initialMood={selectedMood}
          disabled={isDisabled}
        />

        {selectedMood && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-800">선택된 감정</h3>
            <p className="text-blue-700">
              타입: <span className="font-mono">{selectedMood}</span>
            </p>
            <p className="text-blue-700">
              표시명:{' '}
              <span className="font-semibold">
                {selectedMood === 'bad'
                  ? '힘들어'
                  : selectedMood === 'neutral'
                    ? '그럭저럭'
                    : '충분해'}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '감정을 선택하고, 컴포넌트를 활성화/비활성화할 수 있는 완전한 인터랙티브 예제입니다.',
      },
    },
  },
};

// Figma 디자인 복제
export const FigmaDesign: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl bg-white p-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          감정 상태 컴포넌트
        </h1>
        <p className="text-gray-600">Figma 디자인과 정확히 일치하는 구현</p>
      </div>

      <EmotionState />

      <div className="mt-12 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          디자인 시스템
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">색상 팔레트</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: '#d4e2ff' }}
                ></div>
                <span className="text-sm text-gray-600">#d4e2ff (Bad)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: '#fdfab0' }}
                ></div>
                <span className="text-sm text-gray-600">#fdfab0 (Neutral)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: '#ffe0e1' }}
                ></div>
                <span className="text-sm text-gray-600">#ffe0e1 (Good)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">타이포그래피</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">폰트: Pretendard</p>
              <p className="text-sm text-gray-600">크기: 17px (메인)</p>
              <p className="text-sm text-gray-600">두께: Bold (700)</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">레이아웃</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">버튼 크기: 93x116px</p>
              <p className="text-sm text-gray-600">아이콘 크기: 60x60px</p>
              <p className="text-sm text-gray-600">선택 시: 72x72px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Figma 디자인과 정확히 일치하는 완전한 구현과 디자인 시스템 정보를 보여줍니다.',
      },
    },
  },
};

// 사용 사례 예제
export const UseCases: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">사용 사례</h2>

        <div className="space-y-8">
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-800">
              레시피 후기 시스템
            </h3>
            <p className="mb-4 text-blue-700">
              사용자가 요리를 완료한 후 만족도를 평가할 때 사용합니다.
            </p>
            <EmotionState
              onMoodChange={mood => console.log('Recipe review:', mood)}
            />
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-800">
              앱 만족도 조사
            </h3>
            <p className="mb-4 text-green-700">
              앱 사용 경험에 대한 간단한 피드백을 수집할 때 사용합니다.
            </p>
            <EmotionState
              onMoodChange={mood => console.log('App feedback:', mood)}
            />
          </div>

          <div className="rounded-lg bg-purple-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-purple-800">
              일일 기분 체크
            </h3>
            <p className="mb-4 text-purple-700">
              사용자의 일일 기분을 추적하고 기록할 때 사용합니다.
            </p>
            <EmotionState
              onMoodChange={mood => console.log('Daily mood:', mood)}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '감정 상태 컴포넌트의 다양한 사용 사례를 보여줍니다.',
      },
    },
  },
};

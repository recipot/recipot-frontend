import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import MoodButton, { MoodType, MoodState } from './MoodButton';

const meta: Meta<typeof MoodButton> = {
  title: 'Components/MoodButton',
  component: MoodButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '개별 감정 상태 버튼 컴포넌트입니다. Figma 디자인과 정확히 일치하는 아이콘 위치와 스타일을 제공합니다.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['bad', 'neutral', 'good'],
      description: '감정 타입을 설정합니다.',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'selected', 'disabled'],
      description: '버튼의 상태를 설정합니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼이 클릭될 때 호출되는 함수입니다.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '버튼의 비활성화 상태를 설정합니다.',
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
  args: {
    type: 'neutral',
    state: 'default',
  },
};

// 모든 감정 타입
export const AllMoodTypes: Story = {
  render: () => (
    <div className="flex space-x-8">
      <MoodButton type="bad" state="default" />
      <MoodButton type="neutral" state="default" />
      <MoodButton type="good" state="default" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 감정 타입의 기본 상태를 보여줍니다.',
      },
    },
  },
};

// 모든 상태
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Default States
        </h3>
        <div className="flex space-x-8">
          <MoodButton type="bad" state="default" />
          <MoodButton type="neutral" state="default" />
          <MoodButton type="good" state="default" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Selected States
        </h3>
        <div className="flex space-x-8">
          <MoodButton type="bad" state="selected" />
          <MoodButton type="neutral" state="selected" />
          <MoodButton type="good" state="selected" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Disabled States
        </h3>
        <div className="flex space-x-8">
          <MoodButton type="bad" state="disabled" />
          <MoodButton type="neutral" state="disabled" />
          <MoodButton type="good" state="disabled" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 감정 타입과 상태의 조합을 보여줍니다.',
      },
    },
  },
};

// 인터랙티브 예제
export const Interactive: Story = {
  render: () => {
    const [selectedMood, setSelectedMood] = React.useState<MoodType | null>(
      null
    );
    const [isDisabled, setIsDisabled] = React.useState(false);

    const handleMoodClick = (mood: MoodType) => {
      if (isDisabled) return;
      setSelectedMood(selectedMood === mood ? null : mood);
    };

    const getMoodState = (mood: MoodType): MoodState => {
      if (isDisabled) return 'disabled';
      if (selectedMood === mood) return 'selected';
      return 'default';
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

        <div className="flex space-x-8">
          <MoodButton
            type="bad"
            state={getMoodState('bad')}
            onClick={() => handleMoodClick('bad')}
          />
          <MoodButton
            type="neutral"
            state={getMoodState('neutral')}
            onClick={() => handleMoodClick('neutral')}
          />
          <MoodButton
            type="good"
            state={getMoodState('good')}
            onClick={() => handleMoodClick('good')}
          />
        </div>

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
          MoodButton 컴포넌트
        </h1>
        <p className="text-gray-600">Figma 디자인과 정확히 일치하는 구현</p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            기본 상태
          </h2>
          <div className="flex space-x-8">
            <MoodButton type="bad" state="default" />
            <MoodButton type="neutral" state="default" />
            <MoodButton type="good" state="default" />
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            선택된 상태
          </h2>
          <div className="flex space-x-8">
            <MoodButton type="bad" state="selected" />
            <MoodButton type="neutral" state="selected" />
            <MoodButton type="good" state="selected" />
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            비활성화 상태
          </h2>
          <div className="flex space-x-8">
            <MoodButton type="bad" state="disabled" />
            <MoodButton type="neutral" state="disabled" />
            <MoodButton type="good" state="disabled" />
          </div>
        </div>
      </div>

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
            <h3 className="font-medium text-gray-700">아이콘 위치</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Bad: translate(-3px, -3px)
              </p>
              <p className="text-sm text-gray-600">
                Neutral: translate(0px, 0px)
              </p>
              <p className="text-sm text-gray-600">
                Good: translate(-3px, -3px)
              </p>
              <p className="text-sm text-gray-600">선택 시: -9px 오프셋</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">크기</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">기본: 60x60px</p>
              <p className="text-sm text-gray-600">선택: 72x72px</p>
              <p className="text-sm text-gray-600">아이콘: 24x24px</p>
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

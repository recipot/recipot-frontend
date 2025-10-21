import { RefreshIcon } from '@/components/Icons';

import { Header } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  argTypes: {},
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Common/Header',
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 온보딩 페이지에서 사용하는 헤더 패턴
 * - 조건부 Back 버튼 (첫 단계에서는 빈 공간)
 * - Refresh 버튼
 */
export const OnboardingPattern: Story = {
  render: () => {
    const currentStep = 2;

    return (
      <div className="relative h-screen">
        <Header>
          <Header.Back
            show={currentStep > 1}
            onClick={() => alert('뒤로가기')}
          />
          <Header.Action onClick={() => alert('새로고침')} ariaLabel="새로고침">
            <RefreshIcon size={24} />
          </Header.Action>
        </Header>
        <Header.Spacer />
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-600">
            currentStep: {currentStep}
            <br />
            (조건부 Back 버튼 예시)
          </p>
        </div>
      </div>
    );
  },
};

/**
 * 첫 번째 단계에서의 온보딩 헤더
 * Back 버튼 대신 빈 공간 표시
 */
export const OnboardingFirstStep: Story = {
  render: () => {
    const currentStep = 1;

    return (
      <div className="relative h-screen">
        <Header>
          <Header.Back
            show={currentStep > 1}
            onClick={() => alert('뒤로가기')}
          />
          <Header.Action onClick={() => alert('새로고침')} ariaLabel="새로고침">
            <RefreshIcon size={24} />
          </Header.Action>
        </Header>
        <Header.Spacer />
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-600">
            currentStep: {currentStep}
            <br />
            (Back 버튼 숨김, 빈 공간 표시)
          </p>
        </div>
      </div>
    );
  },
};

/**
 * 레시피 추천 페이지에서 사용하는 헤더 패턴
 * - Back 버튼
 * - Refresh 버튼
 */
export const RecipeRecommendPattern: Story = {
  render: () => (
    <div className="relative h-screen">
      <Header>
        <Header.Back onClick={() => alert('뒤로가기')} />
        <Header.Action onClick={() => alert('새로고침')} ariaLabel="새로고침">
          <RefreshIcon size={24} />
        </Header.Action>
      </Header>
      <Header.Spacer />
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-600">레시피 추천 페이지</p>
      </div>
    </div>
  ),
};

/**
 * 확장 예시: 여러 개의 액션 버튼
 * - Back 버튼
 * - 여러 Action 버튼들
 */
export const MultipleActions: Story = {
  render: () => (
    <div className="relative h-screen">
      <Header>
        <Header.Back onClick={() => alert('뒤로가기')} />
        <Header.Action onClick={() => alert('공유하기')} ariaLabel="공유하기">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08259 9.16733C7.54305 8.4491 6.72181 8 5.8 8C4.14315 8 2.8 9.34315 2.8 11C2.8 12.6569 4.14315 14 5.8 14C6.72181 14 7.54305 13.5509 8.08259 12.8327L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0782 14 16.257 14.4491 15.7174 15.1673L8.77729 11.3706C8.79231 11.2492 8.8 11.1255 8.8 11C8.8 10.8745 8.79231 10.7508 8.77729 10.6294L15.7174 6.83267C16.257 7.5509 17.0782 8 18 8Z"
              fill="currentColor"
            />
          </svg>
        </Header.Action>
        <Header.Action onClick={() => alert('새로고침')} ariaLabel="새로고침">
          <RefreshIcon size={24} />
        </Header.Action>
      </Header>
      <Header.Spacer />
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-600">여러 개의 액션 버튼 예시</p>
      </div>
    </div>
  ),
};

/**
 * 커스텀 스타일 예시
 */
export const CustomStyle: Story = {
  render: () => (
    <div className="relative h-screen">
      <Header className="border-b border-gray-200 shadow-sm">
        <Header.Back onClick={() => alert('뒤로가기')} />
        <Header.Action
          onClick={() => alert('새로고침')}
          ariaLabel="새로고침"
          className="rounded-full transition-colors hover:bg-gray-100"
        >
          <RefreshIcon size={24} />
        </Header.Action>
      </Header>
      <Header.Spacer />
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-600">커스텀 스타일이 적용된 헤더</p>
      </div>
    </div>
  ),
};

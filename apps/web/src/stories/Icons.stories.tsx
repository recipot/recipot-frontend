import {
  AddIcon,
  ArrowIcon,
  BackIcon,
  CardTimeIcon,
  CheckIcon,
  CloseIcon,
  CookIcon,
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
  GoogleIcon,
  KakaoIcon,
  MyFileIcon,
  MyOpenFileIcon,
  NaviMyIcon,
  NaviRefreshIcon,
  NaviShareIcon,
  SearchIcon,
  SettingsIcon,
  SourceIcon,
  Step1Icon,
  Step2Icon,
  Step3Icon,
  Step4Icon,
  ZzimIcon,
} from '../components/Icons';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  argTypes: {
    color: {
      control: { type: 'color' },
      description: '아이콘 색상',
    },
    size: {
      control: { max: 64, min: 16, step: 2, type: 'number' },
      description: '아이콘 크기',
    },
  },
  parameters: {
    layout: 'padded',
  },
  title: 'Components/Icons',
};

export default meta;
type Story = StoryObj;

// 기본 아이콘들
export const BasicIcons: Story = {
  args: {
    color: '#868E96',
    size: 24,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-6 gap-4 p-6">
      <div className="flex flex-col items-center space-y-2">
        <AddIcon {...args} />
        <span className="text-sm text-gray-600">AddIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <ArrowIcon {...args} />
        <span className="text-sm text-gray-600">ArrowIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <CheckIcon {...args} />
        <span className="text-sm text-gray-600">CheckIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <CloseIcon {...args} />
        <span className="text-sm text-gray-600">CloseIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <SearchIcon {...args} />
        <span className="text-sm text-gray-600">SearchIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <BackIcon {...args} />
        <span className="text-sm text-gray-600">BackIcon</span>
      </div>
    </div>
  ),
};

// 감정 아이콘들
export const EmotionIcons: Story = {
  args: {
    color: '#4164AE',
    size: 32,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="flex flex-col items-center space-y-2">
        <EmotionGoodIcon {...args} />
        <span className="text-sm text-gray-600">EmotionGoodIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionNeutralIcon {...args} />
        <span className="text-sm text-gray-600">EmotionNeutralIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <EmotionBadIcon {...args} />
        <span className="text-sm text-gray-600">EmotionBadIcon</span>
      </div>
    </div>
  ),
};

// 기능 아이콘들
export const FunctionIcons: Story = {
  args: {
    color: '#868E96',
    size: 24,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-5 gap-4 p-6">
      <div className="flex flex-col items-center space-y-2">
        <CookIcon {...args} />
        <span className="text-sm text-gray-600">CookIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <MyFileIcon {...args} />
        <span className="text-sm text-gray-600">MyFileIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <MyOpenFileIcon {...args} />
        <span className="text-sm text-gray-600">MyOpenFileIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <SettingsIcon {...args} />
        <span className="text-sm text-gray-600">SettingsIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <SourceIcon {...args} />
        <span className="text-sm text-gray-600">SourceIcon</span>
      </div>
    </div>
  ),
};

// 단계 아이콘들
export const StepIcons: Story = {
  args: {
    color: '#868E96',
    size: 24,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-4 gap-4 p-6">
      <div className="flex flex-col items-center space-y-2">
        <Step1Icon {...args} />
        <span className="text-sm text-gray-600">Step1Icon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Step2Icon {...args} />
        <span className="text-sm text-gray-600">Step2Icon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Step3Icon {...args} />
        <span className="text-sm text-gray-600">Step3Icon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Step4Icon {...args} />
        <span className="text-sm text-gray-600">Step4Icon</span>
      </div>
    </div>
  ),
};

// 카드 아이콘들
export const CardIcons: Story = {
  args: {
    color: '#868E96',
    size: 24,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-1 gap-4 p-6">
      <div className="flex flex-col items-center space-y-2">
        <CardTimeIcon {...args} />
        <span className="text-sm text-gray-600">CardTimeIcon</span>
      </div>
    </div>
  ),
};

// 네비게이션 아이콘들
export const NavigationIcons: Story = {
  args: {
    color: '#868E96',
    size: 24,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="flex flex-col items-center space-y-2">
        <NaviMyIcon {...args} />
        <span className="text-sm text-gray-600">NaviMyIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <NaviRefreshIcon {...args} />
        <span className="text-sm text-gray-600">NaviRefreshIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <NaviShareIcon {...args} />
        <span className="text-sm text-gray-600">NaviShareIcon</span>
      </div>
    </div>
  ),
};

// 소셜 로그인 아이콘들
export const SocialIcons: Story = {
  args: {
    size: 24,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div className="flex flex-col items-center space-y-2">
        <GoogleIcon {...args} />
        <span className="text-sm text-gray-600">GoogleIcon</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <KakaoIcon {...args} />
        <span className="text-sm text-gray-600">KakaoIcon</span>
      </div>
    </div>
  ),
};

// 찜 아이콘
export const ZzimIconStory: Story = {
  args: {
    active: false,
    color: '#868E96',
    size: 24,
  },
  render: (args: { active?: boolean; size?: number; color?: string }) => (
    <div className="grid grid-cols-1 gap-4 p-6">
      <div className="flex flex-col items-center space-y-2">
        <ZzimIcon {...args} />
        <span className="text-sm text-gray-600">ZzimIcon</span>
      </div>
    </div>
  ),
};

// 모든 아이콘을 한 번에 보기
export const AllIcons: Story = {
  args: {
    color: '#868E96',
    size: 20,
  },
  render: (args: { size?: number; color?: string }) => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">기본 아이콘들</h3>
        <div className="grid grid-cols-6 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <AddIcon {...args} />
            <span className="text-xs text-gray-600">AddIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ArrowIcon {...args} />
            <span className="text-xs text-gray-600">ArrowIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <CheckIcon {...args} />
            <span className="text-xs text-gray-600">CheckIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <CloseIcon {...args} />
            <span className="text-xs text-gray-600">CloseIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <SearchIcon {...args} />
            <span className="text-xs text-gray-600">SearchIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <BackIcon {...args} />
            <span className="text-xs text-gray-600">BackIcon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">감정 아이콘들</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center space-y-2">
            <EmotionGoodIcon {...args} />
            <span className="text-xs text-gray-600">EmotionGoodIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <EmotionNeutralIcon {...args} />
            <span className="text-xs text-gray-600">EmotionNeutralIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <EmotionBadIcon {...args} />
            <span className="text-xs text-gray-600">EmotionBadIcon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">기능 아이콘들</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <CookIcon {...args} />
            <span className="text-xs text-gray-600">CookIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <MyFileIcon {...args} />
            <span className="text-xs text-gray-600">MyFileIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <MyOpenFileIcon {...args} />
            <span className="text-xs text-gray-600">MyOpenFileIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <SettingsIcon {...args} />
            <span className="text-xs text-gray-600">SettingsIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <SourceIcon {...args} />
            <span className="text-xs text-gray-600">SourceIcon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">단계 아이콘들</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <Step1Icon {...args} />
            <span className="text-xs text-gray-600">Step1Icon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Step2Icon {...args} />
            <span className="text-xs text-gray-600">Step2Icon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Step3Icon {...args} />
            <span className="text-xs text-gray-600">Step3Icon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Step4Icon {...args} />
            <span className="text-xs text-gray-600">Step4Icon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">카드 아이콘들</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <CardTimeIcon {...args} />
            <span className="text-xs text-gray-600">CardTimeIcon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">네비게이션 아이콘들</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center space-y-2">
            <NaviMyIcon {...args} />
            <span className="text-xs text-gray-600">NaviMyIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NaviRefreshIcon {...args} />
            <span className="text-xs text-gray-600">NaviRefreshIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NaviShareIcon {...args} />
            <span className="text-xs text-gray-600">NaviShareIcon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">소셜 로그인 아이콘들</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center space-y-2">
            <GoogleIcon {...args} />
            <span className="text-xs text-gray-600">GoogleIcon</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <KakaoIcon {...args} />
            <span className="text-xs text-gray-600">KakaoIcon</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">찜 아이콘</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <ZzimIcon {...args} active />
            <span className="text-xs text-gray-600">ZzimIcon</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

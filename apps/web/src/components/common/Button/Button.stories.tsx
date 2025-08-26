import React, { useState } from 'react';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';

import { IconButton } from '@/components/common/Button/variants/IconButton';

import { Button } from './Button';
import { FloatingButton } from './variants';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  argTypes: {
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    shape: {
      control: 'select',
      options: ['square', 'round'],
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'full', 'icon', 'icon-xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'toggle'],
    },
  },
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Common/Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Button.Text>기본 버튼</Button.Text>,
  },
};

export const WithIcon: Story = {
  args: {
    size: 'lg',
    variant: 'default',
  },
  render: args => (
    <Button {...args}>
      <Button.Icon>
        <MessageCircle />
      </Button.Icon>
      <Button.Text>아이콘과 함께</Button.Text>
    </Button>
  ),
};

export const FullWidth: Story = {
  args: {
    children: <Button.Text>꽉 찬 너비 버튼</Button.Text>,
    size: 'full',
  },
  parameters: {
    layout: 'padded',
  },
};

export const RoundShape: Story = {
  args: {
    children: <Button.Text>사각 모양 버튼</Button.Text>,
    shape: 'square',
  },
};

export const Ghost: Story = {
  args: {
    children: <Button.Text>고스트 버튼</Button.Text>,
    variant: 'ghost',
  },
};

export const Toggle: Story = {
  render: function Render(args) {
    const [isActive, setIsActive] = useState(false);
    return (
      <Button
        {...args}
        variant="toggle"
        data-state={isActive ? 'active' : 'inactive'}
        onClick={() => setIsActive(!isActive)}
      >
        <Button.Text>토글 버튼</Button.Text>
      </Button>
    );
  },
};

export const Loading: Story = {
  args: {
    children: <Button.Text>로딩중</Button.Text>,
    isLoading: true,
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: <Button.Text>비활성화 버튼</Button.Text>,
    disabled: true,
  },
};

export const IconOnly: Story = {
  name: 'IconButton',
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton variant="outline" shape="round">
        <Trash2 />
      </IconButton>
      <IconButton variant="default" shape="round">
        <Plus />
      </IconButton>
    </div>
  ),
};

export const SnsIconShowcase: Story = {
  name: 'SNS Icon',
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton
        size="icon-xl"
        shape="round"
        className="bg-[#FEE500] text-black"
      >
        <MessageCircle />
      </IconButton>
      <IconButton
        size="icon-xl"
        shape="round"
        className="bg-white text-black border border-input"
      >
        <p className="font-bold text-2xl">G</p>
      </IconButton>
    </div>
  ),
};

export const Floating: Story = {
  name: 'Floating Button',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="relative h-screen w-full bg-gray-50 p-4">
      <p className="text-center">컨텐츠 영역</p>
      <p className="text-center text-gray-500">
        스크롤을 내려도 버튼은 우측에 고정됩니다.
      </p>
      <FloatingButton variant="default">
        <Plus />
      </FloatingButton>
    </div>
  ),
};

import React from 'react';
import { Loader2Icon, MessageCircle, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { GoogleIcon, KakaoIcon } from '@/components/Icons';

import { Button } from './Button';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  argTypes: {
    disabled: { control: 'boolean' },
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
      options: [
        'default',
        'destructive',
        'ghost',
        'link',
        'outline',
        'secondary',
        'toggle',
      ],
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
    children: '기본 버튼',
    shape: 'round',
    size: 'lg',
    variant: 'default',
  },
};

export const WithIcon: Story = {
  args: {
    size: 'lg',
    variant: 'default',
  },
  render: () => (
    <Button>
      <MessageCircle />
      아이콘과 함께
    </Button>
  ),
};

export const FullWidth: Story = {
  args: {
    children: '꽉 찬 너비 버튼',
    shape: 'round',
    size: 'full',
    variant: 'default',
  },
  parameters: {
    layout: 'padded',
  },
};

export const SquareShape: Story = {
  args: {
    children: '사각 모양 버튼',
    shape: 'square',
    size: 'lg',
    variant: 'default',
  },
};

export const Ghost: Story = {
  args: {
    children: '고스트 버튼',
    shape: 'round',
    size: 'lg',
    variant: 'ghost',
  },
};

export const Toggle: Story = {
  render: () => {
    return (
      <>
        <Button variant="toggle" data-state="active">
          토글 버튼(active)
        </Button>
        <Button variant="toggle" data-state="inactive">
          토글 버튼(inactive)
        </Button>
      </>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <Button disabled size="lg" variant="default" shape="round">
      <Loader2Icon className="animate-spin" /> 로딩중
    </Button>
  ),
};

export const Disabled: Story = {
  args: {
    children: '비활성화 버튼',
    disabled: true,
    shape: 'round',
    size: 'lg',
    variant: 'default',
  },
};

export const IconOnly: Story = {
  name: 'IconButton',
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="outline" shape="round" size="icon">
        <Trash2 />
      </Button>
      <Button variant="default" shape="round" size="icon">
        <Plus />
      </Button>
    </div>
  ),
};

export const SnsIconShowcase: Story = {
  name: 'SNS Icon',
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="icon-xl" shape="round" className="bg-[#FEE500]">
        <KakaoIcon size={28} />
      </Button>
      <Button
        size="icon-xl"
        shape="round"
        variant="outline"
        className="bg-white"
      >
        <GoogleIcon />
      </Button>
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
      <Button
        variant="default"
        shape="round"
        size="icon-xl"
        className="fixed bottom-4 right-4"
      >
        <Plus />
      </Button>
    </div>
  ),
};

export const LinkButton: Story = {
  render: () => (
    <Button variant="link" asChild>
      <Link href="/">링크버튼</Link>
    </Button>
  ),
};

export const Outline: Story = {
  args: {
    children: '아웃라인 버튼',
    shape: 'round',
    size: 'lg',
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    children: '세컨더리 버튼',
    shape: 'round',
    size: 'lg',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: '삭제 버튼',
    shape: 'round',
    size: 'lg',
    variant: 'destructive',
  },
};

export const Pressed: Story = {
  name: 'Pressed State',
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="default" size="lg" shape="round">
        일반 상태
      </Button>
      <Button
        variant="default"
        size="lg"
        shape="round"
        className="active:bg-primary-pressed"
      >
        눌린 상태 (클릭해보세요)
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Size Variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default" size="sm" shape="round">
        Small
      </Button>
      <Button variant="default" size="md" shape="round">
        Medium
      </Button>
      <Button variant="default" size="lg" shape="round">
        Large
      </Button>
    </div>
  ),
};

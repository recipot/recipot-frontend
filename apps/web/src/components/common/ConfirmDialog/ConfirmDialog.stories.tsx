import { useState } from 'react';

import { ConfirmDialog } from './ConfirmDialog';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Common/ConfirmDialog',
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

// open과 onOpenChange를 제외한 나머지 props만 args로 받음
type StoryArgs = Partial<
  Omit<React.ComponentProps<typeof ConfirmDialog>, 'open' | 'onOpenChange'>
>;
type Story = StoryObj<{ args: StoryArgs }>;

/**
 * 기본 확인 다이얼로그
 */
export const Default: Story = {
  args: {
    cancelText: '취소',
    confirmText: '확인',
    description: '작업을 진행하시겠습니까?',
    title: '확인',
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          다이얼로그 열기
        </button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

/**
 * 온보딩 복구 다이얼로그
 */
export const OnboardingRestore: Story = {
  args: {
    cancelText: '새로 시작',
    confirmText: '이어서 진행',
    description: (
      <>
        이전에 진행하던 온보딩이 있습니다.
        <br />
        이어서 진행하시겠습니까?
      </>
    ),
    disableOverlayClick: true,
    title: '이전 온보딩 데이터 발견',
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          다이얼로그 열기
        </button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

/**
 * 삭제 확인 다이얼로그
 */
export const Delete: Story = {
  args: {
    cancelText: '취소',
    confirmText: '삭제',
    confirmVariant: 'destructive',
    description: '이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?',
    onCancel: () => console.info('취소됨'),
    onConfirm: () => console.info('삭제됨'),
    title: '삭제 확인',
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-red-600 px-4 py-2 text-white"
        >
          삭제하기
        </button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

/**
 * 로그아웃 확인 다이얼로그
 */
export const Logout: Story = {
  args: {
    cancelText: '취소',
    confirmText: '로그아웃',
    description: '로그아웃 하시겠습니까?',
    onCancel: () => console.info('취소됨'),
    onConfirm: () => console.info('로그아웃됨'),
    title: '로그아웃',
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-gray-600 px-4 py-2 text-white"
        >
          로그아웃
        </button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

/**
 * 긴 설명이 있는 다이얼로그
 */
export const LongDescription: Story = {
  args: {
    cancelText: '취소',
    confirmText: '동의합니다',
    description: `이용약관에 동의하시겠습니까?

약관 동의 시 다음 사항에 동의하는 것으로 간주됩니다:
- 개인정보 수집 및 이용
- 서비스 이용약관
- 마케팅 정보 수신 (선택)`,
    title: '이용약관 동의',
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          다이얼로그 열기
        </button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

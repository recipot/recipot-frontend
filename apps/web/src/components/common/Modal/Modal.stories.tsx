import { useState } from 'react';

import { Button } from '@/components/common/Button/Button';

import { Modal } from './Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginRequiredModal = ({ onOpenChange, open }: ModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    title="로그인이 필요한 서비스입니다."
    description="로그인이 필요한 서비스입니다."
  >
    <div className="flex justify-center space-x-2">
      <Button
        className="w-full px-8 py-[0.938rem]"
        size="full"
        variant="outline"
      >
        취소
      </Button>
      <Button
        className="w-full px-8 py-[0.938rem]"
        size="full"
        variant="default"
      >
        로그인
      </Button>
    </div>
  </Modal>
);

const LeavePageWarningModal = ({ onOpenChange, open }: ModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    title="페이지 나가기"
    description={
      <>
        해당 페이지를 벗어나면
        <br />
        요리 진행이 중단 됩니다.
      </>
    }
  >
    <div className="space-y-4">
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          size="full"
          onClick={() => onOpenChange(false)}
        >
          확인
        </Button>
        <Button variant="default" size="full">
          취소
        </Button>
      </div>
    </div>
  </Modal>
);

const meta = {
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Common/Modal',
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const LoginRequiredStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        좋아요 버튼
      </Button>
      <LoginRequiredModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const LoginRequired: Story = {
  args: {
    children: <div>Example children</div>,
    description: '로그인이 필요한 서비스입니다.',
    onOpenChange: () => {},
    open: false,
    title: '로그인이 필요한 서비스입니다.',
  },
  render: () => <LoginRequiredStory />,
};

const LeavePageWarningStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        페이지 나가기
      </Button>
      <LeavePageWarningModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const LeavePageWarning: Story = {
  args: {
    children: <div>Example children</div>,
    description: (
      <>
        해당 페이지를 벗어나면
        <br />
        요리 진행이 중단 됩니다.
      </>
    ),
    onOpenChange: () => {},
    open: false,
    title: '페이지 나가기',
  },
  render: () => <LeavePageWarningStory />,
};

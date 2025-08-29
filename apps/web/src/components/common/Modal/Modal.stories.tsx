import { useState } from 'react';

import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareRecipeModal = ({ onOpenChange, open }: ModalProps) => {
  const handleCopyClick = () => {
    onOpenChange(false);
    navigator.clipboard.writeText('https://recipot.com/recipes/12345');
  };
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="해당 레시피를 공유해보세요."
    >
      <div className="space-y-4 flex justify-center">
        <Button onClick={handleCopyClick} size="lg" variant="default">
          복사하기
        </Button>
      </div>
    </Modal>
  );
};

const LoginRequiredModal = ({ onOpenChange, open }: ModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    title="로그인이 필요한 서비스입니다."
  >
    <div className="space-y-4">
      <div className="pt-2 flex justify-center space-x-2">
        <Button className="w-full" variant="outline">
          취소
        </Button>
        <Button className="w-full" variant="default">
          로그인하기
        </Button>
      </div>
    </div>
  </Modal>
);

const LeavePageWarningModal = ({ onOpenChange, open }: ModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    title={
      <>
        해당 페이지를 벗어나면
        <br />
        요리 진행이 중단 됩니다.
      </>
    }
  >
    <div className="space-y-4">
      <div className="flex justify-center space-x-2 pt-2">
        <Button variant="default" onClick={() => onOpenChange(false)}>
          확인
        </Button>
        <Button variant="outline">취소</Button>
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

const ShareRecipeStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>레시피 공유 모달 열기</Button>
      <ShareRecipeModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const ShareRecipe: Story = {
  render: () => <ShareRecipeStory />,
};

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
  render: () => <LeavePageWarningStory />,
};

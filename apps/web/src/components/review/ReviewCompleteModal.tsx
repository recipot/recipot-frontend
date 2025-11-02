import React from 'react';

import { Button } from '../common/Button';
import { Modal } from '../common/Modal/Modal';

interface ReviewCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

const ReviewCompleteModal = ({
  onConfirm,
  onOpenChange,
  open,
}: ReviewCompleteModalProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="후기 등록 완료"
      description="후기 등록이 완료되었습니다."
    >
      <div className="flex justify-center">
        <Button variant="default" size="full" onClick={handleConfirm}>
          확인
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewCompleteModal;

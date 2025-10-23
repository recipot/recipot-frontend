'use client';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WarningModal({
  isOpen,
  onClose,
  onConfirm,
}: WarningModalProps) {
  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
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
          <Button variant="outline" size="full" onClick={onClose}>
            확인
          </Button>
          <Button
            variant="default"
            size="full"
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}

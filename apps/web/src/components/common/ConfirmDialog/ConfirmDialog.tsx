import React from 'react';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';

export interface ConfirmDialogProps {
  /**
   * 취소 버튼 텍스트
   * @default '취소'
   */
  cancelText?: string;
  /**
   * 확인 버튼 텍스트
   * @default '확인'
   */
  confirmText?: string;
  /**
   * 확인 버튼 variant
   * @default 'default'
   */
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /**
   * 다이얼로그 설명
   */
  description?: string | React.ReactNode;
  /**
   * 오버레이 클릭 시 닫기 비활성화
   * @default false
   */
  disableOverlayClick?: boolean;
  /**
   * 취소 버튼 클릭 핸들러
   */
  onCancel?: () => void;
  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm?: () => void;
  /**
   * 다이얼로그 열림 상태 변경 핸들러
   */
  onOpenChange: (open: boolean) => void;
  /**
   * 다이얼로그 열림 상태
   */
  open: boolean;
  /**
   * 다이얼로그 제목
   */
  title?: string;
}

/**
 * 확인 다이얼로그 컴포넌트
 *
 * 사용자에게 확인/취소 선택을 요구하는 다이얼로그입니다.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="데이터 삭제"
 *   description="정말로 삭제하시겠습니까?"
 *   cancelText="취소"
 *   confirmText="삭제"
 *   confirmVariant="destructive"
 *   onCancel={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export function ConfirmDialog({
  cancelText = '취소',
  confirmText = '확인',
  confirmVariant = 'default',
  description,
  disableOverlayClick = false,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Modal
      contentGap={24}
      description={description}
      disableOverlayClick={disableOverlayClick}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
    >
      <div className="flex w-full gap-2">
        <Button onClick={handleCancel} size="full" variant="outline">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} size="full" variant={confirmVariant}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';

interface LoginRequiredModalProps {
  description: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

/**
 * 로그인이 필요한 경우 표시하는 공통 모달 컴포넌트
 *
 * @param description - 모달에 표시할 설명 텍스트
 * @param open - 모달 열림/닫힘 상태
 * @param onOpenChange - 모달 상태 변경 핸들러
 */
export function LoginRequiredModal({
  description,
  onOpenChange,
  open,
}: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/signin');
  };

  return (
    <Modal
      description={description}
      onOpenChange={onOpenChange}
      open={open}
      title="로그인이 필요합니다."
    >
      <Button onClick={handleLogin} size="full" variant="default">
        로그인
      </Button>
    </Modal>
  );
}


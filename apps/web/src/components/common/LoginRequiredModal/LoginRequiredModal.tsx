'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

/**
 * 전역 로그인 필요 모달 컴포넌트.
 * 이 컴포넌트는 앱의 최상위 레벨 (e.g., layout.tsx)에 한 번만 렌더링되어야 합니다.
 * useLoginModalStore를 통해 어디서든 모달을 열 수 있습니다.
 */
export function LoginRequiredModal() {
  const router = useRouter();
  const { isOpen, closeModal } = useLoginModalStore();

  const handleLogin = () => {
    closeModal(); // 로그인 버튼 클릭 시 모달을 닫고
    router.push('/signin'); // 로그인 페이지로 이동
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={closeModal}
      title="로그인이 필요한 서비스입니다."
      description="로그인이 필요한 서비스입니다."
    >
      <Button onClick={handleLogin} size="full" variant="default">
        로그인
      </Button>
    </Modal>
  );
}

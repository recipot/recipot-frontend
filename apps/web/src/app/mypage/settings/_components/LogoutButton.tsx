'use client';

import { useState } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';

const LOGOUT_DESCRIPTION =
  '정말로 로그아웃 하시겠습니까?\n로그아웃 후, 서비스 이용 시 재로그인이 필요합니다.';

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setIsModalOpen(false);
      router.push('/signin');
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 에러가 발생해도 로그인 페이지로 이동
      router.push('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <footer className="p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-16 w-full text-center text-[#ADB5BD] underline decoration-[#ADB5BD] decoration-solid underline-offset-4"
        >
          로그아웃
        </button>
      </footer>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        description={LOGOUT_DESCRIPTION}
      >
        <div className="flex items-center justify-end gap-[0.375rem]">
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-14 h-[2.125rem] border border-[#747474] bg-white px-[0.9375rem] py-3 text-black disabled:opacity-50"
            shape="square"
          >
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
            className="text-14b h-[2.125rem] bg-[#747474] px-4 py-3 text-white disabled:opacity-50"
            shape="square"
          >
            닫기
          </Button>
        </div>
      </Modal>
    </>
  );
}

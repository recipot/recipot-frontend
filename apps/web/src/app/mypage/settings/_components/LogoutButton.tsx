'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃 처리');
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className="p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-16 w-full text-center text-neutral-600 underline decoration-solid underline-offset-4"
        >
          로그아웃
        </button>
      </footer>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        description={
          <>
            정말로 로그아웃 하시겠습니까?
            <br />
            로그아웃 후, 서비스 이용 시 재로그인이 필요합니다.
          </>
        }
      >
        <div className="flex items-center justify-end gap-[0.375rem]">
          <Button
            onClick={handleLogout}
            className="text-14 h-[2.125rem] border border-[#747474] bg-white px-[0.9375rem] py-3 text-black"
            shape="square"
          >
            로그아웃
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            className="text-14b h-[2.125rem] bg-[#747474] px-4 py-3 text-white"
            shape="square"
          >
            닫기
          </Button>
        </div>
      </Modal>
    </>
  );
}

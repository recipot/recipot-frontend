import { useMemo, useState } from 'react';

import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';

interface AuthButtonsProps {
  activeIndex: number;
  googleLogin?: () => void;
  kakaoLogin?: () => void;
}

export function AuthButtons({ activeIndex }: AuthButtonsProps) {
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  const maintenanceDescription = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <p>긴급 점검 중입니다.</p>
        <p>이용에 불편을 드려 죄송합니다.</p>
        <p className="mt-2 text-sm text-gray-500">2026.01.21 03:35 ~ 22:00</p>
      </div>
    ),
    []
  );

  const handleLoginClick = () => {
    setIsMaintenanceModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMaintenanceModalOpen(false);
  };
  // 첫 번째 슬라이드(index 0)일 때는 #3D2A58, 아닐 때는 #FFEFC7
  const containerStyle = useMemo(() => {
    const isFirstSlide = activeIndex === 0;
    const baseColor = isFirstSlide ? '#3D2A58' : '#FFEFC7';
    return {
      background: `linear-gradient(to bottom, transparent 0%, ${baseColor} 10%, ${baseColor} 100%)`,
    };
  }, [activeIndex]);

  return (
    <div
      className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 px-6 pt-[36px] pb-[calc(10px+env(safe-area-inset-bottom))]"
      style={containerStyle}
    >
      <Button
        size="full"
        shape="round"
        className="bg-kakao active:bg-kakao-pressed text-gray-900"
        onClick={handleLoginClick}
      >
        <KakaoIcon size={28} />
        카카오로 시작하기
      </Button>
      <Button
        size="full"
        shape="round"
        variant="outline"
        className="bg-white"
        onClick={handleLoginClick}
      >
        <GoogleIcon />
        Google로 시작하기
      </Button>

      <Modal
        open={isMaintenanceModalOpen}
        onOpenChange={setIsMaintenanceModalOpen}
        title="점검 안내"
        titleBlock
        description={maintenanceDescription}
      >
        <Button size="full" shape="round" onClick={handleCloseModal}>
          확인
        </Button>
      </Modal>
    </div>
  );
}

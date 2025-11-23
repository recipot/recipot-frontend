'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';
import type { ProfileSectionProps } from '@recipot/types';
import { useAuth } from '@recipot/contexts';

type ProviderType = 'kakao' | 'google';

const PROVIDER_LABEL: Record<ProviderType, string> = {
  kakao: '카카오',
  google: '구글',
};

export default function SnsLinkageSection({ user }: ProfileSectionProps) {
  const { login: kakaoLogin, googleLogin, logout } = useAuth();
  const isKakaoLinked = user.platform === 'kakao';
  const isGoogleLinked = user.platform === 'google';
  const [pendingProvider, setPendingProvider] = useState<ProviderType | null>(
    null
  );
  const isDialogOpen = pendingProvider !== null;
  const targetProviderLabel = pendingProvider
    ? PROVIDER_LABEL[pendingProvider]
    : '';

  const handleProviderSelect = (provider: ProviderType) => {
    setPendingProvider(provider);
  };

  const handleConfirm = () => {
    if (!pendingProvider) return;

    logout();

    if (pendingProvider === 'kakao') {
      void kakaoLogin();
    } else {
      void googleLogin();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPendingProvider(null);
    }
  };

  return (
    <>
      <section className="py-6">
        <div className="flex items-center justify-between gap-10">
          <div>
            <h2 className="text-18sb text-gray-900">SNS 연동</h2>
            <span className="text-16 text-[#7A8394]">
              간편 로그인 수단 추가
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="icon-xl"
              shape="round"
              className="bg-kakao"
              disabled={isKakaoLinked}
              onClick={() => handleProviderSelect('kakao')}
            >
              <KakaoIcon
                size={28}
                color={isKakaoLinked ? '#9CA3AF' : '#000000'}
              />
            </Button>
            <Button
              size="icon-xl"
              shape="round"
              variant="outline"
              disabled={isGoogleLinked}
              onClick={() => handleProviderSelect('google')}
            >
              <GoogleIcon
                size={28}
                className={
                  isGoogleLinked ? 'border-none opacity-50 grayscale' : ''
                }
              />
            </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        title="간편 로그인 변경"
        description={`로그아웃하고 ${targetProviderLabel} 로그인 하시겠습니까?`}
        onConfirm={handleConfirm}
      />
    </>
  );
}

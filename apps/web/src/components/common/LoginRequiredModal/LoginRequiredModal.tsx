'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAuth } from '@recipot/contexts';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { CloseIcon, GoogleIcon, KakaoIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

import Logo from '../../../../public/img-splash.png';

export function LoginRequiredModal() {
  const { closeModal, isOpen } = useLoginModalStore();
  const { googleLogin, login } = useAuth();

  const handleKakaoLogin = () => {
    closeModal();
    login();
  };

  const handleGoogleLogin = () => {
    closeModal();
    googleLogin();
  };

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && closeModal()}>
      <DrawerContent className="mx-auto flex w-full flex-col pb-8">
        <VisuallyHidden asChild>
          <DrawerTitle>로그인</DrawerTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DrawerDescription>
            로그인하면 레시피를 저장할 수 있고 추천이 더 정확해져요!
          </DrawerDescription>
        </VisuallyHidden>

        <div className="flex justify-end">
          <DrawerClose asChild>
            <button type="button" className="rounded-full p-1.5">
              <CloseIcon size={24} />
            </button>
          </DrawerClose>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2 pb-8">
          <Image
            src={Logo}
            alt="레시팟 마스코트"
            width={152}
            height={152}
            className="object-contain"
          />
          <div className="text-22sb w-full px-[10px] text-center text-gray-900">
            로그인하면 레시피를 저장할 수 있고
            <br />
            추천이 더 정확해져요!
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6">
          <Button
            onClick={handleKakaoLogin}
            size="full"
            className="bg-kakao active:bg-kakao-pressed text-gray-900"
          >
            <KakaoIcon />
            <span className="ml-2">카카오로 시작하기</span>
          </Button>
          <Button
            onClick={handleGoogleLogin}
            size="full"
            variant="outline"
            className="bg-white"
          >
            <GoogleIcon />
            <span className="ml-2">Google로 시작하기</span>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';

const CONTACT_URL = 'https://slashpage.com/hankki/qpv5x427xr9e1mkyn3dw?e=1';

export function ApiErrorModal() {
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);
  const { code, hide, isOpen, message } = useApiErrorModalStore();
  const closeHandledRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      closeHandledRef.current = false;
    }
  }, [isOpen]);

  const description = useMemo(
    () => (
      <div className="space-y-3">
        <p className="text-base whitespace-pre-line text-gray-700">{message}</p>
        {code ? (
          <p className="text-sm text-gray-400">에러 코드: {code}</p>
        ) : null}
      </div>
    ),
    [code, message]
  );

  const clearSessionAndRedirect = useCallback(() => {
    if (closeHandledRef.current) {
      return;
    }
    closeHandledRef.current = true;

    hide();
    logout();

    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }

      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear sessionStorage:', error);
      }
    }

    router.replace('/signin');
  }, [hide, logout, router]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        clearSessionAndRedirect();
      }
    },
    [clearSessionAndRedirect]
  );

  const handleClose = useCallback(() => {
    clearSessionAndRedirect();
  }, [clearSessionAndRedirect]);

  const handleContact = useCallback(() => {
    if (CONTACT_URL.startsWith('mailto:')) {
      window.location.href = CONTACT_URL;
    } else {
      window.open(CONTACT_URL, '_blank', 'noopener,noreferrer');
    }

    clearSessionAndRedirect();
  }, [clearSessionAndRedirect]);

  return (
    <Modal
      contentGap={24}
      description={description}
      disableOverlayClick
      onOpenChange={handleOpenChange}
      open={isOpen}
      title="오류가 발생했어요"
    >
      <div className="flex w-full gap-2">
        <Button onClick={handleContact} size="full" variant="outline">
          문의하기
        </Button>
        <Button onClick={handleClose} size="full">
          닫기
        </Button>
      </div>
    </Modal>
  );
}

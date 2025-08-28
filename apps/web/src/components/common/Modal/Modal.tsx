import React, { useEffect } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { ComponentPropsWithoutRef } from 'react';

export interface ModalProps extends ComponentPropsWithoutRef<typeof Dialog> {
  title?: string | React.ReactNode;
  disableOverlayClick?: boolean;
}

export function Modal({
  children,
  disableOverlayClick = false,
  onOpenChange,
  title,
  ...props
}: ModalProps) {
  const lockBodyScroll = (lock: boolean) => {
    const html = document.documentElement;
    const { body } = document;
    if (lock) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.overscrollBehavior = 'contain';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.overscrollBehavior = '';
    }
  };

  const handleOpenChange = (open: boolean) => {
    lockBodyScroll(open);
    if (onOpenChange) onOpenChange(open);
  };

  useEffect(() => {
    const initiallyOpen = props.open;
    if (initiallyOpen) lockBodyScroll(true);
    return () => lockBodyScroll(false);
  }, [props.open]);

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (disableOverlayClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} {...props}>
      <DialogPortal>
        <DialogOverlay
          className="fixed inset-0 z-50 bg-gray-300 backdrop-blur-sm"
          onClick={handleOverlayClick}
        />
        <DialogContent
          className={cn(
            'flex flex-col justify-center items-center gap-[30px] border bg-background px-5 pb-5 pt-[1.875rem] w-xs rounded-3xl'
          )}
        >
          <div className="text-center w-[17.5rem]">
            <h2 className="text-17">{title}</h2>
          </div>

          <div className="py-1 text-17 font-pretendard">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// export { Dialog as ModalRoot };
// export { DialogTrigger as ModalTrigger };
// export { DialogClose as ModalClose };

import React, { useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import type { ComponentPropsWithoutRef } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';

export interface ModalProps extends ComponentPropsWithoutRef<typeof Dialog> {
  title?: string;
  description?: string;
  disableOverlayClick?: boolean;
}

export function Modal({
  children,
  disableOverlayClick = false,
  onOpenChange,
  description,
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
            'flex flex-col w-[20rem] justify-center items-center gap-[30px] border bg-background px-5 py-5 rounded-3xl'
          )}
        >
          <DialogHeader className="text-center">
            {title && (
              <VisuallyHidden asChild>
                <DialogTitle className="text-17">{title}</DialogTitle>
              </VisuallyHidden>
            )}
            {description ? (
              <DialogDescription className="text-17">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="py-1 text-17 font-pretendard">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

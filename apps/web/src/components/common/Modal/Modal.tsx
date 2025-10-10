import React from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { ComponentPropsWithoutRef } from 'react';

export interface ModalProps extends ComponentPropsWithoutRef<typeof Dialog> {
  title?: string;
  description?: string | React.ReactNode;
  disableOverlayClick?: boolean;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

export function Modal({
  children,
  description,
  disableOverlayClick = false,
  onOpenChange,
  title,
  ...props
}: ModalProps) {
  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (disableOverlayClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogPortal>
        <DialogOverlay
          onPointerDown={handleOverlayClick}
          className="fixed inset-0 z-50 bg-gray-300 backdrop-blur-sm"
        />
        <DialogContent
          className={cn(
            'bg-background flex w-[20rem] flex-col items-center justify-center gap-[30px] rounded-3xl border px-5 pt-[30px] max-[320px]:w-[18rem]'
          )}
        >
          <DialogHeader
            className={cn('text-center', title ? 'space-y-1.2' : 'space-y-0')}
          >
            <VisuallyHidden asChild>
              <DialogTitle className="text-17">{title}</DialogTitle>
            </VisuallyHidden>

            {description ? (
              <DialogDescription className="text-17">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="text-17 w-full">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

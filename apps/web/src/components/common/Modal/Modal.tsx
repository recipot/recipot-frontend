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

import type { ModalProps as ComponentModalProps } from './types';

export interface ModalProps
  extends Pick<ComponentModalProps, 'open' | 'onOpenChange'> {
  title?: string;
  description?: string | React.ReactNode;
  disableOverlayClick?: boolean;
  contentGap?: number;
  children: React.ReactNode;
}

export function Modal({
  children,
  contentGap,
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
          className="bg-background flex w-[17.5rem] flex-col items-center justify-center gap-[var(--modal-gap)] rounded-3xl border"
          style={
            {
              ...(contentGap && { '--modal-gap': `${contentGap}px` }),
              boxShadow: 'var(--modal-shadow)',
            } as React.CSSProperties
          }
        >
          <DialogHeader
            className={cn('text-center', title ? 'space-y-1.2' : 'space-y-0')}
          >
            <VisuallyHidden asChild>
              <DialogTitle className="text-base">{title}</DialogTitle>
            </VisuallyHidden>

            {description ? (
              <DialogDescription className="text-center text-base whitespace-pre-line">
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

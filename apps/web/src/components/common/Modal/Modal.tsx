import React from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disableOverlayClick: _disableOverlayClick,
  onOpenChange,
  title,
  ...props
}: ModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        className="bg-background flex w-[17.5rem] flex-col items-center justify-center gap-[var(--modal-gap)] rounded-3xl border"
        showOverlay
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
    </Dialog>
  );
}

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
  className?: string;
  textAlign?: 'center' | 'left';
  titleBlock?: boolean;
}

export function Modal({
  children,
  className,
  contentGap,
  description,
  disableOverlayClick: _disableOverlayClick,
  onOpenChange,
  textAlign = 'center',
  title,
  titleBlock = false,
  ...props
}: ModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        className={cn(
          'bg-background flex w-[17.5rem] flex-col items-center justify-center gap-[var(--modal-gap)] rounded-3xl border',
          className
        )}
        showOverlay
        style={
          {
            ...(contentGap && { '--modal-gap': `${contentGap}px` }),
            boxShadow: 'var(--modal-shadow)',
          } as React.CSSProperties
        }
      >
        <DialogHeader
          className={cn('text-center', title ? 'space-y-2' : 'space-y-0')}
        >
          {titleBlock === true ? (
            <DialogTitle
              className={cn(
                'text-20 text-[#212529]',
                textAlign === 'left' && 'text-left'
              )}
            >
              {title}
            </DialogTitle>
          ) : (
            <VisuallyHidden asChild>
              <DialogTitle className="text-base">{title}</DialogTitle>
            </VisuallyHidden>
          )}
          {description ? (
            <DialogDescription asChild>
              {typeof description === 'string' ? (
                <p
                  className={cn(
                    'text-center text-base whitespace-pre-line',
                    textAlign === 'left' && 'text-left'
                  )}
                >
                  {description}
                </p>
              ) : (
                <div
                  className={cn(
                    'text-center text-base whitespace-pre-line',
                    textAlign === 'left' && 'text-left'
                  )}
                >
                  {description}
                </div>
              )}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="text-17 w-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

import React from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { CloseIcon } from '@/components/Icons';
import {
  Dialog,
  DialogClose,
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
  disableCloseButton?: boolean;
  contentGap?: number;
  children: React.ReactNode;
  className?: string;
  textAlign?: 'center' | 'left';
  titleBlock?: boolean;
  showDefaultCloseButton?: boolean;
}

export function Modal({
  children,
  className,
  contentGap,
  description,
  disableCloseButton = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disableOverlayClick: _disableOverlayClick,
  onOpenChange,
  showDefaultCloseButton = false,
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
          // DialogContent의 기본 X 버튼 숨기기 (showDefaultCloseButton이 true가 아닐 때만)
          !showDefaultCloseButton && '[&>button:last-child]:hidden',
          className
        )}
        showCloseButton={showDefaultCloseButton}
        onInteractOutside={e => {
          if (disableCloseButton) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={e => {
          if (disableCloseButton) {
            e.preventDefault();
          }
        }}
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

        {!disableCloseButton && !showDefaultCloseButton && (
          <DialogClose
            className="focus:ring-ring absolute top-4 right-4 rounded-full p-1.5 transition-opacity hover:opacity-70 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="모달 닫기"
          >
            <CloseIcon size={24} color="#626A7A" />
            <span className="sr-only">닫기</span>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
}

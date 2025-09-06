import React from 'react';

import { CloseIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export interface BottomSheetProps {
  /** 바텀시트 열림/닫힘 상태 */
  open: boolean;
  /** 바텀시트 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** 바텀시트 제목 */
  title?: string;
  /** 바텀시트 설명 */
  description?: string | React.ReactNode;
  /** 바텀시트 내용 */
  children: React.ReactNode;
  /** 바텀시트 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 바텀시트 높이 (커스텀) */
  height?: string;
  /** 닫기 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 커스텀 닫기 버튼 */
  customCloseButton?: React.ReactNode;
  /** 커스텀 헤더 */
  customHeader?: React.ReactNode;
  /** 커스텀 푸터 */
  customFooter?: React.ReactNode;
  /** 헤더 고정 여부 */
  stickyHeader?: boolean;
  /** 푸터 고정 여부 */
  stickyFooter?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

export function BottomSheet({
  children,
  className,
  customCloseButton,
  customFooter,
  customHeader,
  description,
  height,
  hideCloseButton = false,
  onOpenChange,
  open,
  size = 'md',
  stickyFooter = false,
  stickyHeader = false,
  title,
}: BottomSheetProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby="review-bottomsheet"
    >
      <DrawerContent
        aria-describedby={undefined}
        className={cn(
          `mx-auto w-full`,
          // 사이즈별 최대 너비 설정
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-sm sm:max-w-lg',
          size === 'lg' && 'max-w-sm sm:max-w-lg md:max-w-2xl',
          size === 'xl' && 'max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl',
          size === 'full' && 'w-full',
          // 커스텀 높이
          height && `h-[${height}]`,
          className
        )}
      >
        <DrawerHeader
          className={cn(stickyHeader && 'bg-background sticky top-0 z-10')}
        >
          {customHeader ?? (
            <>
              {title && (
                <DrawerTitle className="text-lg font-semibold">
                  {title}
                </DrawerTitle>
              )}
              {description && (
                <div className="text-muted-foreground text-sm">
                  {description}
                </div>
              )}
            </>
          )}
        </DrawerHeader>

        {!hideCloseButton && (
          <DrawerClose className="absolute top-4 right-5">
            {customCloseButton ?? <CloseIcon />}
          </DrawerClose>
        )}

        <div className="flex-1 overflow-auto">{children}</div>

        {customFooter && (
          <div
            className={cn(
              'border-border/50 bg-background border-t p-6',
              stickyFooter && 'sticky bottom-0 z-10'
            )}
          >
            {customFooter}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default BottomSheet;

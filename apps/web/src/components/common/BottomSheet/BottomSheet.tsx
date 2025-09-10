import React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  description?: string;
  /** 바텀시트 내용 */
  children: React.ReactNode;
}

export function BottomSheet({
  children,
  onOpenChange,
  open,
}: BottomSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-describedby={undefined}
        className={cn(`mx-auto w-full`)}
      >
        <VisuallyHidden>
          <DrawerTitle>바텀시트</DrawerTitle>
        </VisuallyHidden>
        <DrawerHeader />
        <DrawerClose className="absolute top-4 right-5" aria-label="닫기">
          <CloseIcon />
        </DrawerClose>

        <div className="flex flex-1 flex-col overflow-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

export default BottomSheet;

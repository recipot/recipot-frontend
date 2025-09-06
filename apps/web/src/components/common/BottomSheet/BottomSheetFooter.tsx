import React from 'react';

import { DrawerFooter } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export interface BottomSheetFooterProps {
  /** 푸터 내용 */
  children: React.ReactNode;
  /** 푸터 클래스명 */
  className?: string;
}

export function BottomSheetFooter({
  children,
  className,
}: BottomSheetFooterProps) {
  return (
    <DrawerFooter
      className={cn(
        'border-t border-border/50 bg-background',
        className
      )}
    >
      {children}
    </DrawerFooter>
  );
}

export default BottomSheetFooter;

import React from 'react';

import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export interface BottomSheetHeaderProps {
  /** 헤더 제목 */
  title?: string;
  /** 헤더 설명 */
  description?: string | React.ReactNode;
  /** 커스텀 헤더 내용 */
  children?: React.ReactNode;
  /** 헤더 클래스명 */
  className?: string;
}

export function BottomSheetHeader({
  title,
  description,
  children,
  className,
}: BottomSheetHeaderProps) {
  if (children) {
    return (
      <DrawerHeader className={cn('border-b border-border/50', className)}>
        {children}
      </DrawerHeader>
    );
  }

  return (
    <DrawerHeader className={cn('border-b border-border/50', className)}>
      {title && (
        <DrawerTitle className="text-lg font-semibold">
          {title}
        </DrawerTitle>
      )}
      {description && (
        <DrawerDescription className="text-sm text-muted-foreground">
          {description}
        </DrawerDescription>
      )}
    </DrawerHeader>
  );
}

export default BottomSheetHeader;

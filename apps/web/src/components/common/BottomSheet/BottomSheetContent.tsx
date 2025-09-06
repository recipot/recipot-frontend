import React from 'react';

import { cn } from '@/lib/utils';

export interface BottomSheetContentProps {
  /** 컨텐츠 내용 */
  children: React.ReactNode;
  /** 컨텐츠 클래스명 */
  className?: string;
  /** 스크롤 가능 여부 */
  scrollable?: boolean;
}

export function BottomSheetContent({
  children,
  className,
  scrollable = true,
}: BottomSheetContentProps) {
  return (
    <div
      className={cn(
        'flex-1',
        scrollable && 'overflow-y-auto',
        'p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export default BottomSheetContent;

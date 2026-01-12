'use client';

import { cn } from '@/lib/utils';

interface ABCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A/B 테스트 B안 카드 컨테이너
 * border-gradient와 rounded corners (40px) 스타일이 적용된 컨테이너
 */
export default function ABCardContainer({
  children,
  className,
}: ABCardContainerProps) {
  return (
    <div className={cn('ab-card-container flex-1 overflow-hidden', className)}>
      <div className="relative z-1 flex h-full min-h-0 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

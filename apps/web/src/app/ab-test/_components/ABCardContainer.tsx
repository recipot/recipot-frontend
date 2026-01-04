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
    <div className={cn('ab-card-container flex-1', className)}>
      <div className="relative z-1 flex min-h-[calc(100vh-250px)] flex-col">
        {children}
      </div>
    </div>
  );
}

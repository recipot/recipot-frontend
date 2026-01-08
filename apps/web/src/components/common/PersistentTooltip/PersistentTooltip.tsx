'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { PersistentTooltipProps } from './PersistentTooltip.types';

/**
 * 항상 표시되는 툴팁 컴포넌트
 * 일반 툴팁과 달리 호버 없이도 항상 보이는 상태를 유지합니다.
 * CSS border 기반 화살표로 커스텀이 용이합니다.
 */
export function PersistentTooltip({
  align = 'start',
  children,
  className,
  content,
  showArrow = true,
  side = 'top',
  sideOffset = 8,
}: PersistentTooltipProps) {
  // side에 따른 화살표 위치 스타일
  const arrowPositionStyles = {
    bottom:
      'top-0 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-gray-700',
    left: 'right-0 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-gray-700',
    right:
      'left-0 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-gray-700',
    top: 'bottom-0 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-gray-700',
  };

  // align에 따른 화살표 정렬 스타일
  const arrowAlignStyles = {
    bottom: {
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-3',
      start: 'left-3',
    },
    left: {
      center: 'top-1/2 -translate-y-1/2',
      end: 'bottom-2',
      start: 'top-2',
    },
    right: {
      center: 'top-1/2 -translate-y-1/2',
      end: 'bottom-2',
      start: 'top-2',
    },
    top: {
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-3',
      start: 'left-3',
    },
  };

  return (
    <Tooltip open>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'text-13r relative z-50 rounded-lg bg-gray-700 px-3 py-2 text-white',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {content}
        {showArrow && (
          <span
            className={cn(
              'absolute h-0 w-0 border-[6px] border-solid',
              arrowPositionStyles[side],
              arrowAlignStyles[side][align]
            )}
            aria-hidden="true"
          />
        )}
      </TooltipContent>
    </Tooltip>
  );
}

import type { ReactNode } from 'react';

export interface PersistentTooltipProps {
  /** 툴팁 내용 */
  content: ReactNode;
  /** 툴팁을 트리거하는 요소 */
  children: ReactNode;
  /** 툴팁 위치 (기본: top) */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** 트리거 기준 정렬 (기본: start) */
  align?: 'start' | 'center' | 'end';
  /** 트리거와의 간격 (기본: 8) */
  sideOffset?: number;
  /** 화살표 표시 여부 (기본: true) */
  showArrow?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

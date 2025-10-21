import type { ReactNode } from 'react';

interface HeaderActionProps {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * Header의 액션 버튼
 * @param children - 아이콘 또는 컴포넌트
 * @param onClick - 클릭 핸들러
 * @param ariaLabel - 접근성 라벨
 * @param className - 추가 스타일
 */
export function HeaderAction({
  ariaLabel = '액션 버튼',
  children,
  className = '',
  onClick,
}: HeaderActionProps) {
  return (
    <button
      className={`flex size-10 items-center justify-center ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

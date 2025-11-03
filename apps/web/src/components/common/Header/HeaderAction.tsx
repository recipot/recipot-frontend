import type { ReactNode } from 'react';

interface HeaderActionProps {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel: NonNullable<React.ComponentProps<'button'>['aria-label']>;
  className?: string;
  disabled?: boolean;
}

/**
 * Header의 액션 버튼
 * @param children - 아이콘 또는 컴포넌트
 * @param onClick - 클릭 핸들러
 * @param ariaLabel - 접근성 라벨
 * @param className - 추가 스타일
 * @param disabled - 비활성화 여부
 */
export function HeaderAction({
  ariaLabel = '액션 버튼',
  children,
  className = '',
  disabled = false,
  onClick,
}: HeaderActionProps) {
  return (
    <button
      className={`flex size-10 items-center justify-center ${
        disabled ? 'cursor-not-allowed text-gray-500' : ''
      } ${className}`}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

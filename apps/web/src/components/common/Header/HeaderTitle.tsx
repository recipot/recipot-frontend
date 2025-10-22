import type { ReactNode } from 'react';

interface HeaderTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * Header의 타이틀
 * @param children - 타이틀 텍스트 또는 컴포넌트
 * @param className - 추가 스타일
 */
export function HeaderTitle({ children, className = '' }: HeaderTitleProps) {
  return (
    <h1 className={`text-18sb flex-1 text-gray-900 ${className}`}>
      {children}
    </h1>
  );
}

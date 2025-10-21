import type { ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Fixed Header 컴포넌트 (Root)
 * @example
 * <Header>
 *   <Header.Back />
 *   <Header.Action><RefreshIcon /></Header.Action>
 * </Header>
 */
export function Header({ children, className = '' }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 right-0 left-0 z-10 flex h-14 items-center justify-between bg-white px-3 py-2 ${className}`}
    >
      {children}
    </header>
  );
}

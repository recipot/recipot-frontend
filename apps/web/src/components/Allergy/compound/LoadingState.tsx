'use client';

import { useAllergyContext } from '../context/AllergyContext';

import type { ReactNode } from 'react';

interface AllergyLoadingStateProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Allergy.LoadingState
 * 로딩 상태 표시 컴포넌트
 *
 * @param children - 커스텀 로딩 UI (선택)
 * @param className - 추가 스타일
 */
export default function AllergyLoadingState({
  children,
  className = '',
}: AllergyLoadingStateProps) {
  const { isLoading } = useAllergyContext();

  if (!isLoading) return null;

  if (children) {
    return <>{children}</>;
  }

  return (
    <div className={`flex justify-center py-10 ${className}`}>
      <div className="text-lg text-gray-600">재료 목록을 불러오는 중...</div>
    </div>
  );
}

'use client';

import { Button } from '@/components/common/Button';

import { useAllergyContext } from '../context/AllergyContext';

import type { ReactNode } from 'react';

interface AllergyErrorStateProps {
  children?: ReactNode;
  className?: string;
  onRetry?: () => void;
}

/**
 * Allergy.ErrorState
 * 에러 상태 표시 컴포넌트
 *
 * @param children - 커스텀 에러 UI (선택)
 * @param className - 추가 스타일
 * @param onRetry - 재시도 핸들러 (기본: 페이지 새로고침)
 */
export default function AllergyErrorState({
  children,
  className = '',
  onRetry,
}: AllergyErrorStateProps) {
  const { error } = useAllergyContext();

  if (!error) return null;

  if (children) {
    return children;
  }

  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-10 ${className}`}
    >
      <div className="text-lg text-red-600">
        재료 목록을 불러오는데 실패했습니다.
      </div>
      <Button onClick={handleRetry}>다시 시도</Button>
    </div>
  );
}

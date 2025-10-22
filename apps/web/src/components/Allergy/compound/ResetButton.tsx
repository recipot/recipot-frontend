'use client';

import { Button } from '@/components/common/Button';
import { RefreshIcon } from '@/components/Icons';

import { useAllergyContext } from '../context/AllergyContext';

import type { ReactNode } from 'react';

interface AllergyResetButtonProps {
  children?: ReactNode;
  className?: string;
  iconSize?: number;
  variant?: 'icon' | 'text';
}

/**
 * Allergy.ResetButton
 * 선택 항목 초기화 버튼
 *
 * @param children - 커스텀 버튼 UI (선택)
 * @param className - 추가 스타일
 * @param iconSize - 아이콘 크기 (variant='icon'일 때)
 * @param variant - 버튼 스타일 (icon: 아이콘만, text: 텍스트 포함)
 */
export default function AllergyResetButton({
  children,
  className = '',
  iconSize = 24,
  variant = 'icon',
}: AllergyResetButtonProps) {
  const { resetItems } = useAllergyContext();

  if (children) {
    return (
      <button type="button" onClick={resetItems}>
        {children}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="reset"
        className={`flex h-14 w-14 items-center justify-center bg-gray-600 p-0 hover:bg-gray-400 ${className}`}
        onClick={resetItems}
      >
        <RefreshIcon color="white" size={iconSize} />
      </Button>
    );
  }

  return (
    <Button className={className} variant="reset" onClick={resetItems}>
      초기화
    </Button>
  );
}

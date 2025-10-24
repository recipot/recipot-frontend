'use client';

import { Button } from '@/components/common/Button';

import { useAllergyContext } from '../context/AllergyContext';

import type { ReactNode } from 'react';

interface AllergySubmitButtonProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  text?: string;
}

/**
 * Allergy.SubmitButton
 * 폼 제출 버튼
 *
 * @param children - 커스텀 버튼 UI (선택)
 * @param className - 추가 스타일
 * @param disabled - 비활성화 여부
 * @param text - 버튼 텍스트
 */
export default function AllergySubmitButton({
  children,
  className = '',
  disabled = false,
  text = '선택 완료',
}: AllergySubmitButtonProps) {
  const { formId } = useAllergyContext();

  if (children) {
    return (
      <Button
        className={className}
        disabled={disabled}
        form={formId}
        type="submit"
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      disabled={disabled}
      form={formId}
      type="submit"
    >
      {text}
    </Button>
  );
}

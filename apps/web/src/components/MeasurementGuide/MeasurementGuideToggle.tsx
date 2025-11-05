import React from 'react';

import { ArrowIcon } from '@/components/Icons';

import type { MeasurementGuideToggleProps } from './types';

export function MeasurementGuideToggle({
  children,
  isOpen,
  onToggle,
}: MeasurementGuideToggleProps) {
  return (
    <div className="space-y-1">
      {/* 토글 헤더 */}
      <div
        className="flex cursor-pointer items-center justify-between py-1.5 transition-colors"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isOpen}
        aria-label="계량가이드 토글"
      >
        <div className="text-15sb text-gray-900">계량 가이드</div>
        <ArrowIcon
          size={20}
          className={`transition-transform duration-200 ${
            isOpen ? '-rotate-90' : 'rotate-90'
          }`}
        />
      </div>

      {/* 토글 콘텐츠 */}
      {isOpen && (
        <div className="no-scrollbar rounded-xl border-[1px] border-dashed">
          {children}
        </div>
      )}
    </div>
  );
}

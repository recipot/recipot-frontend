'use client';

import { CATEGORY_METADATA } from '../constants/constants';
import { useAllergyContext } from '../context/AllergyContext';

import type { ReactNode } from 'react';

interface AllergyNavigationProps {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'drawer';
}

/**
 * Allergy.Navigation
 * 알레르기 카테고리 네비게이션 탭
 *
 * @param children - 커스텀 탭 렌더링용 (선택)
 * @param className - 추가 스타일
 * @param variant - 스타일 변형 (default: 온보딩용, drawer: 드로어용)
 */
export default function AllergyNavigation({
  children,
  className = '',
  variant = 'default',
}: AllergyNavigationProps) {
  const { activeIndex, categories, gnbRef, handleTabClick } =
    useAllergyContext();

  const isDrawer = variant === 'drawer';

  // children이 있으면 커스텀 렌더링
  if (children) {
    return <>{children}</>;
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={gnbRef as any}
      className={`flex gap-2 overflow-x-auto ${
        isDrawer ? 'no-scrollbar' : '[&::-webkit-scrollbar]:hidden'
      } ${className}`}
    >
      {(categories.length > 0 ? categories : CATEGORY_METADATA).map(
        (category, index) => (
          <button
            key={category.title}
            data-section-id={`allergy-section-${index}`}
            type="button"
            className={`text-15sb h-10 flex-shrink-0 rounded-full px-4 py-[0.5313rem] transition-colors ${
              activeIndex === index
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600'
            } ${index === 0 ? 'ml-5' : ''} ${
              index ===
              (categories.length > 0 ? categories : CATEGORY_METADATA).length -
                1
                ? 'mr-5'
                : ''
            }`}
            aria-label={`${category.title} 섹션으로 이동`}
            onClick={() => handleTabClick(index)}
          >
            {category.title}
          </button>
        )
      )}
    </div>
  );
}

'use client';

import type { CategoryMetadata } from '@/types/allergy.types';

import { CATEGORY_METADATA } from '../constants/constants';

import type { RefObject } from 'react';

interface AllergyNavigationTabsProps {
  activeIndex: number;
  categories?: CategoryMetadata[];
  gnbRef?: RefObject<HTMLElement>;
  onTabClick: (index: number) => void;
  variant?: 'default' | 'drawer';
}

/**
 * AllergyNavigationTabs
 * 알레르기 카테고리 네비게이션 탭
 * @param activeIndex - 활성화된 탭 인덱스
 * @param categories - 카테고리 메타데이터 (선택, 기본값: CATEGORY_METADATA)
 * @param onTabClick - 탭 클릭 핸들러
 * @param gnbRef - 네비게이션 ref (스크롤 스파이용)
 * @param variant - 스타일 변형 (default: 온보딩용, drawer: 드로어용)
 */
export default function AllergyNavigationTabs({
  activeIndex,
  categories = CATEGORY_METADATA,
  gnbRef,
  onTabClick,
  variant = 'default',
}: AllergyNavigationTabsProps) {
  const isDrawer = variant === 'drawer';

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={gnbRef as any}
      className={
        isDrawer
          ? 'no-scrollbar flex gap-2 overflow-x-auto'
          : 'flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden'
      }
    >
      {categories.map((category, index) => (
        <button
          key={category.title}
          type="button"
          onClick={() => onTabClick(index)}
          data-section-id={`allergy-section-${index}`}
          className={`text-15sb h-10 flex-shrink-0 rounded-full px-4 py-[0.5313rem] transition-colors ${
            activeIndex === index
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600'
          } ${index === 0 ? 'ml-5' : ''} ${index === categories.length - 1 ? 'mr-5' : ''}`}
          aria-label={`${category.title} 섹션으로 이동`}
        >
          {category.title}
        </button>
      ))}
    </div>
  );
}

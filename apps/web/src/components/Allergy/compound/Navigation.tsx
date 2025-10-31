'use client';

import { useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';

import { CATEGORY_METADATA } from '../constants/constants';
import { useAllergyContext } from '../context/AllergyContext';

import type { ReactNode } from 'react';

interface AllergyNavigationProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Allergy.Navigation
 * 알레르기 카테고리 네비게이션 탭
 *
 * @param children - 커스텀 탭 렌더링용 (선택)
 * @param className - 추가 스타일
 */
export default function AllergyNavigation({
  children,
  className = '',
}: AllergyNavigationProps) {
  // 모든 훅은 조건문 이전에 호출
  const { activeIndex, categories, gnbRef, scrollConfig, setActiveIndex } =
    useAllergyContext();

  // 각 탭 요소의 ref를 저장
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  const categoryList = categories.length > 0 ? categories : CATEGORY_METADATA;

  // children이 있으면 커스텀 렌더링
  if (children) {
    return children as React.ReactElement;
  }

  // 네비게이션 탭을 가운데로 스크롤하는 함수
  const scrollTabToCenter = (element: HTMLElement) => {
    const container = gnbRef?.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const elementWidth = elementRect.width;

    // 요소가 컨테이너 가운데에 오도록 스크롤 위치 계산
    const scrollLeft =
      element.offsetLeft -
      containerWidth / 2 +
      elementWidth / 2 +
      container.scrollLeft;

    container.scrollTo({
      behavior: 'smooth',
      left: scrollLeft,
    });
  };

  const containerId = scrollConfig.useWindowScroll
    ? undefined
    : (scrollConfig.containerRef?.current?.id ?? 'allergy-scroll-container');

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={gnbRef as any}
      className={`flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {categoryList.map((category, index) => {
        const sectionId = `allergy-section-${index}`;
        const isActive = activeIndex === index;

        return (
          <div
            key={category.title}
            ref={el => {
              tabRefs.current[index] = el;
            }}
            className="flex h-10 flex-shrink-0 items-center"
          >
            <ScrollLink
              to={sectionId}
              smooth
              spy
              duration={400}
              offset={-scrollConfig.navigationOffset}
              containerId={containerId}
              onSetActive={to => {
                const match = to.match(/allergy-section-(\d+)/);
                if (match) {
                  const sectionIndex = parseInt(match[1], 10);
                  if (sectionIndex >= 0 && sectionIndex < categoryList.length) {
                    setActiveIndex(sectionIndex);

                    // 활성 탭을 가운데로 스크롤
                    const tabElement = tabRefs.current[sectionIndex];
                    if (tabElement) {
                      scrollTabToCenter(tabElement);
                    }
                  }
                }
              }}
              className={`text-15sb h-10 flex-shrink-0 cursor-pointer rounded-full px-4 py-[0.5313rem] transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600'
              } ${index === 0 ? 'ml-5' : ''} ${
                index === categoryList.length - 1 ? 'mr-5' : ''
              }`}
              aria-label={`${category.title} 섹션으로 이동`}
            >
              {category.title}
            </ScrollLink>
          </div>
        );
      })}
    </div>
  );
}

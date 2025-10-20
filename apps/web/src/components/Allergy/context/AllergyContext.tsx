'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useScrollSpy } from '@/hooks';
import type { AllergyCategory } from '@/types/allergy.types';

import useAllergyCheck from '../hooks/useAllergyCheck';
import useAllergyData from '../hooks/useAllergyData';

import type { ReactNode, RefObject } from 'react';

interface AllergyContextValue {
  activeIndex: number;
  categories: AllergyCategory[];
  error: Error | null;
  formId: string;
  gnbRef: RefObject<HTMLElement> | undefined;
  handleItemToggle: (id: number) => void;
  handleTabClick: (index: number) => void;
  isLoading: boolean;
  resetItems: () => void;
  scrollConfig: {
    containerRef?: RefObject<HTMLElement>;
    navigationOffset: number;
    scrollSpyOffset: number;
    useWindowScroll: boolean;
  };
  selectedItems: number[];
  setActiveIndex: (index: number) => void;
}

const AllergyContext = createContext<AllergyContextValue | null>(null);

export function useAllergyContext() {
  const context = useContext(AllergyContext);
  if (!context) {
    throw new Error(
      'Allergy 컴포넌트는 Allergy.Root 내부에서 사용해야 합니다.'
    );
  }
  return context;
}

interface AllergyProviderProps {
  children: ReactNode;
  formId: string;
  initialSelectedItems?: number[];
  scrollConfig?: Partial<AllergyContextValue['scrollConfig']>;
}

export function AllergyProvider({
  children,
  formId,
  initialSelectedItems = [],
  scrollConfig: customScrollConfig,
}: AllergyProviderProps) {
  // 백엔드에서 재료 데이터 페칭
  const { categories, error, initialSelectedIds, isLoading } = useAllergyData();

  // 초기값 결정 (props > 백엔드 초기값 > 빈 배열)
  const initialItems =
    initialSelectedItems.length > 0
      ? initialSelectedItems
      : (initialSelectedIds ?? []);

  const { handleItemToggle, resetItems, selectedItems } =
    useAllergyCheck(initialItems);

  // 스크롤 설정 (기본값 + 커스텀 설정 병합)
  const scrollConfig: AllergyContextValue['scrollConfig'] = {
    navigationOffset: 130,
    scrollSpyOffset: 120,
    useWindowScroll: true,
    ...customScrollConfig,
  };

  // 섹션 ID 동적 생성
  const sectionIds = useMemo(
    () => categories.map((_, index) => `allergy-section-${index}`),
    [categories]
  );

  // ScrollSpy 훅 (윈도우 스크롤 모드)
  const { activeSection, gnbRef } = useScrollSpy(sectionIds, {
    offset: scrollConfig.scrollSpyOffset,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // 활성 섹션에 따라 인덱스 업데이트
  useEffect(() => {
    if (activeSection) {
      const index = sectionIds.findIndex(id => id === activeSection);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [activeSection, sectionIds]);

  // 탭 클릭 핸들러
  const handleTabClick = (index: number) => {
    setActiveIndex(index);

    const sectionId = `allergy-section-${index}`;
    const section = document.getElementById(sectionId);

    if (!section) return;

    if (scrollConfig.useWindowScroll) {
      // 윈도우 스크롤 모드 (온보딩)
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - scrollConfig.navigationOffset;

      window.scrollTo({
        behavior: 'smooth',
        top: Math.max(0, offsetPosition),
      });
    } else if (scrollConfig.containerRef?.current) {
      // 컨테이너 스크롤 모드 (드로어)
      const scrollContainer = scrollConfig.containerRef.current;
      const elementPosition = section.getBoundingClientRect().top;
      const containerPosition = scrollContainer.getBoundingClientRect().top;
      const targetPosition =
        elementPosition -
        containerPosition +
        scrollContainer.scrollTop -
        scrollConfig.navigationOffset;

      // 부드러운 스크롤 애니메이션
      const startPosition = scrollContainer.scrollTop;
      const distance = targetPosition - startPosition;
      const duration = 300;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        startTime ??= currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // easeInOutCubic
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        scrollContainer.scrollTop = startPosition + distance * ease;

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  const value: AllergyContextValue = {
    activeIndex,
    categories,
    error,
    formId,
    gnbRef,
    handleItemToggle,
    handleTabClick,
    isLoading,
    resetItems,
    scrollConfig,
    selectedItems,
    setActiveIndex,
  };

  return (
    <AllergyContext.Provider value={value}>{children}</AllergyContext.Provider>
  );
}

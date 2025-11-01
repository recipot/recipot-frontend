'use client';

import { createContext, useContext, useMemo, useRef, useState } from 'react';

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
  handleCategoryToggle: (categoryItemIds: number[]) => void;
  handleItemToggle: (id: number) => void;
  isLoading: boolean;
  resetItems: () => void;
  scrollConfig: {
    containerRef?: RefObject<HTMLElement>;
    navigationOffset: number;
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
  /** 온보딩 모드 여부 (true일 경우 백엔드 초기값 무시) */
  isOnboarding?: boolean;
  scrollConfig?: Partial<AllergyContextValue['scrollConfig']>;
}

export function AllergyProvider({
  children,
  formId,
  initialSelectedItems = [],
  isOnboarding = false,
  scrollConfig: customScrollConfig,
}: AllergyProviderProps) {
  // 백엔드에서 재료 데이터 페칭
  const { categories, error, initialSelectedIds, isLoading } = useAllergyData();

  // 초기값 결정 - 메모이제이션으로 무한 렌더링 방지
  // 온보딩 모드: 항상 빈 배열 (백엔드 초기값 무시)
  // 일반 모드: props > 백엔드 초기값 > 빈 배열
  const initialItems = useMemo(() => {
    if (isOnboarding) {
      return [];
    }
    return initialSelectedItems.length > 0
      ? initialSelectedItems
      : (initialSelectedIds ?? []);
  }, [isOnboarding, initialSelectedItems, initialSelectedIds]);

  const { handleCategoryToggle, handleItemToggle, resetItems, selectedItems } =
    useAllergyCheck(initialItems);

  // 스크롤 설정 (기본값 + 커스텀 설정 병합)
  const scrollConfig: AllergyContextValue['scrollConfig'] = {
    navigationOffset: 130,
    useWindowScroll: true,
    ...customScrollConfig,
  };

  // Navigation의 ref (react-scroll의 spy가 사용)
  const gnbRef = useRef<HTMLElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const value: AllergyContextValue = {
    activeIndex,
    categories,
    error,
    formId,
    gnbRef,
    handleCategoryToggle,
    handleItemToggle,
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

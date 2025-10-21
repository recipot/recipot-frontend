'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useAllergyCheck
 * @param initialItems - 초기 선택된 항목들
 * @returns handleItemToggle: (itemId: number) => void, handleCategoryToggle: (categoryItemIds: number[]) => void, selectedItems: number[], resetItems: () => void, resetToInitial: () => void
 * @description 알레르기 항목 선택 핸들러와 선택된 항목 목록, 초기화 함수를 반환합니다.
 */
export default function useAllergyCheck(initialItems: number[] = []) {
  const [selectedItems, setSelectedItems] = useState<number[]>(initialItems);
  const initialItemsRef = useRef(initialItems);
  const prevInitialItemsRef = useRef<number[]>(initialItems);
  const hasUserInteractedRef = useRef(false);

  // initialItems가 변경되었을 때만 상태 업데이트 (단, 사용자가 인터랙션하기 전에만)
  useEffect(() => {
    // 사용자가 이미 항목을 선택/해제했다면 initialItems 변경을 무시
    if (hasUserInteractedRef.current) return;

    const prevItems = prevInitialItemsRef.current;
    const prevItemsStr = JSON.stringify([...prevItems].sort());
    const currentItemsStr = JSON.stringify([...initialItems].sort());

    // 이전 값과 현재 값이 다를 때만 업데이트 (순서 무관)
    if (prevItemsStr !== currentItemsStr) {
      setSelectedItems(initialItems);
      prevInitialItemsRef.current = initialItems;
    }
  }, [initialItems]);

  // initialItems ref는 항상 최신 값으로 유지
  initialItemsRef.current = initialItems;

  const handleItemToggle = useCallback((itemId: number) => {
    hasUserInteractedRef.current = true;
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const handleCategoryToggle = useCallback((categoryItemIds: number[]) => {
    hasUserInteractedRef.current = true;
    setSelectedItems(prev => {
      // 카테고리의 모든 아이템이 선택되어 있는지 확인
      const allSelected = categoryItemIds.every(id => prev.includes(id));

      if (allSelected) {
        // 모두 선택되어 있으면 전체 해제
        return prev.filter(id => !categoryItemIds.includes(id));
      } else {
        // 하나라도 선택 안 되어 있으면 전체 선택
        const newItems = [...prev];
        categoryItemIds.forEach(id => {
          if (!newItems.includes(id)) {
            newItems.push(id);
          }
        });
        return newItems;
      }
    });
  }, []);

  const resetItems = useCallback(() => {
    hasUserInteractedRef.current = false;
    setSelectedItems([]);
  }, []);

  const resetToInitial = useCallback(() => {
    hasUserInteractedRef.current = false;
    setSelectedItems(initialItemsRef.current);
  }, []);

  return {
    handleCategoryToggle,
    handleItemToggle,
    resetItems,
    resetToInitial,
    selectedItems,
  };
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * useAllergyCheck
 * @param initialItems - 초기 선택된 항목들
 * @returns handleItemToggle: (ingredientIds: number[]) => void, handleCategoryToggle: (categoryItemIds: number[]) => void, selectedItems: number[], resetItems: () => void, resetToInitial: () => void
 * @description 알레르기 항목 선택 핸들러와 선택된 항목 목록, 초기화 함수를 반환합니다.
 */
export default function useAllergyCheck(initialItems: number[] = []) {
  const [selectedSet, setSelectedSet] = useState<Set<number>>(
    () => new Set(initialItems)
  );
  const initialItemsRef = useRef(initialItems);
  const prevInitialItemsRef = useRef<number[]>(initialItems);
  const hasUserInteractedRef = useRef(false);

  // initialItems가 변경되었을 때만 상태 업데이트 (단, 사용자가 인터랙션하기 전에만)
  useEffect(() => {
    // 사용자가 이미 항목을 선택/해제했다면 initialItems 변경을 무시
    if (hasUserInteractedRef.current) return;

    const prevItems = prevInitialItemsRef.current;
    const prevSet = new Set(prevItems);
    const currentSet = new Set(initialItems);
    const isSameSize = prevSet.size === currentSet.size;
    const isSameItems =
      isSameSize && [...currentSet].every(item => prevSet.has(item));

    // 이전 값과 현재 값이 다를 때만 업데이트 (순서 무관)
    if (!isSameItems) {
      setSelectedSet(new Set(initialItems));
      prevInitialItemsRef.current = initialItems;
    }
  }, [initialItems]);

  // initialItems ref는 항상 최신 값으로 유지
  initialItemsRef.current = initialItems;

  const handleItemToggle = useCallback((ingredientIds: number[]) => {
    hasUserInteractedRef.current = true;
    setSelectedSet(prevSet => {
      const nextSet = new Set(prevSet);
      const allSelected = ingredientIds.every(id => nextSet.has(id));

      if (allSelected) {
        ingredientIds.forEach(id => nextSet.delete(id));
      } else {
        ingredientIds.forEach(id => nextSet.add(id));
      }

      return nextSet;
    });
  }, []);

  const handleCategoryToggle = useCallback((categoryItemIds: number[]) => {
    hasUserInteractedRef.current = true;
    setSelectedSet(prevSet => {
      const nextSet = new Set(prevSet);
      // 카테고리의 모든 아이템이 선택되어 있는지 확인
      const allSelected = categoryItemIds.every(id => nextSet.has(id));

      if (allSelected) {
        // 모두 선택되어 있으면 전체 해제
        categoryItemIds.forEach(id => nextSet.delete(id));
      } else {
        // 하나라도 선택 안 되어 있으면 전체 선택
        categoryItemIds.forEach(id => nextSet.add(id));
      }

      return nextSet;
    });
  }, []);

  const resetItems = useCallback(() => {
    hasUserInteractedRef.current = false;
    setSelectedSet(new Set());
  }, []);

  const resetToInitial = useCallback(() => {
    hasUserInteractedRef.current = false;
    setSelectedSet(new Set(initialItemsRef.current));
  }, []);

  const selectedItems = useMemo(
    () => Array.from(selectedSet),
    [selectedSet]
  );

  return {
    handleCategoryToggle,
    handleItemToggle,
    resetItems,
    resetToInitial,
    selectedItems,
  };
}

'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * useAllergyCheck
 * @param initialItems - 초기 선택된 항목들
 * @returns handleItemToggle: (itemId: number) => void, selectedItems: number[], resetItems: () => void, resetToInitial: () => void
 * @description 알레르기 항목 선택 핸들러와 선택된 항목 목록, 초기화 함수를 반환합니다.
 */
export default function useAllergyCheck(initialItems: number[] = []) {
  const [selectedItems, setSelectedItems] = useState<number[]>(initialItems);
  const initialItemsRef = useRef(initialItems);

  // initialItems가 변경되면 ref 업데이트
  initialItemsRef.current = initialItems;

  const handleItemToggle = useCallback((itemId: number) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const resetItems = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const resetToInitial = useCallback(() => {
    setSelectedItems(initialItemsRef.current);
  }, []);

  return { handleItemToggle, resetItems, resetToInitial, selectedItems };
}

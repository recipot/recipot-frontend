'use client';

import { useEffect, useRef, useState } from 'react';

import { HighlightText } from '@/components/common/HighlightText';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface Seasoning {
  id: number;
  amount: string;
}

interface SeasoningsModalProps {
  availableSeasonings: Array<{ id: number; name: string }>;
  closeModal: () => void;
  editedData: Partial<RecipeUpdateRequest> | undefined;
  recipe: AdminRecipe;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

// 양념 계량 단위 목록
const SEASONING_UNITS = ['큰술'];

// amount 문자열을 quantity와 unit으로 파싱
const parseAmount = (amount: string): { quantity: string; unit: string } => {
  if (!amount) return { quantity: '', unit: '' };

  // 숫자와 단위 분리 (예: "1큰술" -> quantity: "1", unit: "큰술")
  const unitMatch = SEASONING_UNITS.find(unit => amount.endsWith(unit));
  if (unitMatch) {
    const quantity = amount.slice(0, -unitMatch.length).trim();
    return { quantity, unit: unitMatch };
  }

  // 단위가 없으면 전체를 quantity로
  return { quantity: amount, unit: '' };
};

// quantity와 unit을 합쳐서 amount 문자열 생성
const formatAmount = (quantity: string, unit: string): string => {
  if (!quantity && !unit) return '';
  if (!quantity) return '';
  if (!unit) return quantity;
  return `${quantity}${unit}`;
};

export function SeasoningsModal({
  availableSeasonings,
  closeModal,
  editedData,
  recipe,
  updateEditedRecipe,
}: SeasoningsModalProps) {
  const currentSeasonings = editedData?.seasonings ?? recipe.seasonings ?? [];
  const [seasonings, setSeasonings] = useState<Seasoning[]>(currentSeasonings);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 모달이 열릴 때 초기값 저장
  useEffect(() => {
    setSeasonings(currentSeasonings);
    setSearchTerm('');
    setEditingId(null);
    setEditingQuantity('');
    setFocusedIndex(-1);
  }, [currentSeasonings]);

  // 검색어가 변경되면 포커스 인덱스 초기화
  useEffect(() => {
    setFocusedIndex(-1);
    itemRefs.current = [];
  }, [searchTerm]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSeasonings = availableSeasonings.filter(seasoning =>
    seasoning.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSeasoning = (seasoningId: number) => {
    setSeasonings([...seasonings, { amount: '', id: seasoningId }]);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchTerm || filteredSeasonings.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex = prev < filteredSeasonings.length - 1 ? prev + 1 : 0;
          itemRefs.current[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : filteredSeasonings.length - 1;
          itemRefs.current[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredSeasonings.length) {
          const seasoning = filteredSeasonings[focusedIndex];
          handleAddSeasoning(seasoning.id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleRemoveSeasoning = (id: number) => {
    setSeasonings(seasonings.filter(sea => sea.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingQuantity('');
    }
  };

  const handleStartEdit = (id: number) => {
    const seasoning = seasonings.find(sea => sea.id === id);
    if (seasoning) {
      const { quantity } = parseAmount(seasoning.amount);
      setEditingId(id);
      setEditingQuantity(quantity);
    }
  };

  const handleQuantityChange = (value: string) => {
    setEditingQuantity(value);
    if (editingId === null) return;

    // 단위는 항상 '큰술'로 고정
    const amount = formatAmount(value, SEASONING_UNITS[0]);
    setSeasonings(
      seasonings.map(sea => (sea.id === editingId ? { ...sea, amount } : sea))
    );
  };

  const handleQuantityBlur = () => {
    if (editingId === null) return;
    setEditingId(null);
    setEditingQuantity('');
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuantityBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const seasoning = seasonings.find(sea => sea.id === editingId);
      if (seasoning) {
        const { quantity } = parseAmount(seasoning.amount);
        setEditingQuantity(quantity);
      }
      handleQuantityBlur();
    }
  };

  const handleSave = () => {
    updateEditedRecipe(recipe.id, { seasonings });
    closeModal();
  };

  const getSeasoningName = (seasoningId: number) => {
    return availableSeasonings.find(s => s.id === seasoningId)?.name ?? '';
  };

  // 검증 로직: 양념이 없거나 amount가 비어있는 경우
  const validateSeasonings = (): boolean => {
    // 양념이 하나도 없으면 false
    if (seasonings.length === 0) {
      return false;
    }
    // amount가 비어있는 양념이 있으면 false
    const hasEmptyAmount = seasonings.some(
      sea => !sea.amount || sea.amount.trim().length === 0
    );
    if (hasEmptyAmount) {
      return false;
    }
    return true;
  };

  // 초기값과 동일한지 확인
  const hasChanges = (): boolean => {
    if (seasonings.length !== currentSeasonings.length) {
      return true;
    }
    // ID 기준으로 정렬하여 비교
    const sortedCurrent = [...currentSeasonings].sort((a, b) => a.id - b.id);
    const sortedSeasonings = [...seasonings].sort((a, b) => a.id - b.id);

    return sortedSeasonings.some((sea, index) => {
      const current = sortedCurrent[index];
      return !current || sea.id !== current.id || sea.amount !== current.amount;
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // 수정 사항이 없으면 정상적으로 닫기
      if (!hasChanges()) {
        closeModal();
        return;
      }
      // 검증 실패 시 닫기 방지
      if (!validateSeasonings()) {
        return;
      }
      // 검증 통과 시 닫기
      closeModal();
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>양념 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 양념 검색 입력 */}
          <div className="relative">
            <Input
              ref={searchInputRef}
              placeholder="양념"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* 드롭다운 목록 */}
            {searchTerm && filteredSeasonings.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow-lg"
              >
                {filteredSeasonings.map((seasoning, index) => (
                  <button
                    key={seasoning.id}
                    ref={el => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleAddSeasoning(seasoning.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      focusedIndex === index ? 'bg-gray-100' : ''
                    }`}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <HighlightText
                      text={seasoning.name}
                      searchQuery={searchTerm}
                      highlightClassName="text-primary font-bold"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 선택된 양념 목록 */}
          <div className="space-y-3">
            {seasonings.map(seasoning => {
              const isEditing = editingId === seasoning.id;
              const { quantity, unit } = parseAmount(seasoning.amount);

              return (
                <div key={seasoning.id}>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[120px] font-medium">
                      {getSeasoningName(seasoning.id)}
                    </span>
                    {isEditing ? (
                      <div className="ml-auto flex items-center gap-2">
                        <Input
                          placeholder="계량량"
                          value={editingQuantity}
                          onChange={e => handleQuantityChange(e.target.value)}
                          onBlur={handleQuantityBlur}
                          onKeyDown={handleQuantityKeyDown}
                          className="w-32"
                        />
                        <div className="border-input flex h-9 items-center px-3 py-1 text-sm">
                          {SEASONING_UNITS[0]}
                        </div>
                      </div>
                    ) : (
                      <>
                        {seasoning.amount && (
                          <span className="text-sm text-gray-600">
                            {quantity} {unit || SEASONING_UNITS[0]}
                          </span>
                        )}
                        <div className="ml-auto flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEdit(seasoning.id)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSeasoning(seasoning.id)}
                          >
                            삭제
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!validateSeasonings()}
            className="disabled:cursor-not-allowed"
          >
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

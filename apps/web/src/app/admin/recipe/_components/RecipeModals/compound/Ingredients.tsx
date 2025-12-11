'use client';

import { useEffect, useRef, useState } from 'react';

import { useRecipeTableActionsContext } from '@/app/admin/recipe/_components/RecipeTableActionsContext';
import { useRecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
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

interface Ingredient {
  id: number;
  amount: string;
  isAlternative: boolean;
}

// amount 문자열을 quantity와 unit으로 파싱
// 예: "3개" -> quantity: "3", unit: "개"
// 예: "5~6개" -> quantity: "5~6", unit: "개"
// 예: "1/2개" -> quantity: "1/2", unit: "개"
// 예: "100g" -> quantity: "100", unit: "g"
// 예: "3-4큰술" -> quantity: "3-4", unit: "큰술"
const parseAmount = (amount: string): { quantity: string; unit: string } => {
  if (!amount) return { quantity: '', unit: '' };

  // 숫자, 소수점, 분수(/), 범위 표시(~, -), 공백을 포함한 부분과 나머지 부분으로 분리
  // 숫자로 시작하는 부분을 quantity로, 나머지를 unit으로 처리
  const match = amount.match(/^([\d./~\-\s]+)(.*)$/);
  if (match) {
    // 앞뒤 공백 제거
    const quantity = match[1].trim();
    const unit = match[2].trim();
    return { quantity, unit };
  }

  // 숫자가 없으면 전체를 quantity로
  return { quantity: amount.trim(), unit: '' };
};

// quantity와 unit을 합쳐서 amount 문자열 생성
const formatAmount = (quantity: string, unit: string): string => {
  if (!quantity && !unit) return '';
  if (!quantity) return unit;
  if (!unit) return quantity;
  return `${quantity}${unit}`;
};

/**
 * RecipeModals.Ingredients
 * 재료 수정 모달 컴포넌트
 */
export default function RecipeModalsIngredients() {
  const { editedRecipes, foodList, modalState, recipes } =
    useRecipeTableDataContext();
  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [editingUnit, setEditingUnit] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isOpen = modalState?.type === 'ingredients';
  const { recipeId } = modalState ?? {};
  const targetRecipe = recipeId ? recipes.find(r => r.id === recipeId) : null;
  const editedData = recipeId ? editedRecipes.get(recipeId) : undefined;
  const currentIngredients =
    editedData?.ingredients ?? targetRecipe?.ingredients ?? [];

  // 모달이 열릴 때 초기값 저장
  useEffect(() => {
    if (isOpen && currentIngredients !== undefined) {
      setIngredients(currentIngredients);
      setSearchTerm('');
      setEditingId(null);
      setEditingQuantity('');
      setEditingUnit('');
      setFocusedIndex(-1);
    }
  }, [isOpen, currentIngredients]);

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

  const filteredFoods = foodList.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (foodId: number) => {
    setIngredients([
      ...ingredients,
      { amount: '', id: foodId, isAlternative: false },
    ]);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchTerm || filteredFoods.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex = prev < filteredFoods.length - 1 ? prev + 1 : 0;
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
          const nextIndex = prev > 0 ? prev - 1 : filteredFoods.length - 1;
          itemRefs.current[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredFoods.length) {
          const food = filteredFoods[focusedIndex];
          handleAddIngredient(food.id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingQuantity('');
      setEditingUnit('');
    }
  };

  const handleStartEdit = (id: number) => {
    const ingredient = ingredients.find(ing => ing.id === id);
    if (ingredient) {
      const { quantity, unit } = parseAmount(ingredient.amount);
      setEditingId(id);
      setEditingQuantity(quantity);
      setEditingUnit(unit);
    }
  };

  // 계량량
  const handleQuantityChange = (value: string) => {
    setEditingQuantity(value);
    if (editingId === null) return;

    // quantity와 unit을 합쳐서 저장
    const amount = formatAmount(value, editingUnit);
    setIngredients(
      ingredients.map(ing => (ing.id === editingId ? { ...ing, amount } : ing))
    );
  };

  // 계량단위
  const handleUnitChange = (value: string) => {
    setEditingUnit(value);
    if (editingId === null) return;

    // quantity와 unit을 합쳐서 저장
    const amount = formatAmount(editingQuantity, value);
    setIngredients(
      ingredients.map(ing => (ing.id === editingId ? { ...ing, amount } : ing))
    );
  };

  const handleEditBlur = () => {
    if (editingId === null) return;
    setEditingId(null);
    setEditingQuantity('');
    setEditingUnit('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const ingredient = ingredients.find(ing => ing.id === editingId);
      if (ingredient) {
        const { quantity, unit } = parseAmount(ingredient.amount);
        setEditingQuantity(quantity);
        setEditingUnit(unit);
      }
      handleEditBlur();
    }
  };

  const handleSave = () => {
    if (!targetRecipe) return;
    updateEditedRecipe(targetRecipe.id, { ingredients });
    closeModal();
  };

  const getFoodName = (foodId: number) => {
    return foodList.find(f => f.id === foodId)?.name ?? '';
  };

  // 검증 로직: 재료가 없거나 amount가 비어있는 경우
  const validateIngredients = (): boolean => {
    // 재료가 하나도 없으면 false
    if (ingredients.length === 0) {
      return false;
    }
    // amount가 비어있는 재료가 있으면 false
    const hasEmptyAmount = ingredients.some(
      ing => !ing.amount || ing.amount.trim().length === 0
    );
    if (hasEmptyAmount) {
      return false;
    }
    return true;
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // 검증 실패 시 닫기 방지
      if (!validateIngredients()) {
        return;
      }
      // 검증 통과 시 닫기
      closeModal();
    }
  };

  if (!isOpen || !targetRecipe) return null;

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>재료 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 재료 검색 입력 */}
          <div className="relative">
            <Input
              ref={searchInputRef}
              placeholder="재료"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* 드롭다운 목록 */}
            {searchTerm && filteredFoods.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow-lg"
              >
                {filteredFoods.map((food, index) => (
                  <button
                    key={food.id}
                    ref={el => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleAddIngredient(food.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      focusedIndex === index ? 'bg-gray-100' : ''
                    }`}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <HighlightText
                      text={food.name}
                      searchQuery={searchTerm}
                      highlightClassName="text-primary font-bold"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 선택된 재료 목록 */}
          <div className="space-y-3">
            {ingredients.map(ingredient => {
              const isEditing = editingId === ingredient.id;
              const { quantity, unit } = parseAmount(ingredient.amount);

              return (
                <div key={ingredient.id}>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[120px] font-medium">
                      {getFoodName(ingredient.id)}
                    </span>
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="계량량"
                          value={editingQuantity}
                          onChange={e => handleQuantityChange(e.target.value)}
                          onBlur={handleEditBlur}
                          onKeyDown={handleEditKeyDown}
                          className="flex-1"
                        />
                        <Input
                          placeholder="계량단위"
                          value={editingUnit}
                          onChange={e => handleUnitChange(e.target.value)}
                          onBlur={handleEditBlur}
                          onKeyDown={handleEditKeyDown}
                          className="flex-1"
                        />
                      </>
                    ) : (
                      <>
                        {ingredient.amount && (
                          <span className="text-sm text-gray-600">
                            {quantity} {unit}
                          </span>
                        )}
                        <div className="ml-auto flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEdit(ingredient.id)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRemoveIngredient(ingredient.id)
                            }
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
            disabled={!validateIngredients()}
            className="disabled:cursor-not-allowed"
          >
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

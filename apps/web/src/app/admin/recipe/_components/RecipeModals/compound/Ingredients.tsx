'use client';

import { useEffect, useRef, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { recipe } from '@recipot/api';
import { useQuery } from '@tanstack/react-query';

import { useRecipeTableActionsContext } from '@/app/admin/recipe/_components/RecipeTableActionsContext';
import { useRecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
import { HighlightText } from '@/components/common/HighlightText';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Ingredient {
  id: number;
  name?: string;
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
  const targetRecipe = recipeId ? recipes.find(r => r.id === recipeId) : null; // 선택한 레시피

  const editedData = recipeId ? editedRecipes.get(recipeId) : undefined; // 수정 데이터

  const isApiCall =
    isOpen &&
    recipeId !== undefined &&
    recipeId >= 0 &&
    !editedData?.ingredients;

  // 모달이 열릴 때 API로 재료 데이터 가져오기
  // editedRecipes에 데이터가 있으면 API 호출하지 않음
  const { data: apiIngredients, isLoading: isLoadingIngredients } = useQuery({
    enabled: isApiCall,
    queryFn: async () => {
      if (!recipeId || recipeId < 0) return [];
      const { ingredients } = await recipe.getRecipeIngredients(recipeId);
      // ingredients 배열만 반환, ingredientId를 id로 매핑
      return (
        ingredients.map(item => ({
          amount: item.amount,
          id: item.ingredientId,
          isAlternative: item.isAlternative,
          name: item.name,
        })) ?? []
      );
    },
    queryKey: ['recipe-ingredients', recipeId],
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 모달이 열릴 때 초기값 저장 및 편집 state 초기화

  useEffect(() => {
    if (!isOpen || !recipeId) return;

    if (editedData?.ingredients) {
      setIngredients(editedData.ingredients as Ingredient[]);
    } else if (apiIngredients !== undefined) {
      setIngredients(recipeId < 0 ? [] : apiIngredients);
    }

    // 편집 state 초기화
    setEditingId(null);
    setEditingQuantity('');
    setEditingUnit('');
    setSearchTerm('');
    setFocusedIndex(-1);
  }, [isOpen, recipeId, editedData?.ingredients, apiIngredients]);

  // 모달이 닫힐 때 편집 내용을 editedRecipes에 자동 저장
  useEffect(() => {
    if (!isOpen || !targetRecipe || ingredients.length === 0) {
      // 편집 state만 초기화
      if (!isOpen) {
        setEditingId(null);
        setEditingQuantity('');
        setEditingUnit('');
        setSearchTerm('');
        setFocusedIndex(-1);
      }
      return;
    }

    // 모달이 닫힐 때 편집 내용을 자동 저장
    updateEditedRecipe(targetRecipe.id, { ingredients });
  }, [isOpen, targetRecipe, ingredients, updateEditedRecipe]);

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

  // 이미 추가된 재료 ID 목록
  const addedIngredientIds = new Set(ingredients.map(ing => ing.id));

  const filteredFoods = foodList.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (foodId: number) => {
    const food = foodList.find(f => f.id === foodId);
    if (!food) return;

    // 이미 추가된 재료인지 확인
    if (addedIngredientIds.has(foodId)) {
      return;
    }

    setIngredients([
      ...ingredients,
      { amount: '', id: foodId, isAlternative: false, name: food.name },
    ]);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  // 활성화된 재료만 필터링 (키보드 네비게이션용)
  const enabledFilteredFoods = filteredFoods.filter(
    food => !addedIngredientIds.has(food.id)
  );

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchTerm || enabledFilteredFoods.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex =
            prev < enabledFilteredFoods.length - 1 ? prev + 1 : 0;
          // 실제 filteredFoods에서의 인덱스 찾기
          const actualIndex = filteredFoods.findIndex(
            f => f.id === enabledFilteredFoods[nextIndex]?.id
          );
          if (actualIndex >= 0) {
            itemRefs.current[actualIndex]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex =
            prev > 0 ? prev - 1 : enabledFilteredFoods.length - 1;
          // 실제 filteredFoods에서의 인덱스 찾기
          const actualIndex = filteredFoods.findIndex(
            f => f.id === enabledFilteredFoods[nextIndex]?.id
          );
          if (actualIndex >= 0) {
            itemRefs.current[actualIndex]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < enabledFilteredFoods.length) {
          const food = enabledFilteredFoods[focusedIndex];
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
      // quantity가 숫자를 포함하지 않고 unit이 비어있으면, quantity를 unit으로 이동 (단위만 있는 경우)
      if (!/[\d./~\-\s]/.test(quantity) && !unit) {
        setEditingQuantity('');
        setEditingUnit(quantity);
      } else {
        setEditingQuantity(quantity);
        setEditingUnit(unit);
      }
    }
  };

  // 계량량
  const handleQuantityChange = (value: string) => {
    setEditingQuantity(value);
  };

  // 계량단위
  const handleUnitChange = (value: string) => {
    setEditingUnit(value);
  };

  const handleEditBlur = () => {
    if (editingId === null) return;

    // 편집 완료 시 ingredients 배열 업데이트
    const amount = formatAmount(editingQuantity, editingUnit);
    setIngredients(
      ingredients.map(ingredient =>
        ingredient.id === editingId ? { ...ingredient, amount } : ingredient
      )
    );

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
      // 원본 값으로 복원
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

  // 검증 로직: 재료가 없거나 계량량/계량단위가 비어있는 경우
  const validateIngredients = (): boolean => {
    // 재료가 하나도 없으면 false
    if (ingredients.length === 0) {
      return false;
    }
    // 모든 재료가 계량량과 계량단위를 가지고 있는지 확인
    return ingredients.every(ing => {
      if (!ing.amount || ing.amount.trim().length === 0) {
        return false;
      }
      // amount를 파싱하여 quantity와 unit이 모두 있는지 확인
      const { quantity, unit } = parseAmount(ing.amount);
      return quantity.trim().length > 0 && unit.trim().length > 0;
    });
  };

  if (!isOpen || !targetRecipe) return null;

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <VisuallyHidden asChild>
          <DialogTitle>재료 수정</DialogTitle>
        </VisuallyHidden>

        {isLoadingIngredients ? (
          <div className="py-8 text-center text-gray-500">로딩 중...</div>
        ) : (
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
                  {filteredFoods.map((food, index) => {
                    const isAdded = addedIngredientIds.has(food.id);
                    // 활성화된 항목 중에서의 인덱스 찾기
                    const enabledIndex = enabledFilteredFoods.findIndex(
                      filteredFood => filteredFood.id === food.id
                    );
                    const isFocused =
                      enabledIndex >= 0 && focusedIndex === enabledIndex;

                    return (
                      <button
                        key={food.id}
                        ref={el => {
                          itemRefs.current[index] = el;
                        }}
                        type="button"
                        onClick={() => handleAddIngredient(food.id)}
                        disabled={isAdded}
                        className={`w-full px-3 py-2 text-left ${
                          isAdded
                            ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                            : 'hover:bg-gray-100'
                        } ${isFocused && !isAdded ? 'bg-gray-100' : ''}`}
                        onMouseEnter={() => {
                          if (enabledIndex >= 0) {
                            setFocusedIndex(enabledIndex);
                          }
                        }}
                      >
                        <HighlightText
                          text={food.name}
                          searchQuery={searchTerm}
                          highlightClassName="text-primary font-bold"
                        />
                        {isAdded && (
                          <span className="ml-2 text-xs text-red-400">
                            (이미 추가됨)
                          </span>
                        )}
                      </button>
                    );
                  })}
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
                        {ingredient.name}
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
        )}

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

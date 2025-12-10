'use client';

import { useState } from 'react';
import { type Food } from '@recipot/api';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Ingredient {
  id: number;
  amount: string;
  isAlternative: boolean;
}

interface IngredientsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredients: Ingredient[]) => void;
  currentIngredients: Ingredient[];
  availableFoods: Food[];
}

export function IngredientsEditModal({
  availableFoods,
  currentIngredients,
  isOpen,
  onClose,
  onSave,
}: IngredientsEditModalProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    currentIngredients
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = availableFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (foodId: number) => {
    if (ingredients.find(ing => ing.id === foodId)) {
      return;
    }
    setIngredients([
      ...ingredients,
      { id: foodId, amount: '', isAlternative: false },
    ]);
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleUpdateIngredient = (
    id: number,
    updates: Partial<Ingredient>
  ) => {
    setIngredients(
      ingredients.map(ing =>
        ing.id === id ? { ...ing, ...updates } : ing
      )
    );
  };

  const handleSave = () => {
    onSave(ingredients);
    onClose();
  };

  const getFoodName = (foodId: number) => {
    return availableFoods.find(f => f.id === foodId)?.name ?? '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>재료 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 검색 */}
          <Input
            placeholder="재료 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {/* 선택된 재료 목록 */}
          <div className="space-y-2">
            <h3 className="font-semibold">선택된 재료</h3>
            {ingredients.map(ingredient => (
              <div
                key={ingredient.id}
                className="flex items-center gap-2 rounded border p-2"
              >
                <span className="flex-1 font-medium">
                  {getFoodName(ingredient.id)}
                </span>
                <Input
                  placeholder="양"
                  value={ingredient.amount}
                  onChange={e =>
                    handleUpdateIngredient(ingredient.id, {
                      amount: e.target.value,
                    })
                  }
                  className="w-24"
                />
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={ingredient.isAlternative}
                    onCheckedChange={checked =>
                      handleUpdateIngredient(ingredient.id, {
                        isAlternative: checked === true,
                      })
                    }
                  />
                  <span className="text-sm">대체 가능</span>
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>

          {/* 재료 목록 */}
          <div className="space-y-2">
            <h3 className="font-semibold">재료 목록</h3>
            <div className="max-h-48 overflow-y-auto border rounded">
              {filteredFoods.map(food => (
                <button
                  key={food.id}
                  onClick={() => handleAddIngredient(food.id)}
                  disabled={ingredients.some(ing => ing.id === food.id)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

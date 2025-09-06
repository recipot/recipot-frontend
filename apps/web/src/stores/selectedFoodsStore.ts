import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { Food, SelectedFoodsStore } from '@/types/food.types';

export const useSelectedFoodsStore = create<SelectedFoodsStore>()(
  devtools(
    persist(
      (set, get) => ({
        addFood: foodId => {
          set(
            state => ({
              selectedFoodIds: [...state.selectedFoodIds, foodId],
            }),
            false,
            'addFood'
          );
        },

        clearAllFoods: () => {
          set({ selectedFoodIds: [] }, false, 'clearAllFoods');
        },

        getSelectedCount: () => get().selectedFoodIds.length,

        getSelectedFoods: (foodList: Food[]) => {
          const selectedIds = get().selectedFoodIds;
          return foodList.filter(food => selectedIds.includes(food.id));
        },

        isSelected: foodId => get().selectedFoodIds.includes(foodId),

        removeFood: foodId => {
          set(
            state => ({
              selectedFoodIds: state.selectedFoodIds.filter(
                id => id !== foodId
              ),
            }),
            false,
            'removeFood'
          );
        },
        selectedFoodIds: [],
        toggleFood: foodId => {
          const state = get();
          const isCurrentlySelected = state.selectedFoodIds.includes(foodId);

          set(
            state => ({
              selectedFoodIds: isCurrentlySelected
                ? state.selectedFoodIds.filter(id => id !== foodId)
                : [...state.selectedFoodIds, foodId],
            }),
            false,
            `toggleFood-${isCurrentlySelected ? 'remove' : 'add'}`
          );
        },
      }),
      {
        name: 'selected-foods-storage',
        onRehydrateStorage: () => state => {
          console.info(
            '선택된 재료 상태가 복원되었습니다:',
            state?.selectedFoodIds
          );
        },
      }
    ),
    {
      name: 'selected-foods-store',
    }
  )
);

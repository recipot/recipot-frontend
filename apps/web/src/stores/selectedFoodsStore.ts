import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { SelectedFoodsStore } from '@/types/food.types';

import type { Food } from '@recipot/api';

export const useSelectedFoodsStore = create<SelectedFoodsStore>()(
  devtools(
    persist(
      (set, get) => ({
        clearAllFoods: () => {
          set({ selectedFoodIds: [] }, false, 'clearAllFoods');
        },

        getSelectedCount: () => get().selectedFoodIds.length,

        getSelectedFoods: (foodList: Food[]) => {
          const selectedIds = get().selectedFoodIds;
          return foodList.filter(food => selectedIds.includes(food.id));
        },

        isSelected: foodId => get().selectedFoodIds.includes(foodId),
        selectedFoodIds: [] as number[],
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
      }
    ),
    {
      name: 'selected-foods-store',
    }
  )
);

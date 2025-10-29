import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { SelectedFoodsStore } from '@/types/food.types';

import type { Food } from '@recipot/api';

/** 초기 상태 */
const initialState = {
  selectedFoodIds: [] as number[],
  userId: null as string | null,
};

export const useSelectedFoodsStore = create<SelectedFoodsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        ...initialState,

        // 액션들
        clearAllFoods: () => {
          set({ selectedFoodIds: [] }, false, 'clearAllFoods');
        },

        getSelectedCount: () => get().selectedFoodIds.length,

        getSelectedFoods: (foodList: Food[]) => {
          const selectedIds = get().selectedFoodIds;
          return foodList.filter(food => selectedIds.includes(food.id));
        },

        isSelected: foodId => get().selectedFoodIds.includes(foodId),

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

        validateUserSession: (currentUserId: string | null) => {
          const { userId } = get();

          if (!currentUserId) {
            set({ ...initialState, userId: null }, false, 'resetSession');
            return;
          }

          if (userId !== currentUserId) {
            console.info('🔄 사용자 세션 변경 감지, 선택된 음식 데이터 초기화');
            set({ ...initialState, userId: currentUserId }, false, 'resetSession');
          }
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

export interface Food {
  id: number;
  name: string;
  category: string;
}

export interface SelectedFoodsStore {
  selectedFoodIds: number[];
  toggleFood: (foodId: number) => void;
  clearAllFoods: () => void;
  isSelected: (foodId: number) => boolean;
  getSelectedCount: () => number;
  getSelectedFoods: (foodList: Food[]) => Food[];
}

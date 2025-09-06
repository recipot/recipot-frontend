export interface Food {
  id: number;
  name: string;
  category: string;
}

export interface SelectedFoodsStore {
  selectedFoodIds: number[];
  addFood: (foodId: number) => void;
  removeFood: (foodId: number) => void;
  toggleFood: (foodId: number) => void;
  clearAllFoods: () => void;
  isSelected: (foodId: number) => boolean;
  getSelectedCount: () => number;
  getSelectedFoods: (foodList: Food[]) => Food[];
}

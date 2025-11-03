import React, { useMemo } from 'react';

import { useFoodList } from '@/hooks/useFoodList';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

const RecipeTags = () => {
  const { data: foodList = [], isLoading } = useFoodList();
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);

  // ID를 이름으로 매핑
  const selectedFoodNames = useMemo(() => {
    return selectedFoodIds
      .map(id => foodList.find(food => food.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  }, [selectedFoodIds, foodList]);

  // 최대 5개만 표시
  const displayedFoods = selectedFoodNames.slice(0, 3);
  const remainingCount = selectedFoodNames.length - 3;

  // 로딩 중이거나 식재료가 없는 경우 렌더링하지 않음
  if (isLoading || selectedFoodNames.length === 0) {
    return null;
  }

  return (
    <div className="recipe-tags mb-4 px-4">
      <div className="no-scrollbar flex flex-nowrap items-center gap-[6px] overflow-x-auto">
        {displayedFoods.map(ingredient => (
          <div
            key={ingredient}
            className="bg-secondary-light-green border-secondary-soft-green flex-shrink-0 rounded-[6px] border px-2 py-[2px] text-[#53880A]"
          >
            <p className="text-14b whitespace-nowrap">
              {ingredient.slice(0, 13)}
            </p>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="bg-secondary-light-green border-secondary-soft-green flex-shrink-0 rounded-[6px] border px-2 py-[2px] text-[#53880A]">
            <p className="text-14b whitespace-nowrap">+{remainingCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeTags;

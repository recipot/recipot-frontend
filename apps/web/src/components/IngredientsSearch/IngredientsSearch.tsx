import { useState } from 'react';
import { Loader2, XIcon } from 'lucide-react';

import { HighlightText } from '@/components/common/HighlightText';
import { SearchInput } from '@/components/common/SearchInput';
import { useFoodList } from '@/hooks/useFoodList';
import { useSubmitSelectedFoods } from '@/hooks/useSubmitSelectedFoods';
import { cn } from '@/lib/utils';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import type { Food } from '@/types/food.types';
import { filterByKoreanSearch } from '@/utils/koreanSearch';

import { Button } from '../common/Button';

export default function IngredientsSearch({
  onSubmissionSuccess,
}: {
  onSubmissionSuccess: () => void;
}) {
  const [value, setValue] = useState('');

  // 서버에서 재료 목록 조회
  const { data: foodList = [], isLoading: isFoodListLoading } = useFoodList();

  // 로컬 상태 관리
  const {
    clearAllFoods,
    getSelectedCount,
    isSelected,
    selectedFoodIds,
    toggleFood,
  } = useSelectedFoodsStore();

  // 선택된 재료 전송 mutation
  const { isPending: isSubmitting, mutate: submitSelectedFoods } =
    useSubmitSelectedFoods();

  // 검색어에 따른 필터링된 재료 목록 계산
  const filteredFoodList: Food[] = (() => {
    if (value === '' || foodList.length === 0) {
      return [];
    }
    return filterByKoreanSearch(foodList, value, food => food.name);
  })();

  const StyleActive =
    'border-secondary-soft-green bg-secondary-light-green text-primary';

  const handleSelectedFood = (foodId: number) => {
    const food = foodList.find(f => f.id === foodId);
    const wasSelected = isSelected(foodId);

    toggleFood(foodId);

    if (wasSelected) {
      console.info(`${food?.name}이(가) 제거되었습니다.`);
    } else {
      console.info(`${food?.name}이(가) 추가되었습니다.`);
    }
  };

  const handleSelectedFoodRemove = (foodId: number) => {
    toggleFood(foodId);
  };

  const handleClearSearch = () => {
    setValue('');
  };

  const handleSubmitSelectedFoods = () => {
    // 선택된 재료를 서버로 전송
    submitSelectedFoods(selectedFoodIds, {
      onSuccess: () => {
        onSubmissionSuccess(); // 성공 시 부모 컴포넌트에 알림
      },
    });
  };

  // 재료 목록 로딩 중
  if (isFoodListLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" size={24} />
        <span className="ml-2">재료 목록을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative p-8">
        <SearchInput
          value={value}
          onChange={e => setValue(e.target.value)}
          onClear={handleClearSearch}
        />

        {/* 검색된 재료 리스트 */}
        {value && filteredFoodList.length > 0 && (
          <div className="absolute top-[84px] left-0 grid w-full grid-cols-3 gap-3 border-b border-gray-200 bg-white/80 px-8 py-5 backdrop-blur-xs">
            {filteredFoodList.map(food => (
              <Button
                key={food.id}
                onClick={() => handleSelectedFood(food.id)}
                variant="outline"
                shape="square"
                className={cn(
                  'text-15sb h-10',
                  isSelected(food.id) ? StyleActive : ''
                )}
              >
                <HighlightText
                  text={food.name}
                  searchQuery={value}
                  highlightClassName="text-primary font-bold"
                />
              </Button>
            ))}
          </div>
        )}

        {/* 선택한 재료 리스트 */}
        <div>
          <div className="mt-5 mb-3 flex items-center justify-between">
            <h3 className="text-15sb text-gray-600">내가 선택한 재료</h3>
            {selectedFoodIds.length > 0 && (
              <Button
                onClick={() => clearAllFoods()}
                variant="outline"
                size="sm"
              >
                전체 삭제
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedFoodIds.length === 0 && (
              <div className="bg-secondary-light-green border-secondary-soft-green w-full rounded-xl border py-5 text-center">
                <p className="text-14 text-primary w-full">
                  재료를 2가지 이상 선택 해주세요!
                </p>
              </div>
            )}
            {selectedFoodIds.length > 0 &&
              selectedFoodIds.map(foodId => (
                <span
                  key={foodId}
                  className={cn(
                    'text-14b border-secondary-soft-green flex items-center justify-center gap-2 gap-x-1 rounded-[6px] border py-[3px] pr-2 pl-3',
                    StyleActive
                  )}
                >
                  {foodList.find(food => food.id === foodId)?.name}
                  <XIcon
                    size={12}
                    onClick={() => handleSelectedFoodRemove(foodId)}
                  />
                </span>
              ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 flex w-full justify-center py-[10px]">
        <Button
          onClick={handleSubmitSelectedFoods}
          disabled={getSelectedCount() < 2 || isSubmitting}
          className="relative"
        >
          {isSubmitting && <Loader2 className="mr-2 animate-spin" size={16} />}
          여유에 맞는 요리 추천받기
        </Button>
      </div>
    </>
  );
}

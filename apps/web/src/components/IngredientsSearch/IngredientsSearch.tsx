import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Loader2, XIcon } from 'lucide-react';

import { HighlightText } from '@/components/common/HighlightText';
import { SearchInput } from '@/components/common/SearchInput';
import { useFoodList } from '@/hooks/useFoodList';
import { cn } from '@/lib/utils';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import { filterByKoreanSearch } from '@/utils/koreanSearch';

import { Button } from '../common/Button';

import type { Food } from '@recipot/api';

export interface IngredientsSearchRef {
  submitSelectedFoods: () => void;
  getSelectedCount: () => number;
  isSubmitting: boolean;
}

const IngredientsSearch = forwardRef<
  IngredientsSearchRef,
  {
    onSelectionChange?: (count: number) => void;
    variant?: 'onboarding' | 'main';
  }
>(({ onSelectionChange, variant = 'onboarding' }, ref) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 검색어에 따른 필터링된 재료 목록 계산
  const filteredFoodList: Food[] = useMemo(() => {
    if (value === '' || foodList.length === 0) {
      return [];
    }
    return filterByKoreanSearch(foodList, value, food => food.name);
  }, [foodList, value]);

  // 선택된 재료 객체 목록을 미리 계산 (성능 최적화)
  const selectedFoods: Food[] = useMemo(() => {
    // 선택된 ID들을 실제 Food 객체로 변환
    const mappedFoods = selectedFoodIds.map((foodId: number) =>
      foodList.find((food: Food) => food.id === foodId)
    );

    // undefined인 항목들을 제거하고 Food 타입으로 필터링
    return mappedFoods.filter(
      (food: Food | undefined): food is Food => food !== undefined
    );
  }, [selectedFoodIds, foodList]);

  // 선택된 재료 개수 변경 시 부모에게 알림
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(getSelectedCount());
    }
  }, [selectedFoodIds, onSelectionChange, getSelectedCount]);

  // ref를 통해 외부에서 접근 가능한 메서드들 노출
  useImperativeHandle(
    ref,
    () => ({
      getSelectedCount: () => getSelectedCount(),
      isSubmitting,
      submitSelectedFoods: () => {
        setIsSubmitting(true);
        // 실제 제출 로직은 부모 컴포넌트에서 처리
        console.info('선택된 재료 제출:', selectedFoodIds);
        setIsSubmitting(false);
      },
    }),
    [selectedFoodIds, getSelectedCount, isSubmitting]
  );

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
    <div className="relative p-8">
      <SearchInput
        value={value}
        onChange={e => setValue(e.target.value)}
        onClear={handleClearSearch}
      />

      {/* 검색된 재료 리스트 */}
      {value && filteredFoodList.length > 0 && (
        <div className="absolute top-[84px] left-0 grid w-full grid-cols-3 gap-3 bg-white px-8 py-5">
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
        {selectedFoodIds.length !== 0 && (
          <div className="mt-5 mb-3 flex items-center justify-between">
            <h3 className="text-15sb text-gray-600">
              {variant === 'onboarding'
                ? '내가 선택한 재료'
                : '지금 내 냉장고에는..'}
            </h3>
            <Button onClick={() => clearAllFoods()} variant="outline" size="sm">
              전체 삭제
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedFoods.length > 0 &&
            selectedFoods.map((food: Food) => (
              <span
                key={food.id}
                className={cn(
                  'text-14b border-secondary-soft-green flex items-center justify-center gap-2 gap-x-1 rounded-[6px] border py-[3px] pr-2 pl-3',
                  StyleActive
                )}
              >
                {food.name}
                <button
                  type="button"
                  aria-label={`${food.name} 삭제`}
                  onClick={() => handleSelectedFoodRemove(food.id)}
                >
                  <XIcon size={12} />
                </button>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
});

IngredientsSearch.displayName = 'IngredientsSearch';

export default IngredientsSearch;

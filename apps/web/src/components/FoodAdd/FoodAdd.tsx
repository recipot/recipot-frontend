import { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';

import { HighlightText } from '@/components/common/HighlightText';
import { SearchInput } from '@/components/common/SearchInput';
import { cn } from '@/lib/utils';
import { filterByKoreanSearch } from '@/utils/koreanSearch';

import { Button } from '../common/Button';

const foodList = [
  {
    id: 1,
    name: '감자',
  },
  {
    id: 2,
    name: '고구마',
  },
  {
    id: 3,
    name: '당근',
  },
  {
    id: 4,
    name: '양파',
  },
  {
    id: 5,
    name: '대파',
  },
  {
    id: 6,
    name: '마늘',
  },
  {
    id: 7,
    name: '가지',
  },
  {
    id: 8,
    name: '간장',
  },
  {
    id: 9,
    name: '갈치',
  },
  {
    id: 10,
    name: '고등어',
  },
  {
    id: 11,
    name: '굴',
  },
  {
    id: 12,
    name: '김치',
  },
  {
    id: 13,
    name: '나물',
  },
  {
    id: 14,
    name: '닭고기',
  },
  {
    id: 15,
    name: '돼지고기',
  },
  {
    id: 16,
    name: '두부',
  },
  {
    id: 17,
    name: '라면',
  },
  {
    id: 18,
    name: '멸치',
  },
  {
    id: 19,
    name: '무',
  },
  {
    id: 20,
    name: '배추',
  },
];

export default function FoodAdd({
  onSubmit,
}: {
  onSubmit: (selectedFoods: number[]) => void;
}) {
  const [value, setValue] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<number[]>([]);
  const [filteredFoodList, setFilteredFoodList] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (value === '') {
      setFilteredFoodList([]);
    } else {
      setFilteredFoodList(
        filterByKoreanSearch(foodList, value, food => food.name)
      );
    }
  }, [value]);

  const StyleActive =
    'border-secondary-soft-green bg-secondary-light-green text-primary';

  const handleSelectedFood = (foodId: number) => {
    const food = foodList.find(f => f.id === foodId);
    const isAlreadySelected = selectedFoods.includes(foodId);

    if (isAlreadySelected) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
      // TODO: 추후 공통 스낵바 컴포넌트로 교체 예정
      console.log(`${food?.name}이(가) 제거되었습니다.`);
    } else {
      setSelectedFoods([...selectedFoods, foodId]);
      // TODO: 추후 공통 스낵바 컴포넌트로 교체 예정
      console.log(`${food?.name}이(가) 추가되었습니다.`);
    }
  };

  const handleSelectedFoodRemove = (foodId: number) => {
    setSelectedFoods(selectedFoods.filter(id => id !== foodId));
  };

  const handleClearSearch = () => {
    setValue('');
  };

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
                  selectedFoods.includes(food.id) ? StyleActive : ''
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
          <h3 className="text-15sb mt-5 mb-3 text-gray-600">
            내가 선택한 재료
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedFoods.length === 0 && (
              <div className="bg-secondary-light-green border-secondary-soft-green w-full rounded-xl border py-5 text-center">
                <p className="text-14 text-primary w-full">
                  재료를 2가지 이상 선택 해주세요!
                </p>
              </div>
            )}
            {selectedFoods.length > 0 &&
              selectedFoods.map(foodId => (
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
          onClick={() => onSubmit(selectedFoods)}
          disabled={selectedFoods.length < 2}
        >
          여유에 맞는 요리 추천받기
        </Button>
      </div>
    </>
  );
}

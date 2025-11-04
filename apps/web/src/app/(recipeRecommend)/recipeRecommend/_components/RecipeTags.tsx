import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFoodList } from '@/hooks/useFoodList';
import { cn } from '@/lib/utils';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

const RecipeTags = () => {
  const { data: foodList = [], isLoading } = useFoodList();
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const stopPointerPropagation = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  const stopTouchPropagation = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  const stopWheelPropagation = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  // ID를 이름으로 매핑
  const selectedFoodNames = useMemo(() => {
    return selectedFoodIds
      .map(id => foodList.find(food => food.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  }, [selectedFoodIds, foodList]);

  const measureOverflow = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) {
      setIsOverflowing(false);
      return;
    }

    const MAX_CONTAINER_WIDTH = 310;
    setIsOverflowing(inner.scrollWidth > MAX_CONTAINER_WIDTH);
  }, []);

  useEffect(() => {
    measureOverflow();

    const inner = innerRef.current;
    let observer: ResizeObserver | undefined;

    if (inner && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measureOverflow();
      });
      observer.observe(inner);
    }

    window.addEventListener('resize', measureOverflow);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureOverflow);
    };
  }, [measureOverflow, selectedFoodNames]);

  // 로딩 중이거나 foodList가 준비되지 않았거나 식재료가 없는 경우 렌더링하지 않음
  if (isLoading || foodList.length === 0 || selectedFoodNames.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'recipe-tags no-scrollbar mx-auto mb-4 flex w-full flex-nowrap items-center overflow-x-hidden',
        isOverflowing
          ? 'justify-start overflow-x-auto'
          : 'max-w-[310px] justify-center'
      )}
      onPointerDown={stopPointerPropagation}
      onPointerMove={stopPointerPropagation}
      onTouchStart={stopTouchPropagation}
      onTouchMove={stopTouchPropagation}
      onWheel={stopWheelPropagation}
    >
      <div
        ref={innerRef}
        className="flex w-max flex-nowrap items-center gap-[6px]"
      >
        {selectedFoodNames.map((ingredient, index) => (
          <div
            key={ingredient}
            className={cn(
              'bg-secondary-light-green border-secondary-soft-green flex-shrink-0 rounded-[6px] border px-3 py-[3px] text-[#53880A]',
              isOverflowing && index === 0 && 'ml-[50px]',
              isOverflowing &&
                index === selectedFoodNames.length - 1 &&
                'mr-[50px]'
            )}
          >
            <p className="text-14b whitespace-nowrap">{ingredient}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeTags;

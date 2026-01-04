import React from 'react';

import {
  getEmojiByConditionId,
  moodToConditionId,
} from '@/app/onboarding/_utils';
import type { Condition } from '@/app/recipe/[id]/types/recipe.types';
import type { MoodType } from '@/components/EmotionState';

interface RecipeTitleProps {
  condition?: Condition | null | undefined;
}

const RecipeTitle = ({ condition }: RecipeTitleProps) => {
  const getTitleByCondition = (condition: Condition | null | undefined) => {
    if (!condition?.name) {
      return '요리할 여유가 그저 그래요'; // 기본값
    }

    const conditionId = moodToConditionId(condition.name as MoodType);
    switch (conditionId) {
      case 1:
        return '요리할 여유가 거의...없어요';
      case 2:
        return '요리할 여유가 그저 그래요';
      case 3:
        return '요리할 여유가 충분해요!';

      default:
        return '요리할 여유가 그저 그래요';
    }
  };

  const title = getTitleByCondition(condition);
  const conditionId = condition?.name
    ? moodToConditionId(condition.name as MoodType)
    : 2;
  const emoji = getEmojiByConditionId(conditionId);

  return (
    <div className="mb-5 flex w-full items-center justify-center self-stretch">
      <h2 className="text-22 mr-[2px]">{title}</h2>
      <div className="text-24 flex h-6 w-6 items-center justify-center">
        <span className="text-2xl">{emoji}</span>
      </div>
    </div>
  );
};

export default RecipeTitle;

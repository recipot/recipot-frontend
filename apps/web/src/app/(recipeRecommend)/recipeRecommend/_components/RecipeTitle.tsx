import React from 'react';

import { moodToConditionId } from '@/app/onboarding/_utils';
import type { Condition } from '@/app/recipe/[id]/types/recipe.types';
import type { MoodType } from '@/components/EmotionState';

interface RecipeTitleProps {
  condition?: Condition | null | undefined;
}

const RecipeTitle = ({ condition }: RecipeTitleProps) => {
  const getTitleByCondition = (condition: Condition | null | undefined) => {
    console.log('RecipeTitle - condition:', condition);
    if (!condition?.name) {
      console.log('RecipeTitle - condition.name이 없음');
      return '요리할 여유가 그저 그래요'; // 기본값
    }

    const conditionId = moodToConditionId(condition.name as MoodType);
    console.log(
      'RecipeTitle - conditionId:',
      conditionId,
      'condition.name:',
      condition.name
    );
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

  // 조건에 따른 이모지 매핑 (유니코드 사용)
  const getEmojiByCondition = (condition: Condition | null | undefined) => {
    if (!condition?.name) {
      return '\u{1F611}';
    }

    const conditionId = moodToConditionId(condition.name as MoodType);
    switch (conditionId) {
      case 1:
        return '\u{1F623}';
      case 2:
        return '\u{1F611}';
      case 3:
        return '\u{1F60A}';

      default:
        return '\u{1F611}';
    }
  };

  const title = getTitleByCondition(condition);
  const emoji = getEmojiByCondition(condition);

  return (
    <div className="flex w-full items-center justify-center self-stretch">
      <h2 className="text-22 mr-[2px]">{title}</h2>
      <div className="text-24 flex h-6 w-6 items-center justify-center">
        <span className="text-2xl">{emoji}</span>
      </div>
    </div>
  );
};

export default RecipeTitle;

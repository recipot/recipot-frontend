import React from 'react';

import type { Condition } from '@/types/recipe.types';

interface RecipeTitleProps {
  condition?: Condition | null | undefined;
}

const RecipeTitle = ({ condition }: RecipeTitleProps) => {
  const getTitleByCondition = (condition: Condition | null | undefined) => {
    if (!condition) {
      return '요리할 여유가 그저 그래요'; // 기본값
    }

    switch (condition.name) {
      case '힘들어':
        return '요리할 여유가 거의...없어요';
      case '충분해':
        return '요리할 여유가 충분해요!';
      case '그럭저럭':
        return '요리할 여유가 그저 그래요';
      default:
        return '요리할 여유가 그저 그래요';
    }
  };

  // 조건에 따른 이모지 매핑 (유니코드 사용)
  const getEmojiByCondition = (condition: Condition | null | undefined) => {
    if (!condition) {
      return '\u{1F611}';
    }

    switch (condition.name) {
      case '힘들어':
        return '\u{1F623}';
      case '그럭저럭':
        return '\u{1F611}';
      case '충분해':
        return '\u{1F60A}';
    }
  };

  const title = getTitleByCondition(condition);
  const emoji = getEmojiByCondition(condition);

  return (
    <div className="flex w-full items-center justify-center self-stretch">
      <h2 className="text-22 mr-[2px]">{title}</h2>
      <div className="text-24 flex h-6 w-6 items-center">{emoji}</div>
    </div>
  );
};

export default RecipeTitle;

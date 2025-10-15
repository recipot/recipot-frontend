import React from 'react';

// TODO : 추후 title로 동적 할당 필요

const RecipeTitle = ({
  title = '요리할 여유가 그저 그래요',
}: {
  title?: string;
}) => {
  return (
    <div className="flex w-full items-center justify-center self-stretch">
      {/* TODO : 감정에 따른 감정 상태 표현 변경 필요 */}
      <h2 className="text-22 mr-[2px]">{title}</h2>
      <div className="text-24 flex h-6 w-6 items-center">😑</div>
    </div>
  );
};

export default RecipeTitle;

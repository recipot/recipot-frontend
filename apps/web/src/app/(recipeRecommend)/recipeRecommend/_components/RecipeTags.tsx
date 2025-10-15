import React from 'react';

const RecipeTags = ({
  selectedIngredients,
}: {
  selectedIngredients: string[];
}) => {
  return (
    <div className="mt-5 mb-[16px] px-4">
      <div className="flex items-center justify-center gap-[6px]">
        {selectedIngredients.map(ingredient => (
          <div
            key={ingredient}
            className="bg-secondary-light-green border-secondary-soft-green rounded-[6px] border px-2 py-[2px] text-[#53880A]"
          >
            <p className="text-14b">{ingredient}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeTags;

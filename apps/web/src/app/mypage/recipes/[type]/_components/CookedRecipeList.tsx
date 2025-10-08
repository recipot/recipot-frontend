import { Button } from '@/components/common/Button';
import { useScrollGradient } from '@/hooks/useScrollGradient';
import type { CookedRecipe, CookedRecipeListProps } from '@/types/MyPage.types';

import RecipeCard from './RecipeCard';

export default function CookedRecipeList({
  config,
  onToggleSave,
  recipes,
}: CookedRecipeListProps) {
  const { scrollRef, showGradient } = useScrollGradient([recipes]);

  if (recipes.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        목록이 비어있습니다.
      </div>
    );
  }

  const recipesByDate = recipes.reduce<Record<string, CookedRecipe[]>>(
    (acc, recipe) => {
      const date = recipe.cookedDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(recipe);
      return acc;
    },
    {}
  );

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="h-[calc(100vh-100px)] max-h-full overflow-y-auto rounded-[1.25rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex flex-col gap-4 pb-3">
          {Object.entries(recipesByDate).map(([date, recipesInGroup]) => (
            <li
              key={date}
              className="rounded-[1.25rem] p-3"
              style={{ backgroundColor: config.themeColor }}
            >
              <div className="flex items-center justify-center px-3 pt-[0.5938rem] pb-[0.8438rem]">
                <span className="text-18sb text-[#66A80F]">{date}</span>
              </div>

              <ul className="flex flex-col gap-3">
                {recipesInGroup.map(recipe => (
                  <li key={recipe.id}>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white px-2 pt-2 pb-5 shadow-sm">
                      <RecipeCard recipe={recipe} onToggleSave={onToggleSave} />
                      {recipe.reviewId ? (
                        <div className="w-full px-3">
                          <Button
                            variant="outline"
                            size="md"
                            className="text-15sb w-full py-3"
                          >
                            후기를 남기셨어요!
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full px-3">
                          <Button size="full" className="text-15sb py-3">
                            맛있게 드셨나요? 후기를 남겨주세요
                          </Button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {showGradient && (
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[5.313rem] rounded-b-[1.25rem]"
          style={{
            background: `linear-gradient(to top, ${config.overLayColor}, transparent)`,
          }}
        />
      )}
    </div>
  );
}

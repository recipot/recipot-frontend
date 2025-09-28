import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';

import RecipeCard from './RecipeCard';

import type {
  CookedRecipe,
  CookedRecipeListProps,
} from '../../../../../types/MyPage.types';

export default function CookedRecipeList({
  config,
  recipes,
}: CookedRecipeListProps) {
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
    <div className="max-h-full rounded-[1.25rem]">
      <ul className="flex flex-col gap-4">
        {Object.entries(recipesByDate).map(([date, recipesInGroup]) => (
          <li
            key={date}
            className="rounded-[1.25rem] p-3"
            style={{ backgroundColor: config.themeColor }}
          >
            <div className="flex items-center justify-between px-3 pt-2 pb-3">
              <span className="text-18sb text-[#66A80F]">{date}</span>
              <div className="flex items-center gap-1">
                <CookIcon size={18} />
                <span className="text-16 font-medium text-[#66A80F]">
                  내가 만든 요리
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {recipesInGroup.map(recipe => (
                <li key={recipe.id}>
                  <div className="flex flex-col gap-1 rounded-2xl bg-white pb-5 shadow-sm">
                    <RecipeCard recipe={recipe} />
                    {recipe.reviewId ? (
                      <div className="w-full px-3">
                        <Button
                          variant="outline"
                          size="full"
                          className="text-15sb py-3"
                        >
                          남긴 후기 보기
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
  );
}

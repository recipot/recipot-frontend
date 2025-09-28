import { MyFileIcon, MyOpenFileIcon } from '@/components/Icons';

import RecipeCard from './RecipeCard';

import type { DefaultRecipeListProps } from '../../../../../types/MyPage.types';

export default function DefaultRecipeList({
  config,
  recipes,
  type,
}: DefaultRecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        목록이 비어있습니다.
      </div>
    );
  }

  const isSaved = type === 'saved';

  return (
    <div className="relative">
      <div
        className="h-[calc(100vh-100px)] max-h-full overflow-y-auto rounded-[1.25rem] px-3 pt-2 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ backgroundColor: config.themeColor }}
      >
        <div className="flex items-center justify-center gap-1.5 pt-6 pb-3">
          {isSaved ? (
            <MyFileIcon size={18} color="#228be6" />
          ) : (
            <MyOpenFileIcon size={18} color="#845ef7" />
          )}
          <span className="text-16" style={{ color: config.titleColor }}>
            {config.title}
          </span>
        </div>
        <ul className="flex flex-col gap-3 pb-10">
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      </div>
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-[5.313rem] rounded-b-[1.25rem]"
        style={{
          background: `linear-gradient(to top, ${config.overLayColor}, transparent)`,
        }}
      />
    </div>
  );
}

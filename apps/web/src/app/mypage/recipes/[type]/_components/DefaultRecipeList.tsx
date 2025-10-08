import { useEffect, useRef, useState } from 'react';

import type { DefaultRecipeListProps } from '@/types/MyPage.types';

import RecipeCard from './RecipeCard';

export default function DefaultRecipeList({
  config,
  onToggleSave,
  recipes,
}: DefaultRecipeListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { clientHeight, scrollHeight, scrollTop } = scrollRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 1;
        setShowGradient(isScrollable && !isAtBottom);
      }
    };

    checkScroll();
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      scrollElement?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [recipes]);

  if (recipes.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        목록이 비어있습니다.
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="h-[calc(100vh-100px)] max-h-full overflow-y-auto rounded-[1.25rem] px-3 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ backgroundColor: config.themeColor }}
      >
        <ul className="flex flex-col gap-[0.875rem] pb-3">
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} onToggleSave={onToggleSave} />
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

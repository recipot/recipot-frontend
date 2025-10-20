import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { useScrollGradient } from '@/hooks/useScrollGradient';
import type { DefaultRecipeListProps } from '@/types/MyPage.types';

import RecipeCard from './RecipeCard';

export default function DefaultRecipeList({
  config,
  onToggleSave,
  recipes,
}: DefaultRecipeListProps) {
  const { scrollRef, showGradient } = useScrollGradient([recipes]);

  if (recipes.length === 0) {
    return (
      <div className="relative">
        <div
          className="h-[calc(100vh-100px)] max-h-full rounded-[1.25rem] px-3"
          style={{
            backgroundImage: `url(${config.noneBackImage})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-22sb text-gray-900">
                앗, 냉장고가 텅 비었어요!
              </p>
            </div>

            <div className="relative">
              <Image
                src="/mypage/none-refrigrator.png"
                alt="빈 냉장고"
                width={160}
                height={160}
                priority
              />
            </div>

            <Button
              shape="round"
              variant="outline"
              className="text-17sb bg-white px-6 py-3 text-gray-900"
              onClick={() => {
                // TODO: 레시피 추천 페이지로 이동하는 로직
                console.info('레시피 추천 받으러 가기');
              }}
            >
              레시피 추천 받으러 가기
            </Button>
          </div>
        </div>
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

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { useScrollGradient } from '@/hooks/useScrollGradient';
import type { DefaultRecipeListProps } from '@/types/MyPage.types';

import RecipeCard from './RecipeCard';

export default function DefaultRecipeList({
  config,
  onToggleSave,
  recipes,
  type,
}: DefaultRecipeListProps) {
  const { scrollRef, showGradient } = useScrollGradient([recipes]);
  const router = useRouter();
  const isSavedRecipeList = type === 'saved';
  const noneRecipeText = type === 'saved' ? '보관한' : '최근 본';

  if (recipes.length === 0) {
    return (
      <div className="relative">
        <div className="relative h-[calc(100vh-100px)] max-h-full rounded-[1.25rem] px-3">
          <div
            className="absolute inset-0 rounded-[1.25rem] opacity-70"
            style={{
              backgroundImage: `url(${config.noneBackImage})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
            }}
          />

          <div className="relative flex h-full flex-col items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-22sb text-gray-900">
                아직 {noneRecipeText} 레시피가 없어요
              </p>
              <p className="text-22sb text-gray-900">
                지금부터 하나씩 채워볼까요?
              </p>
            </div>

            <div className="relative">
              <Image
                src="/mypage/none-refrigerator.png"
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
              onClick={() => router.push('/')}
            >
              레시피 채우러 갈게요
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
              <RecipeCard
                recipe={recipe}
                onToggleSave={onToggleSave}
                isSavedRecipe={isSavedRecipeList}
              />
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

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { ReviewBottomSheet } from '@/components/review/ReviewBottomSheet';
import { useScrollGradient } from '@/hooks/useScrollGradient';
import type { CookedRecipeListProps } from '@/types/MyPage.types';

import RecipeCard from './RecipeCard';

import type { CompletedRecipe } from '@recipot/api';

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

export default function CookedRecipeList({
  config,
  onToggleSave,
  recipes,
}: CookedRecipeListProps) {
  const { scrollRef, showGradient } = useScrollGradient([recipes]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<CompletedRecipe | null>(
    null
  );

  const handleOpenReview = (recipe: CompletedRecipe) => {
    setSelectedRecipe(recipe);
    setIsReviewOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setSelectedRecipe(null);
  };

  const handleSubmitReview = (reviewData: any) => {
    // TODO: 리뷰 제출 API 호출
    console.log('리뷰 제출:', reviewData);
    handleCloseReview();
  };

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
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-9 text-center">
              <p className="text-22sb text-gray-900">
                앗, 냉장고가 텅 비었어요!
              </p>
            </div>

            <div className="relative">
              <Image
                src="/mypage/none-refrigrator.png"
                alt="빈 냉장고"
                width={142}
                height={142}
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

  // createdAt 기준으로 날짜별 그룹화
  const recipesByDate = recipes.reduce<Record<string, CompletedRecipe[]>>(
    (acc, recipe) => {
      const date = formatDate(recipe.createdAt);
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
                      {recipe.isReviewed === 1 ? (
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
                          <Button
                            size="full"
                            className="text-15sb py-3"
                            onClick={() => handleOpenReview(recipe)}
                          >
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

      {selectedRecipe && (
        <ReviewBottomSheet
          isOpen={isReviewOpen}
          onClose={handleCloseReview}
          onSubmit={handleSubmitReview}
          reviewData={{
            completionCount: selectedRecipe.isCompleted!,
            recipeId: selectedRecipe.recipeId.toString(),
            recipeImage: selectedRecipe.recipeImages[0],
            recipeName: selectedRecipe.recipeTitle,
          }}
        />
      )}
    </div>
  );
}

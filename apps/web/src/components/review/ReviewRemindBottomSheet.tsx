'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CloseIcon } from '../Icons';
import { Drawer, DrawerClose, DrawerContent } from '../ui/drawer';
import { ReviewRecipeCard, type ReviewRecipeData } from './ReviewRecipeCard';

export function ReviewRemindBottomSheet() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);

  const handleRecipeClick = (recipeId: number) => {
    // TODO : URL 수정 여부 확인 필요
    router.push(`/mypage/recipes/cooked/${recipeId}`);
  };

  const recipes: ReviewRecipeData[] = [
    {
      alt: '새우 땅콩버거 버터 버거 레시피 이미지',
      description: '2번째 레시피 해먹기 완료!',
      id: 1,
      imageUrl: '/recipeImage.png',
      title: '새우 땅콩버거 버터 버거',
    },
    {
      alt: '새우 땅콩버거 버터 버거 레시피 이미지',
      description: '2번째 레시피 해먹기 완료!',
      id: 2,
      imageUrl: '/recipeImage.png',
      title: '새우 땅콩버거 버터 버거',
    },
    {
      alt: '새우 땅콩버거 버터 버거 레시피 이미지',
      description: '2번째 레시피 해먹기 완료!',
      id: 3,
      imageUrl: '/recipeImage.png',
      title: '새우 땅콩버거 버터 버거',
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="mx-auto w-full max-w-[430px]">
        <div>
          <div className="overflow-y-auto px-6 pb-6">
            {/* 헤더 - 상단에 고정 */}
            <header className="sticky top-0 z-10 -mx-4 flex justify-end bg-white px-4">
              <DrawerClose
                type="button"
                className="rounded-full p-1.5"
                aria-label="리뷰 리마인드 바텀시트 닫기"
              >
                <CloseIcon size={24} color="#626A7A" />
                <span className="sr-only">닫기</span>
              </DrawerClose>
            </header>

            {/* 메인 컨텐츠 영역 */}
            <main className="mt-2">
              {/* 리뷰 요청 섹션 */}
              <section
                aria-labelledby="review-request-title"
                className="space-y-8"
              >
                <div className="mb-[13px]">
                  <h1
                    id="review-request-title"
                    className="text-24 mb-2 text-gray-900"
                  >
                    어제 드신 메뉴 어떠셨나요?
                    <br />
                    리뷰를 작성해 보세요
                  </h1>
                </div>

                {/* 레시피 정보 카드 */}
                {recipes.map(recipe => (
                  <ReviewRecipeCard
                    key={recipe.id}
                    onClick={() => handleRecipeClick(recipe.id)}
                    recipe={recipe}
                  />
                ))}
              </section>
            </main>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

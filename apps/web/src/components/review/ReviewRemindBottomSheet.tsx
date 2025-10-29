'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAuth } from '@recipot/contexts';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import type { PendingReviewsResponse, Recipe } from '@/types/recipe.types';

import { CloseIcon } from '../Icons';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '../ui/drawer';
import { ReviewRecipeCard, type ReviewRecipeData } from './ReviewRecipeCard';

const STORAGE_KEY = 'reviewRemindLastShown';

export function ReviewRemindBottomSheet() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [recipes, setRecipes] = useState<ReviewRecipeData[]>([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  // 24시간 경과 여부 체크
  const shouldShowBottomSheet = () => {
    if (typeof window === 'undefined') return false;

    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (!lastShown) return true;

    const lastShownTime = new Date(lastShown).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    return now - lastShownTime >= twentyFourHours;
  };

  // API에서 데이터 로드
  const loadPendingReviews = useCallback(async () => {
    try {
      setLoading(true);
      const axiosResponse = await axios.get(`api/v1/users/pending-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response: PendingReviewsResponse = axiosResponse.data;

      if (response.data.totalCount === 0) {
        setIsOpen(false);
        return;
      }

      // 각 레시피 ID로 상세 정보 조회
      const recipePromises = response.data.completedRecipeIds.map(
        async (id: number) => {
          try {
            const recipeDetail: { data: { data: Recipe } } = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            return {
              alt: `${recipeDetail.data.data.title} 레시피 이미지`,
              description: '레시피 해먹기 완료!',
              id: recipeDetail.data.data.id,
              imageUrl:
                recipeDetail.data.data.images[0]?.imageUrl ??
                '/recipeImage.png',
              title: recipeDetail.data.data.title,
            };
          } catch (error) {
            console.error(`Failed to load recipe ${id}:`, error);
            return null;
          }
        }
      );
      const recipeDetails = await Promise.all(recipePromises);
      const validRecipes = recipeDetails.filter(
        (recipe: ReviewRecipeData | null): recipe is ReviewRecipeData =>
          recipe !== null
      );

      setRecipes(validRecipes);
      setIsOpen(validRecipes.length > 0 && shouldShowBottomSheet());
    } catch (error) {
      console.error('Failed to load pending reviews:', error);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPendingReviews();
  }, [loadPendingReviews]);

  const handleRecipeClick = (recipeId: number) => {
    router.push(`/mypage/recipes/cooked/${recipeId}`);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    // 현재 시간을 localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
  };

  // 로딩 중이거나 바텀시트를 표시하지 않을 때는 null 반환
  if (loading || !isOpen) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="mx-auto w-full max-w-[430px]">
        <VisuallyHidden asChild>
          <DrawerTitle>어제 드신 메뉴 어떠셨나요?</DrawerTitle>
        </VisuallyHidden>
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

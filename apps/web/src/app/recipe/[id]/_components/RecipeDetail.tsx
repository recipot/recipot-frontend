'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@recipot/contexts';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';
import { useScrollSpy } from '@/hooks/useScrollSpy';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import RecipeDetailHeader from './RecipeDetailHeader';
import StepSection from './StepSection';
import TabNavigation from './TabNavigation';

import type { ApiResponse, Recipe, TabId } from '../types/recipe.types';

export function RecipeDetail({ recipeId }: { recipeId: string }) {
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!token) return;
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${recipeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipeData(response.data.data);
      } catch (error) {
        console.error('Recipe fetch error:', error);
      }
    };
    fetchRecipe();
  }, [token, recipeId]);

  // 섹션 ID 배열 생성
  const sectionIds = useMemo(() => ['ingredients', 'cookware', 'steps'], []);

  const { activeSection, gnbRef } = useScrollSpy(sectionIds, {
    offset: 80, // 탭 높이 + 여유공간
  });

  const [isInitialState, setIsInitialState] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      if (isInitialState) {
        setIsInitialState(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInitialState]);

  const handleTabClick = (tabId: TabId, e: React.MouseEvent) => {
    if (isInitialState) {
      setIsInitialState(false);
    }
    e.preventDefault();

    const targetElement = document.getElementById(tabId);
    if (targetElement && tabContainerRef.current) {
      const tabHeight = tabContainerRef.current.offsetHeight;
      const elementTop = targetElement.offsetTop - tabHeight - 20;

      window.scrollTo({
        behavior: 'smooth',
        top: Math.max(0, elementTop),
      });
    }
  };

  if (!recipeData) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-gray-600">레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const handleCookingOrder = () => {
    router.push(`/recipe/${recipeId}/cooking-order`);
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50">
      <div className="w-[390px] bg-gray-100">
        <RecipeDetailHeader recipe={recipeData} />

        <TabNavigation
          activeTab={isInitialState ? 'ingredients' : (activeSection as TabId)}
          gnbRef={gnbRef}
          onTabClick={handleTabClick}
          tabContainerRef={tabContainerRef}
        />

        <div className="px-4 pb-24">
          <div className="bg-secondary-light-green border-secondary-soft-green my-4 rounded-2xl border-[1px] px-5 py-4">
            <p className="text-15sb text-primary-pressed">
              {recipeData?.healthPoints.map(point => point.content).join(', ')}
            </p>
          </div>

          <IngredientsSection
            ingredients={recipeData.ingredients}
            seasonings={recipeData?.seasonings}
          />

          <CookwareSection cookware={recipeData?.tools} />

          <StepSection steps={recipeData?.steps} />
        </div>

        <div className="fixed right-0 bottom-0 left-0 flex justify-center">
          <div className="flex w-[390px] bg-white/50 px-[50px] py-[10px]">
            <Button
              variant="default"
              size="full"
              className="bg-primary px-8 py-[15px]"
              onClick={handleCookingOrder}
            >
              <CookIcon className="mr-[6px] h-6 w-6" color="#ffffff" />
              <p className="text-17sb text-white">요리하러 가기</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;

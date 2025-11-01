'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Element, scrollSpy } from 'react-scroll';
import { recipe } from '@recipot/api';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';
import { useViewportBasedPadding } from '@/hooks';
import { isProduction } from '@/lib/env';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import RecipeDetailHeader from './RecipeDetailHeader';
import RecipeHero from './RecipeHero';
import StepSection from './StepSection';
import TabNavigation from './TabNavigation';

import type { Recipe, TabId } from '../types/recipe.types';

const SCROLL_OFFSET = 120;

export function RecipeDetail({ recipeId }: { recipeId: string }) {
  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('ingredients');
  const bottomPadding = useViewportBasedPadding({
    minPadding: 400,
    ratio: 0.8,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!useCookieAuth && !token) return;
      try {
        const data = await recipe.getRecipeDetail(recipeId);
        setRecipeData(data);
      } catch (error) {
        console.error('Recipe fetch error:', error);
      }
    };
    fetchRecipe();
  }, [token, recipeId, useCookieAuth]);

  useEffect(() => {
    if (!recipeData) return;

    // DOM 렌더링 완료 후 scrollSpy 초기화
    const timer = setTimeout(() => {
      scrollSpy.update();
    }, 300);

    setActiveTab('ingredients');

    return () => clearTimeout(timer);
  }, [recipeData]);

  // 컴포넌트 마운트 및 데이터 로드 후 scrollSpy 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && recipeData) {
      const timer = setTimeout(() => {
        scrollSpy.update();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [recipeData]);

  const contentStyle = useMemo(
    () => ({ paddingBottom: `${bottomPadding}px` }),
    [bottomPadding]
  );

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

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-100">
      <div>
        <RecipeDetailHeader recipe={recipeData} />

        <RecipeHero recipe={recipeData} />
        <TabNavigation
          activeTab={activeTab}
          offset={SCROLL_OFFSET}
          onTabChange={handleTabChange}
        />
        <div className="px-4" style={contentStyle}>
          <div className="bg-secondary-light-green border-secondary-soft-green my-4 rounded-2xl border-[1px] px-5 py-4">
            <p className="text-15sb text-primary-pressed">
              {recipeData?.healthPoints?.map(point => point.content).join(', ')}
            </p>
          </div>

          <Element
            name="ingredients"
            id="ingredients"
            className="scroll-element"
          >
            <IngredientsSection
              ingredients={recipeData.ingredients}
              seasonings={recipeData?.seasonings}
            />
          </Element>

          <Element name="cookware" id="cookware" className="scroll-element">
            <CookwareSection cookware={recipeData?.tools} />
          </Element>

          <Element name="steps" id="steps" className="scroll-element">
            <StepSection steps={recipeData?.steps} />
          </Element>
        </div>

        <div className="fixed right-0 bottom-0 left-0 flex justify-center">
          <div className="flex w-full bg-gray-100/50 px-[50px] py-[10px]">
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

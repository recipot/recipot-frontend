'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';
import { useIntersectionScrollSpy } from '@/hooks/useIntersectionScrollSpy';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import RecipeHeader from './RecipeHeader';
import StepSection from './StepSection';
import TabNavigation from './TabNavigation';

import type { ApiResponse, TabId } from '../types/recipe.types';

export function RecipeDetail({ recipeId }: { recipeId: string }) {
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const cookwareRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => [ingredientsRef, cookwareRef, stepsRef],
    []
  );

  const [error] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/debug`,
        {
          role: 'U01001',
          userId: '1',
        }
      );
      // console.log(data.data.accessToken, 'getToken');
      setToken(data.data.accessToken);
    };
    getAccessToken();
  }, []);

  const { data: recipeResponse, isLoading } = useQuery({
    enabled: !!token, // 토큰이 있을 때만 쿼리 실행
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${recipeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    queryKey: ['recipe', recipeId],
  });

  const recipeData = recipeResponse?.data;

  const { activeSection: activeTab, setActiveSection } =
    useIntersectionScrollSpy({
      initialState: 'ingredients',
      rootRef: tabContainerRef,
      sectionRefs,
    });

  const handleTabClick = (tabId: TabId) => {
    setActiveSection(tabId);

    let targetRef: React.RefObject<HTMLDivElement> | null = null;

    switch (tabId) {
      case 'ingredients':
        targetRef = ingredientsRef;
        break;
      case 'cookware':
        targetRef = cookwareRef;
        break;
      case 'steps':
        targetRef = stepsRef;
        break;
    }

    if (targetRef?.current && tabContainerRef.current) {
      // 탭 컨테이너 높이를 고려한 정확한 스크롤
      const tabHeight = tabContainerRef.current.offsetHeight;
      const elementTop = targetRef.current.offsetTop - tabHeight - 20;

      window.scrollTo({
        behavior: 'smooth',
        top: Math.max(0, elementTop),
      });
    }
  };

  if (isLoading || !token) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-gray-600">레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <Button
            variant="default"
            onClick={() => window.location.reload()}
            className="bg-primary px-4 py-2"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50">
      <div className="w-[390px] bg-gray-100">
        <RecipeHeader recipe={recipeData} />

        <TabNavigation
          activeTab={activeTab as TabId}
          onTabClick={handleTabClick}
          tabContainerRef={tabContainerRef}
        />

        <div className="px-4 pb-24">
          <div className="bg-secondary-light-green border-secondary-soft-green my-4 rounded-2xl border-[1px] px-5 py-4">
            <p className="text-15sb text-primary-pressed">
              {recipeData?.healthPoints.map(point => point.content)}
            </p>
          </div>

          <IngredientsSection
            ingredients={recipeData.ingredients}
            seasonings={recipeData?.seasonings}
            ingredientsRef={ingredientsRef}
          />

          <CookwareSection
            cookware={recipeData?.tools}
            cookwareRef={cookwareRef}
          />

          <StepSection steps={recipeData?.steps} stepsRef={stepsRef} />
        </div>

        <div className="fixed right-0 bottom-0 left-0 flex justify-center">
          <div className="flex w-[390px] bg-white/50 px-[50px] py-[10px]">
            <Button
              variant="default"
              size="full"
              className="bg-primary px-8 py-[15px]"
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

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Element, scrollSpy } from 'react-scroll';
import { recipe } from '@recipot/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Toast } from '@/components/common/Toast';
import { CookIcon } from '@/components/Icons';
import { useIsLoggedIn, useToast, useViewportBasedPadding } from '@/hooks';
import { useIsKakaoInApp } from '@/hooks/useIsKakaoInApp';
import { usePostRecentRecipe } from '@/hooks/usePostRecentRecipe';
import { useApiErrorModalStore } from '@/stores';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import { RecipeDetailHeader } from './RecipeDetailHeader';
import RecipeHero from './RecipeHero';
import StepSection from './StepSection';
import TabNavigation from './TabNavigation';

import type { Recipe, TabId } from '../types/recipe.types';

const SCROLL_OFFSET = 120;

// 메타 태그 업데이트 헬퍼 함수
const updateMetaTag = (
  selector: string,
  attribute: 'name' | 'property',
  value: string,
  content: string
) => {
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

// Open Graph 메타 태그 업데이트 헬퍼 함수
const updateOGTag = (property: string, content: string) => {
  updateMetaTag(`meta[property="${property}"]`, 'property', property, content);
};

export function RecipeDetail({ recipeId }: { recipeId: number }) {
  const isLoggedIn = useIsLoggedIn();
  const {
    data: recipeData,
    isError,
    isLoading,
  } = useQuery<Recipe, Error>({
    enabled: !!recipeId, // recipeId가 있을 때만 조회
    queryFn: async () => {
      try {
        return await recipe.getRecipeDetail(recipeId);
      } catch (error) {
        useApiErrorModalStore.getState().showError({
          isFatal: false,
          message:
            '레시피를 불러오는 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
        });
        throw error;
      }
    },
    queryKey: ['recipe-detail', recipeId],
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });

  const [activeTab, setActiveTab] = useState<TabId>('ingredients');
  const bottomPadding = useViewportBasedPadding({
    minPadding: 400,
    ratio: 0.8,
  });
  const router = useRouter();
  const { mutate: postRecentRecipe } = usePostRecentRecipe();
  const { isVisible, message, showToast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isKakaoInApp = useIsKakaoInApp();

  // 레시피 데이터 로드 성공 시 최근 본 레시피 등록
  useEffect(() => {
    if (recipeData) {
      postRecentRecipe(Number(recipeId));
    }
  }, [recipeData, recipeId, postRecentRecipe]);

  // 메타데이터 동적 업데이트
  useEffect(() => {
    if (!recipeData) return;

    const title = `${recipeData.title}`;
    const description =
      recipeData.description ?? `${recipeData.title} 레시피입니다.`;
    const imageUrl =
      recipeData.images && recipeData.images.length > 0
        ? recipeData.images[0].imageUrl
        : undefined;

    document.title = title;

    updateMetaTag(
      'meta[name="description"]',
      'name',
      'description',
      description
    );

    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:type', 'website');
    if (imageUrl) {
      updateOGTag('og:image', imageUrl);
      updateOGTag('og:image:width', '1200');
      updateOGTag('og:image:height', '630');
      updateOGTag('og:image:alt', recipeData.title);
    }
  }, [recipeData]);

  // tools가 없을 때 cookware 탭을 ingredients로 자동 조정
  useEffect(() => {
    if (
      recipeData &&
      (!recipeData.tools || recipeData.tools.length === 0) &&
      activeTab === 'cookware'
    ) {
      setActiveTab('ingredients');
    }
  }, [recipeData, activeTab]);

  // scrollSpy 초기화
  useEffect(() => {
    if (typeof window === 'undefined' || !recipeData) return;

    const timer = setTimeout(() => {
      scrollSpy.update();
    }, 300);

    return () => clearTimeout(timer);
  }, [recipeData]);

  const contentStyle = useMemo(
    () => ({ paddingBottom: `${bottomPadding}px` }),
    [bottomPadding]
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-gray-600">레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !recipeData) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            레시피를 불러오는 중 오류가 발생했습니다.
          </p>
          <Button
            variant="default"
            onClick={() => window.location.reload()}
            className="bg-primary px-6 py-2 text-white"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const handleCookingOrder = () => {
    // 로그인하지 않은 경우에만 모달 표시
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    router.push(`/recipe/${recipeId}/cooking-order`);
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full bg-gray-100">
      <RecipeDetailHeader recipe={recipeData} showToast={showToast} />

      <RecipeHero recipe={recipeData} />
      <TabNavigation
        activeTab={activeTab}
        offset={SCROLL_OFFSET}
        onTabChange={handleTabChange}
        hasTools={!!(recipeData?.tools && recipeData.tools.length > 0)}
      />
      <div className="space-y-3 px-4 pt-3" style={contentStyle}>
        <div className="bg-secondary-light-green border-secondary-soft-green rounded-2xl border-[1px] px-5 py-4">
          <p className="text-15sb text-primary-pressed">
            {recipeData?.healthPoint?.content}
          </p>
        </div>

        <Element name="ingredients" id="ingredients" className="scroll-element">
          <IngredientsSection
            ingredients={recipeData.ingredients}
            seasonings={recipeData?.seasonings}
          />
        </Element>

        {recipeData?.tools && recipeData.tools.length > 0 && (
          <Element name="cookware" id="cookware" className="scroll-element">
            <CookwareSection cookware={recipeData.tools} />
          </Element>
        )}

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
            <p className="text-17sb text-white">단계별로 요리 시작하기</p>
          </Button>
        </div>
      </div>
      <Toast message={message} isVisible={isVisible} position="card-bottom" />
      <Modal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="로그인이 필요합니다."
        description={
          isKakaoInApp
            ? '로그인하면 더 많은 기능을 사용할 수 있어요.'
            : '로그인하면 요리 시작하기 기능을 사용할 수 있어요.'
        }
      >
        <Button
          variant="default"
          onClick={() => router.push('/signin')}
          size="full"
        >
          로그인
        </Button>
      </Modal>
    </div>
  );
}

export default RecipeDetail;

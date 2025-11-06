'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Element, scrollSpy } from 'react-scroll';
import { recipe } from '@recipot/api';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Toast } from '@/components/common/Toast';
import { CookIcon } from '@/components/Icons';
import { useToast, useViewportBasedPadding } from '@/hooks';
import { useIsKakaoInApp } from '@/hooks/useIsKakaoInApp';
import { usePostRecentRecipe } from '@/hooks/usePostRecentRecipe';
import { isProduction } from '@/lib/env';
import { useApiErrorModalStore } from '@/stores';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import { RecipeDetailHeader } from './RecipeDetailHeader';
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
  const { mutate: postRecentRecipe } = usePostRecentRecipe();
  const { isVisible, message, showToast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isKakaoInApp = useIsKakaoInApp();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipe.getRecipeDetail(recipeId);
        setRecipeData(data);
        postRecentRecipe(Number(recipeId));
      } catch {
        useApiErrorModalStore.getState().showError({
          isFatal: false,
          message:
            '레시피를 불러오는 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
        });
      }
    };
    fetchRecipe();
  }, [recipeId, postRecentRecipe]);

  useEffect(() => {
    if (!recipeData) return;

    // DOM 렌더링 완료 후 scrollSpy 초기화
    const timer = setTimeout(() => {
      scrollSpy.update();
    }, 300);

    // tools가 없고 activeTab이 cookware인 경우 ingredients로 변경
    if (
      (!recipeData.tools || recipeData.tools.length === 0) &&
      activeTab === 'cookware'
    ) {
      setActiveTab('ingredients');
    }

    return () => clearTimeout(timer);
  }, [recipeData, activeTab]);

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
    // 카카오톡 인앱 브라우저에서 접속한 경우 로그인 모달 표시
    if (isKakaoInApp) {
      setShowLoginModal(true);
      return;
    }

    if (!useCookieAuth && !token) {
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
        <Button variant="default" onClick={() => router.push('/signin')}>
          로그인
        </Button>
      </Modal>
    </div>
  );
}

export default RecipeDetail;

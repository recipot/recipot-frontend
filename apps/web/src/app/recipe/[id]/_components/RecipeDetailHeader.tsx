'use client';

import React, { useMemo, useState } from 'react';
import { storedAPI } from '@recipot/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Modal } from '@/components/common/Modal/Modal';
import { HeartIcon, ShareIcon } from '@/components/Icons';
import WebShareButton from '@/components/Share/WebShareButton';
import { useIsKakaoInApp } from '@/hooks/useIsKakaoInApp';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { getAbsoluteUrl, getRecipeShareUrl } from '@/lib/url';
import { useApiErrorModalStore } from '@/stores';
import type { KakaoShareData, ShareData } from '@/types/share.types';

import type { Recipe } from '../types/recipe.types';

export interface RecipeHeaderProps {
  recipe: Recipe;
  showToast: (message: string, duration?: number) => void;
}

export function RecipeDetailHeader({ recipe, showToast }: RecipeHeaderProps) {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  const [isLiked, setIsLiked] = useState(recipe.isBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isKakaoInApp = useIsKakaoInApp();

  // Web Share API용 공유 데이터 (시스템 공유 모달에서 사용)
  const webShareData = useMemo<ShareData>(() => {
    return {
      text: recipe.description,
      title: recipe.title,
      url: getRecipeShareUrl(recipe.id),
    };
  }, [recipe.id, recipe.title, recipe.description]);

  // 카카오톡 공유용 데이터
  const kakaoShareData = useMemo<KakaoShareData>(() => {
    const recipeImageUrl = recipe.images?.[0]?.imageUrl;
    const imageUrl = getAbsoluteUrl(recipeImageUrl);

    return {
      description: recipe.description,
      imageUrl,
      title: recipe.title,
      url: getRecipeShareUrl(recipe.id),
    };
  }, [recipe.id, recipe.title, recipe.description, recipe.images]);

  const handleToggleBookmark = async (recipeId: number) => {
    // 로그인하지 않은 경우에만 모달 표시
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const isCurrentlyLiked = isLiked;
    try {
      if (isCurrentlyLiked) {
        await storedAPI.deleteStoredRecipe(recipeId);
        setIsLiked(prev => !prev);
      } else {
        await storedAPI.postStoredRecipe(recipeId);
        setIsLiked(prev => !prev);
        showToast('레시피가 저장되었어요!');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
        return;
      }
      useApiErrorModalStore.getState().showError({
        message:
          '북마크 처리 중 오류가 발생했어요.\n잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/recipeRecommend');
  };

  return (
    <>
      {/* Login Modal */}
      <Modal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="로그인이 필요합니다."
        description={
          isKakaoInApp
            ? '로그인하면 더 많은 기능을 사용할 수 있어요.'
            : '로그인하면 북마크 기능을 사용할 수 있어요.'
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

      {/* Header */}
      <Header className="px-4 py-3">
        <Header.Back onClick={handleBack} />
        <div className="flex items-center space-x-2">
          <WebShareButton
            webShareData={webShareData}
            kakaoShareData={kakaoShareData}
            enableKakao
            className="p-2"
            onKakaoInAppClick={
              isKakaoInApp ? () => setShowLoginModal(true) : undefined
            }
            onShareSuccess={showToast}
          >
            <ShareIcon className="h-6 w-6" color="#212529" />
          </WebShareButton>
          <button
            type="button"
            onClick={() => handleToggleBookmark(recipe.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 ${
              isLoading
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={isLiked ? '북마크 취소' : '북마크 추가'}
            disabled={isLoading}
          >
            <HeartIcon
              className={`h-6 w-6 stroke-2 transition-colors duration-200 ${
                isLiked ? 'fill-black text-gray-900' : 'text-gray-600'
              }`}
              color="#212529"
            />
          </button>
        </div>
      </Header>
      <Header.Spacer />
    </>
  );
}

export default RecipeDetailHeader;

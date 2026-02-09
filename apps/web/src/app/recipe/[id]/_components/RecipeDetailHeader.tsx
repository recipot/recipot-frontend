'use client';

import React, { useState } from 'react';
import { storedAPI } from '@recipot/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header';
import { HeartIcon, ShareIcon } from '@/components/Icons';
import WebShareButton from '@/components/Share/WebShareButton';
import { useIsKakaoInApp } from '@/hooks/useIsKakaoInApp';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { useApiErrorModalStore } from '@/stores';
import { useLoginModalStore } from '@/stores/useLoginModalStore';
import { createKakaoShareData, createWebShareData } from '@/utils/shareData';

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

  const openLoginModal = useLoginModalStore(state => state.openModal);
  const isKakaoInApp = useIsKakaoInApp();

  // Web Share API용 공유 데이터 (시스템 공유 모달에서 사용)
  const webShareData = createWebShareData(recipe);

  // 카카오톡 스크랩 메시지용 공유 데이터
  // 포함 정보: 레시피 이미지, 레시피 제목, 레시피 설명, 레시피 링크
  const kakaoShareData = createKakaoShareData(recipe);

  const handleToggleBookmark = async (recipeId: number) => {
    // 로그인하지 않은 경우에만 모달 표시
    if (!isLoggedIn) {
      openLoginModal();
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
        openLoginModal();
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
    router.back();
  };

  return (
    <>
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
              isKakaoInApp ? () => openLoginModal() : undefined
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

'use client';

import React, { useMemo, useState } from 'react';
import { storedAPI } from '@recipot/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Modal } from '@/components/common/Modal/Modal';
import { HeartIcon, ShareIcon } from '@/components/Icons';
import WebShareButton from '@/components/Share/WebShareButton';
import { useIsKakaoInApp } from '@/hooks/useIsKakaoInApp';
import { isProduction } from '@/lib/env';
import { useApiErrorModalStore } from '@/stores';

import type { Recipe } from '../types/recipe.types';

export interface RecipeHeaderProps {
  recipe: Recipe;
  showToast: (message: string, duration?: number) => void;
}

export function RecipeDetailHeader({ recipe, showToast }: RecipeHeaderProps) {
  const router = useRouter();
  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  const [isLiked, setIsLiked] = useState(recipe.isBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isKakaoInApp = useIsKakaoInApp();

  // Web Share API용 공유 데이터
  // 시스템 공유 모달에서 사용되며, 메타태그와 일치하도록 기본값 통일
  // 레시피 상세 API에서 받아온 데이터를 우선 사용
  const shareData = useMemo(() => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : isProduction
          ? 'https://hankkibuteo.com'
          : 'https://dev.hankkibuteo.com';

    // 레시피 제목이 있으면 사용, 없으면 기본값 (공백 제거)
    const shareTitle = (recipe.title?.trim() || '맛있는 레시피').trim();

    // 레시피 설명이 있으면 사용, 없으면 기본값 (공백 제거)
    const shareText = (
      recipe.description?.trim() ||
      '냉장고 속 재료로 만드는 유연채식 집밥 레시피'
    ).trim();

    // 시스템 공유 모달에 항상 올바른 데이터 전달 보장
    return {
      text: shareText ?? '냉장고 속 재료로 만드는 유연채식 집밥 레시피',
      title: shareTitle ?? '맛있는 레시피',
      url: `${baseUrl}/recipe/${recipe.id}`,
    };
  }, [recipe]);

  const handleToggleBookmark = async (recipeId: number) => {
    // 카카오톡 인앱 브라우저에서 접속한 경우 로그인 모달 표시
    if (isKakaoInApp) {
      setShowLoginModal(true);
      return;
    }

    if (!useCookieAuth && token === null) {
      setShowLoginModal(true);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    const isCurrentlyLiked = isLiked;
    try {
      if (isCurrentlyLiked) {
        await storedAPI.deleteStoredRecipe(recipeId);
        setIsLiked(false);
      } else {
        await storedAPI.postStoredRecipe(recipeId);
        setIsLiked(true);
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
        <Button variant="default" onClick={() => router.push('/signin')}>
          로그인
        </Button>
      </Modal>

      {/* Header */}
      <Header className="px-4 py-3">
        <Header.Back onClick={handleBack} />
        <div className="flex items-center space-x-2">
          <WebShareButton shareData={shareData} className="p-2">
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

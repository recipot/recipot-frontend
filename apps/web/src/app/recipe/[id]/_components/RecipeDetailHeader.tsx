'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { storedAPI } from '@recipot/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Modal } from '@/components/common/Modal/Modal';
import { HeartIcon, ShareIcon } from '@/components/Icons';
import WebShareButton from '@/components/Share/WebShareButton';
import { isProduction } from '@/lib/env';
import { isKakaoTalkInAppBrowser } from '@/lib/kakao';
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
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);

  // 카카오톡 인앱 브라우저 감지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsKakaoInApp(isKakaoTalkInAppBrowser());
    }
  }, []);

  const shareData = useMemo(() => {
    const baseUrl = isProduction
      ? 'https://hankkibuteo.com'
      : 'https://dev.hankkibuteo.com';
    return {
      text: recipe.description,
      title: recipe.title,
      url: `${baseUrl}/recipe/${recipe.id}`,
    };
  }, [recipe]);

  const kakaoShareData = useMemo(() => {
    const recipeImageUrl = recipe.images?.[0]?.imageUrl;

    const getImageUrl = (url: string | undefined) => {
      const baseUrl = isProduction
        ? 'https://hankkibuteo.com'
        : 'https://dev.hankkibuteo.com';

      if (!url) return `${baseUrl}/recipeImage.png`;

      // 이미 절대 URL인 경우 그대로 사용
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }

      // 상대 경로인 경우 절대 URL로 변환
      return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    };

    const imageUrl = getImageUrl(recipeImageUrl);

    return {
      description: recipe.description,
      imageUrl,
      title: recipe.title,
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
          <WebShareButton
            shareData={shareData}
            kakaoShareData={kakaoShareData}
            enableKakao
            className="p-2"
            onKakaoInAppClick={
              isKakaoInApp ? () => setShowLoginModal(true) : undefined
            }
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

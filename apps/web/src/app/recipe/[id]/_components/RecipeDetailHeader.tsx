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

  // 이미지 URL을 절대 경로로 변환하는 헬퍼 함수
  // 메타태그와 동일한 로직을 사용하여 일관성 유지
  const getAbsoluteImageUrl = (url: string | undefined): string => {
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

  // Web Share API용 공유 데이터
  // 메타태그와 일치하도록 기본값 통일
  const shareData = useMemo(() => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : isProduction
          ? 'https://hankkibuteo.com'
          : 'https://dev.hankkibuteo.com';

    // 메타태그와 동일한 기본값 사용
    const shareTitle = recipe.title ?? '맛있는 레시피';
    const shareText =
      recipe.description ?? '냉장고 속 재료로 만드는 유연채식 집밥 레시피';

    return {
      text: shareText,
      title: shareTitle,
      url: `${baseUrl}/recipe/${recipe.id}`,
    };
  }, [recipe]);

  // 카카오톡 공유용 데이터
  // 메타태그(og:title, og:description, og:image)와 일치하도록 설정
  // 레시피 상세 API에서 받아온 이미지, 제목, 설명을 사용
  const kakaoShareData = useMemo(() => {
    const recipeImageUrl = recipe.images?.[0]?.imageUrl;
    const imageUrl = getAbsoluteImageUrl(recipeImageUrl);

    // 메타태그와 동일한 데이터 사용
    return {
      description:
        recipe.description ?? '냉장고 속 재료로 만드는 유연채식 집밥 레시피',
      imageUrl, // 절대 URL로 변환된 이미지 (메타태그 og:image와 일치)
      title: recipe.title ?? '맛있는 레시피', // 메타태그 og:title과 일치
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

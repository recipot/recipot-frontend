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
import { isProduction } from '@/lib/env';

import type { Recipe } from '../types/recipe.types';

interface RecipeHeaderProps {
  recipe: Recipe;
}

export function RecipeDetailHeader({ recipe }: RecipeHeaderProps) {
  const router = useRouter();
  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  const [isLiked, setIsLiked] = useState(recipe.isBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const shareData = useMemo(() => {
    return {
      text: recipe.description,
      title: recipe.title,
      url: `https://dev.hankkibuteo.com/recipe/${recipe.id}`,
    };
  }, [recipe]);

  const kakaoShareData = useMemo(() => {
    const recipeImageUrl = recipe.images?.[0]?.imageUrl;

    const getImageUrl = (url: string | undefined) => {
      const baseUrl = 'https://dev.hankkibuteo.com';

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
    if (!useCookieAuth && token === null) {
      setShowLoginModal(true);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await storedAPI.deleteStoredRecipe(recipeId);
        setIsLiked(false);
      } else {
        await storedAPI.postStoredRecipe(recipeId);
        setIsLiked(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
        return;
      }
      console.error('북마크 처리 중 오류가 발생했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {/* Login Modal */}
      <Modal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="로그인이 필요합니다."
        description="로그인하면 북마크 기능을 사용할 수 있어요."
      >
        <Button variant="default" onClick={() => router.push('/signin')}>
          로그인
        </Button>
      </Modal>

      {/* Header */}
      <Header className="static px-4 py-3">
        <Header.Back onClick={handleBack} />
        <div className="flex items-center space-x-2">
          <WebShareButton
            shareData={shareData}
            kakaoShareData={kakaoShareData}
            enableKakao
            className="p-2"
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

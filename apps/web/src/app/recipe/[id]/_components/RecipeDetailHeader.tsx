'use client';

import React, { useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import {
  BackIcon,
  CardTimeIcon,
  CookOrderIcon,
  HeartIcon,
  ShareIcon,
} from '@/components/Icons';
import WebShareButton from '@/components/Share/WebShareButton';

import type { Recipe } from '../types/recipe.types';

interface RecipeHeaderProps {
  recipe: Recipe;
}

export function RecipeDetailHeader({ recipe }: RecipeHeaderProps) {
  const router = useRouter();
  const token = tokenUtils.getToken();

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
    if (token === null) {
      setShowLoginModal(true);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    const bookmarkURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/bookmarks`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (isLiked) {
        // DELETE 요청
        await axios.delete(`${bookmarkURL}/${recipeId}`, config);
        setIsLiked(false);
      } else {
        // POST 요청
        await axios.post(bookmarkURL, { recipeId }, config);
        setIsLiked(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message ?? '북마크 처리 중 오류가 발생했습니다.');
      }
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
      <div className="bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="flex items-center" onClick={handleBack}>
            <BackIcon size={24} color="#212529" className="cursor-pointer" />
          </button>
          <div className="flex items-center space-x-2">
            <WebShareButton
              shareData={shareData}
              kakaoShareData={kakaoShareData}
              enableKakao
              className="p-2"
            >
              <ShareIcon className="h-6 w-6" color="#212529" />
            </WebShareButton>
            <HeartIcon
              onClick={() => handleToggleBookmark(recipe.id)}
              className={`h-6 w-6 stroke-2 transition-colors duration-200 ${
                isLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:scale-110'
              } ${isLiked ? 'fill-black' : 'text-gray-600'}`}
              color={isLiked ? '#fffff' : '#212529'}
            />
          </div>
        </div>
      </div>

      {/* Recipe Image and Info */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center">
          {recipe.images &&
          recipe.images.length > 0 &&
          recipe.images[0]?.imageUrl ? (
            <Image
              key={recipe.id}
              src={recipe.images[0].imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <span className="text-gray-500">이미지 없음</span>
            </div>
          )}

          <div className="absolute top-4 right-4 left-4 flex space-x-2">
            <div className="flex items-center space-x-1 rounded-full px-3 py-1.5">
              <CardTimeIcon size={24} color="#ffffff" />
              <span className="text-sm font-medium text-white">
                {recipe.duration}분
              </span>
            </div>
            <div className="flex items-center space-x-1 rounded-full px-3 py-1.5">
              <CookOrderIcon size={24} color="#ffffff" />
              <span className="text-sm font-medium text-white">
                {recipe.condition?.name}
              </span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 left-4">
            <h2 className="text-17 mb-3 text-white">{recipe.title}</h2>
            <p className="text-24 text-white">{recipe.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeDetailHeader;

import React, { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

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

  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLikedRef = useRef(false);

  const handleShareSuccess = () => {
    // console.log('공유가 완료되었습니다.');
  };

  const handleShareError = (error: Error) => {
    console.error('공유 중 오류가 발생했습니다:', error);
  };

  const shareData = useMemo(() => {
    return {
      text: recipe.description,
      title: recipe.title,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
  }, [recipe]);

  const handleToggleLike = async (recipeId: number) => {
    if (!token) {
      console.warn('❌ 로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);

    // useRef를 사용하여 현재 상태를 정확히 추적
    const previousIsLiked = isLikedRef.current;
    const newIsLiked = !previousIsLiked;

    // ref와 state 모두 업데이트
    isLikedRef.current = newIsLiked;
    setIsLiked(newIsLiked);

    try {
      if (previousIsLiked) {
        // 북마크 해제
        const deleteUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/bookmarks/${recipeId}`;

        await axios.delete(deleteUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // 북마크 추가
        const postUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/bookmarks`;

        await axios.post(
          postUrl,
          {
            recipeId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error: unknown) {
      console.error('❌ 북마크 처리 중 오류:', error);

      // 에러 발생 시 이전 상태로 롤백
      isLikedRef.current = previousIsLiked;
      setIsLiked(previousIsLiked);
      // 사용자에게 알림 (선택사항)
      alert('북마크 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <BackIcon
              size={24}
              color="#212529"
              onClick={() => router.back()}
              className="cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-2">
            <WebShareButton
              shareData={shareData}
              onShareSuccess={handleShareSuccess}
              onShareError={handleShareError}
              className="p-2"
            >
              <ShareIcon className="h-6 w-6" color="#212529" />
            </WebShareButton>
            <HeartIcon
              onClick={() => handleToggleLike(recipe.id)}
              className={`h-6 w-6 stroke-2 transition-colors duration-200 ${
                isLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:scale-110'
              } ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              color={isLiked ? '#ef4444' : '#212529'}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4 left-4 flex space-x-2">
            <div className="flex items-center space-x-1 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <CardTimeIcon size={24} color="#ffffff" />
              <span className="text-sm font-medium text-white">
                {recipe.duration}분
              </span>
            </div>
            <div className="flex items-center space-x-1 rounded-full px-3 py-1.5 backdrop-blur-sm">
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

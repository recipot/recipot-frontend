import { use } from 'react';
import axios from 'axios';

import { isProduction } from '@/lib/env';

import RecipeDetail from './_components/RecipeDetail';

import type { Recipe } from './types/recipe.types';
import type { Metadata } from 'next';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

// 서버 사이드에서 레시피 데이터 가져오기
async function getRecipeData(recipeId: string): Promise<Recipe | null> {
  try {
    const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
    const shouldUseMock = APP_ENV === 'local';
    const baseURL = shouldUseMock
      ? '' // MSW가 현재 도메인에서 요청을 가로챔
      : (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://api.hankkibuteo.com');

    const url = `${baseURL}/v1/recipes/${recipeId}`;
    console.info('[RecipePage] 레시피 데이터 가져오기 시도:', {
      baseURL,
      recipeId,
      url,
    });

    const response = await axios.get(url, {
      timeout: 10000, // 타임아웃 증가
    });

    const recipeData = response.data?.data;

    if (!recipeData) {
      console.warn('[RecipePage] 레시피 데이터가 비어있음:', {
        recipeId,
        responseData: response.data,
      });
      return null;
    }

    console.info('[RecipePage] 레시피 데이터 가져오기 성공:', {
      hasDescription: !!recipeData.description,
      hasImages: !!(recipeData.images && recipeData.images.length > 0),
      hasTitle: !!recipeData.title,
      recipeId,
    });

    return recipeData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[RecipePage] 레시피 데이터 가져오기 실패:', {
        message: error.message,
        recipeId,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
    } else {
      console.error('[RecipePage] 레시피 데이터 가져오기 실패:', error);
    }
    return null;
  }
}

// 메타 태그 생성
export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeData(id);

  // 현재 환경에 맞는 base URL (서버 사이드)
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (isProduction ? 'https://hankkibuteo.com' : 'https://dev.hankkibuteo.com');

  const recipeUrl = `${baseUrl}/recipe/${id}`;

  // 레시피 데이터가 없으면 경고 로그
  if (!recipe) {
    console.warn(
      '[RecipePage] generateMetadata: 레시피 데이터가 없어 기본값 사용',
      {
        recipeId: id,
      }
    );
  }

  // 레시피 데이터가 있으면 사용, 없으면 기본값 사용
  // 제목은 레시피 제목만 사용 (접두사 없이)
  const title = recipe?.title ?? '맛있는 레시피';
  // 설명은 레시피 설명 사용
  const description =
    recipe?.description ?? '냉장고 속 재료로 만드는 유연채식 집밥 레시피';

  // 레시피 이미지 URL 생성
  let imageUrl = `${baseUrl}/recipeImage.png`; // 기본 이미지 (절대 URL)
  if (recipe?.images && recipe.images.length > 0) {
    const recipeImage = recipe.images[0]?.imageUrl;
    if (recipeImage) {
      // 절대 URL인 경우 그대로 사용, 상대 경로인 경우 base URL 추가
      if (
        recipeImage.startsWith('http://') ||
        recipeImage.startsWith('https://')
      ) {
        imageUrl = recipeImage;
      } else {
        imageUrl = `${baseUrl}${recipeImage.startsWith('/') ? recipeImage : `/${recipeImage}`}`;
      }
    }
  }

  console.info('[RecipePage] generateMetadata 완료:', {
    description,
    hasRecipe: !!recipe,
    imageUrl,
    recipeId: id,
    title,
  });

  return {
    description,
    openGraph: {
      description,
      images: [
        {
          alt: title,
          height: 630,
          url: imageUrl,
          width: 1200,
        },
      ],
      siteName: '한끼부터',
      title,
      type: 'website',
      url: recipeUrl,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [imageUrl],
      title,
    },
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  return <RecipeDetail recipeId={id} />;
}

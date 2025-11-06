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
// 메타태그 생성을 위해 재시도 로직 포함
async function getRecipeData(
  recipeId: string,
  retryCount = 0
): Promise<Recipe | null> {
  const maxRetries = 2;
  const timeout = 15000; // 타임아웃 증가 (15초)

  try {
    const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
    const shouldUseMock = APP_ENV === 'local';
    const baseURL = shouldUseMock
      ? '' // MSW가 현재 도메인에서 요청을 가로챔
      : (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://api.hankkibuteo.com');

    const url = `${baseURL}/v1/recipes/${recipeId}`;

    const response = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
      timeout,
    });

    const recipeData = response.data?.data;

    if (!recipeData) {
      console.warn('[RecipePage] 레시피 데이터가 비어있음:', {
        recipeId,
        responseData: response.data,
        retryCount,
      });
      // 재시도
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getRecipeData(recipeId, retryCount + 1);
      }
      return null;
    }

    // 필수 필드 검증
    if (!recipeData.title || !recipeData.description) {
      console.warn('[RecipePage] 레시피 데이터에 필수 필드가 없음:', {
        hasDescription: !!recipeData.description,
        hasTitle: !!recipeData.title,
        recipeId,
      });
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getRecipeData(recipeId, retryCount + 1);
      }
    }

    return recipeData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const isTimeout =
        error.code === 'ECONNABORTED' || error.message.includes('timeout');
      const isRetryable =
        isTimeout || (error.response?.status && error.response.status >= 500);

      if (isRetryable && retryCount < maxRetries) {
        console.warn('[RecipePage] 레시피 데이터 가져오기 실패, 재시도:', {
          error: error.message,
          maxRetries,
          recipeId,
          retryCount: retryCount + 1,
        });
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return getRecipeData(recipeId, retryCount + 1);
      }

      console.error('[RecipePage] 레시피 데이터 가져오기 최종 실패:', {
        message: error.message,
        recipeId,
        response: error.response?.data,
        retryCount,
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
// 카카오톡 링크 미리보기와 시스템 공유 모달에서 사용
export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { id } = await params;

  // 레시피 데이터 가져오기 (재시도 포함)
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
  // 제목: 레시피 제목 (없으면 기본값)
  const title = recipe?.title?.trim() ?? '맛있는 레시피';

  // 설명: 레시피 설명 (없으면 기본값)
  const description =
    recipe?.description?.trim() ??
    '냉장고 속 재료로 만드는 유연채식 집밥 레시피';

  // 레시피 이미지 URL 생성 (절대 URL로 변환)
  // 카카오톡 링크 미리보기와 카카오 공유 시에도 동일한 이미지 URL이 사용되도록 일관성 유지
  let imageUrl = `${baseUrl}/recipeImage.png`; // 기본 이미지 (절대 URL)

  if (recipe?.images?.length) {
    const recipeImage = recipe.images[0]?.imageUrl;
    if (recipeImage?.trim()) {
      // 절대 URL인 경우 그대로 사용, 상대 경로인 경우 base URL 추가
      if (
        recipeImage.startsWith('http://') ||
        recipeImage.startsWith('https://')
      ) {
        imageUrl = recipeImage.trim();
      } else {
        const normalizedPath = recipeImage.startsWith('/')
          ? recipeImage.trim()
          : `/${recipeImage.trim()}`;
        imageUrl = `${baseUrl}${normalizedPath}`;
      }
    }
  }

  // 메타태그가 항상 올바른 절대 URL을 가지도록 보장
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  }

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
      locale: 'ko_KR',
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
    // 카카오톡이 메타 태그를 올바르게 읽을 수 있도록 추가 메타데이터
    other: {
      'og:image:height': '630',
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:url': recipeUrl,
    },
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  return <RecipeDetail recipeId={id} />;
}

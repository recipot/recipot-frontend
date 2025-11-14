import { use } from 'react';
import { recipe } from '@recipot/api';

import { getAbsoluteUrl, getRecipeShareUrl } from '@/lib/url';

import RecipeDetail from './_components/RecipeDetail';

interface RecipePageProps {
  params: Promise<{ id: number }>;
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { id } = await params;
  const recipeData = await recipe.getPublicRecipeDetail(id);

  if (!recipeData) {
    return {
      description: '레시피 상세 정보를 확인하세요.',
      openGraph: {
        description: '레시피 상세 정보를 확인하세요.',
        title: '레시피 상세',
        type: 'website',
      },
      title: '레시피 상세',
    };
  }

  // 레시피 정보
  const recipeTitle = recipeData.title;
  const recipeDescription = recipeData.description ?? recipeData.title;

  // 이미지 URL을 절대 URL로 변환
  const originalImageUrl = recipeData.images?.[0]?.imageUrl;

  const imageUrl = originalImageUrl
    ? originalImageUrl.startsWith('https://')
      ? originalImageUrl
      : getAbsoluteUrl(originalImageUrl)
    : getAbsoluteUrl('/recipeImage.png');

  const shareUrl = getRecipeShareUrl(recipeData.id);

  return {
    description: recipeDescription,
    openGraph: {
      description: recipeDescription,
      images: [
        {
          alt: recipeTitle,
          url: imageUrl,
        },
      ],
      title: recipeTitle,
      type: 'website',
      url: shareUrl,
    },
    title: recipeTitle,
    twitter: {
      card: 'summary_large_image',
      description: recipeDescription,
      images: [imageUrl],
      title: recipeTitle,
    },
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  return <RecipeDetail recipeId={id} />;
}

import { getAbsoluteUrl, getRecipeShareUrl } from '@/lib/url';
import type { KakaoShareData, ShareData } from '@/types/share.types';

/**
 * Web Share API용 공유 데이터 생성
 * @param recipe - 레시피 정보 (id, title, description)
 * @returns Web Share API용 공유 데이터
 */
export function createWebShareData(recipe: {
  id: number;
  title: string;
  description?: string;
}): ShareData {
  return {
    text: recipe.description,
    title: recipe.title,
    url: getRecipeShareUrl(recipe.id),
  };
}

/**
 * 카카오톡 스크랩 메시지용 공유 데이터 생성
 * 포함 정보: 레시피 이미지, 레시피 제목, 레시피 설명, 레시피 링크
 * @param recipe - 레시피 정보 (id, title, description, images)
 * @returns 카카오톡 스크랩 메시지용 공유 데이터
 */
export function createKakaoShareData(recipe: {
  id: number;
  title: string;
  description?: string;
  images?: Array<{ imageUrl?: string }>;
}): KakaoShareData {
  const recipeDescription = recipe.description ?? recipe.title;
  const recipeImageUrl = recipe.images?.[0]?.imageUrl;

  return {
    description: recipeDescription,
    imageUrl: recipeImageUrl
      ? getAbsoluteUrl(recipeImageUrl)
      : getAbsoluteUrl('/recipeImage.png'),
    title: recipe.title,
    url: getRecipeShareUrl(recipe.id),
  };
}

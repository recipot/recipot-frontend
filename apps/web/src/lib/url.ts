import { getBaseUrl } from './env';

/**
 * 상대 경로를 절대 URL로 변환
 * @param url - 변환할 URL (상대 경로 또는 절대 URL)
 * @returns 절대 URL
 */
export const getAbsoluteUrl = (url: string | undefined): string => {
  if (!url) {
    return `${getBaseUrl()}/recipeImage.png`;
  }

  // 이미 절대 URL인 경우 그대로 사용
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 상대 경로인 경우 절대 URL로 변환
  const baseUrl = getBaseUrl();
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * 레시피 공유 URL 생성
 * @param recipeId - 레시피 ID
 * @returns 레시피 공유 URL
 */
export const getRecipeShareUrl = (recipeId: string | number): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/recipe/${recipeId}`;
};

/**
 * 이미지 URL 정규화 (상대 경로를 절대 URL로 변환)
 * @param url - 변환할 이미지 URL
 * @returns 정규화된 이미지 URL
 */
export const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) {
    return getAbsoluteUrl(url);
  }

  // blob URL은 그대로 반환
  if (url.startsWith('blob:')) {
    return url;
  }

  return getAbsoluteUrl(url);
};

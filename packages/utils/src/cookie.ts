/**
 * 브라우저 쿠키에서 특정 이름의 값을 가져오는 유틸리티 함수
 *
 * @param name - 가져올 쿠키의 이름
 * @returns 쿠키 값 또는 null (쿠키가 없거나 서버 사이드인 경우)
 *
 * @example
 * ```ts
 * const accessToken = getCookie('accessToken');
 * if (accessToken) {
 *   // 토큰 사용
 * }
 * ```
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? (parts.pop()?.split(';').shift() ?? null) : null;
};

/**
 * 브라우저 쿠키에 값을 설정하는 유틸리티 함수
 *
 * @param name - 쿠키 이름
 * @param value - 쿠키 값
 * @param days - 만료 기간 (일 단위, 선택사항)
 *
 * @example
 * ```ts
 * setCookie('accessToken', 'token123', 7); // 7일 동안 유효
 * ```
 */
export const setCookie = (name: string, value: string, days?: number): void => {
  if (typeof document === 'undefined') return;

  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
};

/**
 * 브라우저 쿠키를 삭제하는 유틸리티 함수
 *
 * @param name - 삭제할 쿠키 이름
 *
 * @example
 * ```ts
 * deleteCookie('accessToken');
 * ```
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

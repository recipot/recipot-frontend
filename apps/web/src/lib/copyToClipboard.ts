/**
 * 클립보드에 텍스트를 복사하는 유틸리티 함수
 */

/**
 * 클립보드에 텍스트를 복사합니다.
 * @param text 복사할 텍스트
 * @returns 복사 성공 여부를 나타내는 Promise<boolean>
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  // navigator.clipboard API 사용 (최신 브라우저)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('클립보드 복사 실패 (clipboard API):', error);
      // clipboard API 실패 시 textarea 방식으로 폴백
    }
  }

  // textarea를 사용한 폴백 방식
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    return false;
  }
};

export default copyToClipboard;

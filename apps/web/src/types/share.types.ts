/**
 * Web Share API용 공유 데이터
 */
export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

/**
 * 카카오톡 공유용 데이터
 */
export interface KakaoShareData {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

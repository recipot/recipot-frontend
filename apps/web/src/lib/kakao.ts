/**
 * 카카오 SDK 관련 유틸리티 함수들
 */

// 카카오 SDK 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => Promise<void>;
      };
    };
  }
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

interface KakaoShareData {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

/**
 * 카카오 SDK 초기화
 */
export const initKakao = (): boolean => {
  if (typeof window === 'undefined') {
    console.warn('[Kakao Init] 서버 사이드 환경입니다.');
    return false;
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

  if (!appKey) {
    console.error(
      '[Kakao Init] 환경 변수 NEXT_PUBLIC_KAKAO_APP_KEY가 설정되지 않았습니다.'
    );
    return false;
  }

  if (!window.Kakao) {
    console.warn('[Kakao Init] 카카오 SDK가 아직 로드되지 않았습니다.');
    return false;
  }

  if (!window.Kakao.isInitialized()) {
    try {
      window.Kakao.init(appKey);
      console.info('[Kakao Init] 카카오 SDK 초기화 완료');
    } catch (error) {
      console.error('[Kakao Init] 초기화 중 오류:', error);
      return false;
    }
  }

  return true;
};

/**
 * 카카오톡 공유 실행
 */
export const shareKakao = async (shareData: KakaoShareData): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new Error('브라우저 환경에서만 사용할 수 있습니다.');
  }

  if (!window.Kakao) {
    throw new Error('카카오 SDK가 로드되지 않았습니다.');
  }

  if (!window.Kakao.isInitialized()) {
    const initialized = initKakao();
    if (!initialized) {
      throw new Error('카카오 SDK 초기화에 실패했습니다.');
    }
  }

  // 이미지 URL을 절대 경로로 변환
  const getAbsoluteUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // 상대 경로인 경우 도메인 추가
    return `https://dev.hankkibuteo.com${url.startsWith('/') ? url : `/${url}`}`;
  };

  const shareOptions: KakaoShareOptions = {
    content: {
      description: shareData.description,
      imageUrl: getAbsoluteUrl(shareData.imageUrl),
      link: {
        mobileWebUrl: shareData.url,
        webUrl: shareData.url,
      },
      title: shareData.title,
    },
    objectType: 'feed',
    // buttons 배열 제거
  };

  try {
    await window.Kakao.Share.sendDefault(shareOptions);
  } catch (error) {
    console.error('카카오 공유 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 카카오톡 앱 설치 여부 확인 (모바일에서만)
 */
export const isKakaoTalkInstalled = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  if (!isMobile) {
    return false;
  }

  return (
    /kakaotalk/i.test(userAgent) ||
    (window as unknown as { KakaoTalk?: unknown }).KakaoTalk !== undefined
  );
};

/**
 * 카카오 SDK 로드 상태 확인
 */
export const isKakaoSDKLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.Kakao;
};

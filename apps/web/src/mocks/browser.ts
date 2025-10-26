import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

// MSW 워커 생성
export const worker = setupWorker(...handlers);

// 개발 모드에서만 워커 시작
export const startMswWorker = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 실제 네트워크로 전달
        serviceWorker: {
          url: '/mockServiceWorker.js', // public 폴더에 있는 service worker
        },
        waitUntilReady: true, // 워커가 준비될 때까지 대기
      });

      console.log('MSW가 시작되었습니다.');
      console.log('등록된 핸들러:', handlers.length, '개');
      console.log('Mock API 엔드포인트:');

      // 등록된 핸들러들의 엔드포인트 출력 (개발용)
      handlers.forEach((handler: any) => {
        if (handler.info) {
          console.log(
            `   ${handler.info.method?.toUpperCase()} ${handler.info.path}`
          );
        }
      });
    } catch (error) {
      console.error('MSW 시작 실패:', error);
      throw error;
    }
  }
};

// 워커 중지
export const stopMswWorker = () => {
  if (worker) {
    worker.stop();
    console.log('MSW가 중지되었습니다.');
  }
};

// 런타임에 핸들러 추가/제거 (개발/테스트용)
export const addHandlers = (...newHandlers: any[]) => {
  worker.use(...newHandlers);
  console.log(`${newHandlers.length}개 핸들러가 추가되었습니다.`);
};

export const resetHandlers = () => {
  worker.resetHandlers();
  console.log('핸들러가 초기화되었습니다.');
};

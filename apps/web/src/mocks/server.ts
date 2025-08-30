import { setupServer } from 'msw/node';

import { handlers } from './handlers';

// Node.js 환경용 MSW 서버 (Jest 테스트에서 사용)
export const server = setupServer(...handlers);

// 테스트 환경 설정
export const setupMswForTests = () => {
  // 모든 테스트 실행 전에 서버 시작
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error', // 테스트에서는 예상치 못한 요청을 에러로 처리
    });
    console.log('🧪 테스트용 MSW 서버가 시작되었습니다.');
  });

  // 각 테스트 후 핸들러 리셋
  afterEach(() => {
    server.resetHandlers();
  });

  // 모든 테스트 완료 후 서버 종료
  afterAll(() => {
    server.close();
    console.log('🧪 테스트용 MSW 서버가 종료되었습니다.');
  });
};

// 특정 테스트를 위한 핸들러 오버라이드
export const overrideHandlersForTest = (...testHandlers: any[]) => {
  server.use(...testHandlers);
};

// 테스트용 헬퍼 함수들
export const mswTestHelpers = {
  // 특정 API 호출 에러 시뮬레이션
  simulateError: (endpoint: string, status: number = 500) => {
    const { http, HttpResponse } = require('msw');
    return http.all(endpoint, () =>
      HttpResponse.json({ error: 'Test error' }, { status })
    );
  },

  // 네트워크 에러 시뮬레이션
  simulateNetworkError: (endpoint: string) => {
    const { http, HttpResponse } = require('msw');
    return http.all(endpoint, () =>
      HttpResponse.json({ error: 'Network error' }, { status: 503 })
    );
  },

  // 지연 시뮬레이션
  simulateDelay: (endpoint: string, delay: number) => {
    const { delay: sleep, http, HttpResponse } = require('msw');
    return http.all(endpoint, async () => {
      await sleep(delay);
      return HttpResponse.json({ delayed: true });
    });
  },
};

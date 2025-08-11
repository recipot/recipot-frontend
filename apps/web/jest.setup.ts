import '@testing-library/jest-dom';

import { afterAll, afterEach, beforeAll } from '@jest/globals';

// MSW v2 테스트 서버 셋업
import { server } from './src/mocks/server';

// 테스트 시작 전 서버 실행
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 각 테스트 후 핸들러 초기화
afterEach(() => server.resetHandlers());

// 모든 테스트 종료 후 서버 종료
afterAll(() => server.close());

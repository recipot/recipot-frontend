const nextJest = require('next/jest');

// Next.js 설정과 연동
const createJestConfig = nextJest({
  dir: './', // Next.js 앱 루트 경로
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom', // 브라우저 환경
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // 테스트 사전 설정
  moduleNameMapper: {
    // import alias 경로 매핑
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);

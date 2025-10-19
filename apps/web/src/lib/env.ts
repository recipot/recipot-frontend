/**
 * 앱 환경 유틸리티
 *
 * NODE_ENV는 Vercel에서 항상 production이므로
 * NEXT_PUBLIC_APP_ENV를 사용하여 실제 환경을 판단
 */

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';

/**
 * 개발 환경 여부 (localhost + dev.hankkibuteo.com)
 */
export const isDevelopment = APP_ENV === 'development';

/**
 * 프로덕션 환경 여부 (www.hankkibuteo.com)
 */
export const isProduction = APP_ENV === 'production';

/**
 * 환경 정보 로깅
 */
export const logEnvironment = () => {
  console.info('🌍 환경 정보:');
  console.info(`  - NODE_ENV: ${process.env.NODE_ENV}`);
  console.info(`  - APP_ENV: ${APP_ENV}`);
  console.info(`  - isDevelopment: ${isDevelopment}`);
  console.info(`  - isProduction: ${isProduction}`);
  console.info(`  - Backend URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
};

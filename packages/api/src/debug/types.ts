/**
 * 디버그 토큰 관련 타입 정의
 * 테스트 환경에서만 사용하는 임시 토큰 발급용 타입들
 */

export interface DebugTokenRequest {
  userId: number;
  role: string;
}

export interface DebugTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
}

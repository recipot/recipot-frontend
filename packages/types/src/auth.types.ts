export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  recipeCompleteCount: number;
  isFirstEntry: boolean;
  role: 'general' | 'admin';
  platform: 'kakao' | 'google';
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

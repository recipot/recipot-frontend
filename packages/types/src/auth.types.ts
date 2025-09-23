export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  isOnboardingCompleted?: boolean;
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

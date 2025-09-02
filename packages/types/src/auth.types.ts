export interface AuthResponse {
  success: boolean;
  data?: any;
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

type status = 200 | 400 | 401 | 403 | 404 | 500;

/**
 * 소셜 로그인 응답 타입
 */
export interface OAuthResponse {
  status: status;
  data: {
    userId: number;
    accessToken: string;
    accessExpiresAt: string;
    refreshToken: string;
    refreshExpiresAt: string;
  };
}

/**
 * 사용자 정보 조회 응답 타입
 */
export interface UserInfoResponse {
  status: status;
  data: {
    id: number;
    email: string;
    nickname: string;
    profile_image_url: string;
    recipe_complete_count: number;
    is_first_entry: boolean;
    unavailable_ingredients: {
      id: number;
      name: string;
    }[];
    created_at: string;
    updated_at: string;
  };
}

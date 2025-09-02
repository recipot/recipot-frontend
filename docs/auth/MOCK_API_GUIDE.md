# Mock API 사용 가이드

백엔드 API가 준비되지 않은 상황에서 클라이언트 개발을 위한 Mock API 설정이 완료되었습니다.

## 🔧 설정된 Mock API 엔드포인트

### 인증 관련 API (`/v1/auth/*`)

#### 1. 카카오 로그인 URL

```typescript
// GET /v1/login/kakao
// 실제로는 리디렉션이지만, mock에서는 토큰을 바로 반환
const response = await authService.getKakaoLoginUrl();
```

#### 2. JWT 토큰 검증

```typescript
// POST /v1/auth/verify
const result = await authService.verifyToken('kakao_mock_token_xxxxx');
// 응답: AuthResponse { success: true, data: UserInfo, message: string }
```

#### 3. 토큰 갱신

```typescript
// POST /v1/auth/refresh
const tokens = await authService.refreshToken('kakao_mock_refresh_xxxxx');
// 응답: TokenResponse { accessToken, refreshToken, expiresIn }
```

#### 4. 사용자 정보 조회

```typescript
// GET /v1/auth/info/{userId}
const user = await authService.getUserInfo('1', 'kakao_mock_token_xxxxx');
// 응답: UserInfo
```

#### 5. 로그아웃

```typescript
// POST /v1/auth/logout
const result = await authService.logout('kakao_mock_token_xxxxx');
// 응답: AuthResponse { success: true, message: string }
```

## 🧪 테스트용 Mock 데이터

### 사용자 데이터

```typescript
const mockUsers = [
  {
    id: '1',
    name: '김철수',
    email: 'test@kakao.com',
    provider: 'kakao',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
  },
  {
    id: '2',
    name: '이영희',
    email: 'test@google.com',
    provider: 'google',
    // ...
  },
  // ...
];
```

### 토큰 형식

- **Access Token**: `kakao_mock_token_{timestamp}`
- **Refresh Token**: `kakao_mock_refresh_{timestamp}`
- **만료 시간**: 3600초 (1시간)

## 🎯 사용 예시

### AuthContext에서 활용

```typescript
import { useAuth } from '@recipot/contexts';

function LoginButton() {
  const { login, user, token, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  if (user) {
    return <div>안녕하세요, {user.name}님!</div>;
  }

  return <button onClick={login}>카카오 로그인</button>;
}
```

### 직접 API 호출

```typescript
import { authService } from '@recipot/api';

// 토큰 검증 테스트
try {
  const result = await authService.verifyToken('kakao_mock_token_1234567890');
  console.log('사용자 정보:', result.data);
} catch (error) {
  console.error('토큰 검증 실패:', error.message);
}
```

## 🚨 주의사항

1. **토큰 형식**: Mock 토큰은 반드시 `mock_token` 또는 `mock_refresh` 문자열을 포함해야 합니다.
2. **네트워크 지연**: 실제 API와 유사한 경험을 위해 의도적인 지연(delay)이 설정되어 있습니다.
3. **에러 테스트**: `/v1/auth/error-test` 엔드포인트로 서버 에러를 시뮬레이션할 수 있습니다.

## 🔄 백엔드 연동 준비

실제 백엔드가 준비되면 다음 환경변수만 변경하면 됩니다:

```env
# .env.local
NEXT_PUBLIC_BACKEND_URL=https://your-actual-backend.com
```

Mock 데이터는 개발 환경에서만 동작하므로, 프로덕션에서는 자동으로 비활성화됩니다.

## 🧬 추가 개발/테스트용 기능

- **네트워크 에러 시뮬레이션**: `/v1/auth/network-error`
- **서버 에러 시뮬레이션**: `/v1/auth/error-test`
- **다양한 사용자 시나리오**: 3명의 다른 provider 사용자 데이터 제공

이제 백엔드 개발이 완료될 때까지 클라이언트 개발을 원활하게 진행하실 수 있습니다! 🚀

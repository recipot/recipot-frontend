'use client';

import { useState } from 'react';
import { authService } from '@recipot/api';
import { useAuth } from '@recipot/contexts';

export default function TestPage() {
  const {
    googleLogin,
    loading,
    login,
    logout,
    refreshAuth,
    refreshToken,
    token,
    user,
  } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testTokenVerification = async () => {
    if (!token) {
      addResult('❌ 토큰이 없습니다. 먼저 로그인하세요.');
      return;
    }

    try {
      const result = await authService.verifyToken(token);
      addResult(`✅ 토큰 검증 성공: ${result.message}`);
    } catch (error) {
      addResult(`❌ 토큰 검증 실패: ${error}`);
    }
  };

  const testTokenRefresh = async () => {
    if (!refreshToken) {
      addResult('❌ 리프레시 토큰이 없습니다. 먼저 로그인하세요.');
      return;
    }

    try {
      const result = await authService.refreshToken(refreshToken);
      addResult(`✅ 토큰 갱신 성공: ${result.accessToken.substring(0, 20)}...`);
    } catch (error) {
      addResult(`❌ 토큰 갱신 실패: ${error}`);
    }
  };

  const testRefreshAuth = async () => {
    if (!refreshToken) {
      addResult('❌ 리프레시 토큰이 없습니다. 먼저 로그인하세요.');
      return;
    }

    try {
      await refreshAuth();
      addResult('✅ AuthContext 토큰 갱신 성공');
    } catch (error) {
      addResult(`❌ AuthContext 토큰 갱신 실패: ${error}`);
    }
  };

  const testUserInfo = async () => {
    if (!token) {
      addResult('❌ 토큰이 없습니다.');
      return;
    }

    try {
      const result = await authService.getUserInfo(token);
      addResult(`✅ 사용자 정보 조회 성공: ${result.name} (${result.email})`);
    } catch (error) {
      addResult(`❌ 사용자 정보 조회 실패: ${error}`);
    }
  };

  const testLogout = async () => {
    if (!token) {
      addResult('❌ 토큰이 없습니다.');
      return;
    }

    try {
      const result = await authService.logout(token);
      addResult(`✅ 로그아웃 API 성공: ${result.message}`);
      // 실제 로그아웃은 하지 않음 (테스트 목적)
    } catch (error) {
      addResult(`❌ 로그아웃 API 실패: ${error}`);
    }
  };

  const simulateCallbackWithToken = () => {
    // Mock API에서 인식할 수 있는 토큰 형식 사용
    const mockToken = `kakao_mock_token_${Date.now()}`;
    addResult(`🔄 토큰 콜백 시뮬레이션 시작: ${mockToken.substring(0, 25)}...`);
    window.location.href = `/v1/login/kakao/callback?token=${mockToken}`;
  };

  const simulateCallbackWithCode = () => {
    const mockCode = `mock_auth_code_${Date.now()}`;
    addResult(`🔄 코드 콜백 시뮬레이션 시작: ${mockCode}`);
    window.location.href = `/v1/login/kakao/callback?code=${mockCode}`;
  };

  const testCallbackDirectly = async () => {
    addResult('🔄 콜백 API 직접 테스트 시작...');
    try {
      const mockCode = `mock_auth_code_${Date.now()}`;
      const response = await fetch(
        `/v1/login/kakao/callback?code=${mockCode}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      addResult(`✅ 콜백 API 응답: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`❌ 콜백 API 실패: ${error}`);
    }
  };

  const testAuthUrlGeneration = async () => {
    addResult('🔄 카카오 로그인 URL 생성 테스트...');
    try {
      const response = await fetch('/v1/login/kakao', {
        method: 'GET',
      });

      const data = await response.json();
      addResult(`✅ 카카오 URL 생성 응답: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`❌ 카카오 URL 생성 실패: ${error}`);
    }
  };

  const testNewCallbackFlow = () => {
    addResult('🔄 새로운 콜백 플로우 테스트...');
    addResult('📍 /v1/login/kakao/callback 경로로 이동합니다...');
    const mockCode = `mock_auth_code_${Date.now()}`;
    window.location.href = `/v1/login/kakao/callback?code=${mockCode}`;
  };

  // 구글 로그인 관련 테스트 함수들
  const testGoogleAuthUrlGeneration = async () => {
    addResult('🔄 구글 로그인 URL 생성 테스트...');
    try {
      const response = await fetch('/v1/login/google', {
        method: 'GET',
      });

      const data = await response.json();
      addResult(`✅ 구글 URL 생성 응답: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`❌ 구글 URL 생성 실패: ${error}`);
    }
  };

  const testGoogleCallbackDirectly = async () => {
    addResult('🔄 구글 콜백 API 직접 테스트 시작...');
    try {
      const mockCode = `mock_google_code_${Date.now()}`;
      const response = await fetch(
        `/v1/login/google/callback?code=${mockCode}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      addResult(`✅ 구글 콜백 API 응답: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`❌ 구글 콜백 API 실패: ${error}`);
    }
  };

  const simulateGoogleCallbackWithToken = () => {
    const mockToken = `google_mock_token_${Date.now()}`;
    addResult(
      `🔄 구글 토큰 콜백 시뮬레이션 시작: ${mockToken.substring(0, 25)}...`
    );
    window.location.href = `/v1/login/google/callback?token=${mockToken}`;
  };

  const simulateGoogleCallbackWithCode = () => {
    const mockCode = `mock_google_code_${Date.now()}`;
    addResult(`🔄 구글 코드 콜백 시뮬레이션 시작: ${mockCode}`);
    window.location.href = `/v1/login/google/callback?code=${mockCode}`;
  };

  const testGoogleLoginFlow = () => {
    addResult('🔄 구글 로그인 플로우 테스트...');
    addResult('📍 /v1/login/google/callback 경로로 이동합니다...');
    const mockCode = `mock_google_code_${Date.now()}`;
    window.location.href = `/v1/login/google/callback?code=${mockCode}`;
  };

  const testUserProfileDirect = async () => {
    if (!token) {
      addResult('❌ 토큰이 없습니다.');
      return;
    }

    addResult('🔄 사용자 프로필 직접 API 테스트...');
    try {
      const response = await fetch('/v1/user/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });

      const data = await response.json();
      addResult(`✅ 사용자 프로필 API 응답: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`❌ 사용자 프로필 API 실패: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">인증 시스템 테스트</h1>

      {/* 현재 상태 */}
      <div className="mb-8 rounded-lg bg-gray-100 p-6">
        <h2 className="mb-4 text-xl font-semibold">현재 상태</h2>
        <div className="space-y-2">
          <p>
            <strong>로그인 상태:</strong> {user ? '로그인됨' : '로그아웃됨'}
          </p>
          {user && (
            <>
              <p>
                <strong>사용자명:</strong> {user.name}
              </p>
              <p>
                <strong>이메일:</strong> {user.email}
              </p>
              <p>
                <strong>제공자:</strong> {user.provider}
              </p>
            </>
          )}
          <p>
            <strong>토큰:</strong>{' '}
            {token ? `${token.substring(0, 30)}...` : '없음'}
          </p>
          <p>
            <strong>리프레시 토큰:</strong>{' '}
            {refreshToken ? `${refreshToken.substring(0, 30)}...` : '없음'}
          </p>
        </div>
      </div>

      {/* 기본 로그인/로그아웃 */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">기본 인증</h2>
        <div className="space-x-4">
          {!user ? (
            <>
              <button
                onClick={login}
                className="rounded bg-yellow-400 px-4 py-2 text-black hover:bg-yellow-500"
              >
                카카오 로그인 (Mock)
              </button>
              <button
                onClick={googleLogin}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                구글 로그인 (Mock)
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              로그아웃
            </button>
          )}
        </div>
      </div>

      {/* API 테스트 */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">API 테스트</h2>
        <div className="mb-4 space-x-4">
          <button
            onClick={testTokenVerification}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            토큰 검증
          </button>
          <button
            onClick={testTokenRefresh}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            토큰 갱신 (API)
          </button>
          <button
            onClick={testRefreshAuth}
            className="rounded bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
          >
            토큰 갱신 (Context)
          </button>
          <button
            onClick={testUserInfo}
            className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          >
            사용자 정보 조회
          </button>
          <button
            onClick={testUserProfileDirect}
            className="rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
          >
            사용자 프로필 직접 API
          </button>
          <button
            onClick={testLogout}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            로그아웃 API
          </button>
        </div>
      </div>

      {/* 콜백 테스트 */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">콜백 테스트</h2>
        <div className="mb-4 space-x-4">
          <button
            onClick={simulateCallbackWithToken}
            className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
          >
            토큰 콜백 시뮬레이션
          </button>
          <button
            onClick={simulateCallbackWithCode}
            className="rounded bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
          >
            코드 콜백 시뮬레이션
          </button>
          <button
            onClick={testCallbackDirectly}
            className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            콜백 API 직접 테스트
          </button>
          <button
            onClick={testAuthUrlGeneration}
            className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
          >
            카카오 URL 생성 테스트
          </button>
          <button
            onClick={testNewCallbackFlow}
            className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
          >
            새로운 콜백 플로우 테스트
          </button>
        </div>
        <p className="text-sm text-gray-600">
          실제 카카오 인증 플로우를 시뮬레이션합니다. 새 페이지로 이동됩니다.
        </p>
      </div>

      {/* 구글 로그인 테스트 */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">구글 로그인 테스트</h2>
        <div className="mb-4 space-x-4">
          <button
            onClick={testGoogleAuthUrlGeneration}
            className="rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500"
          >
            구글 URL 생성 테스트
          </button>
          <button
            onClick={testGoogleCallbackDirectly}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            구글 콜백 API 직접 테스트
          </button>
          <button
            onClick={simulateGoogleCallbackWithToken}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            구글 토큰 콜백 시뮬레이션
          </button>
          <button
            onClick={simulateGoogleCallbackWithCode}
            className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
          >
            구글 코드 콜백 시뮬레이션
          </button>
          <button
            onClick={testGoogleLoginFlow}
            className="rounded bg-red-800 px-4 py-2 text-white hover:bg-red-900"
          >
            구글 로그인 플로우 테스트
          </button>
        </div>
        <p className="text-sm text-gray-600">
          실제 구글 인증 플로우를 시뮬레이션합니다. 새 페이지로 이동됩니다.
        </p>
      </div>

      {/* 테스트 결과 */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">테스트 결과</h2>
          <button
            onClick={clearResults}
            className="rounded bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400"
          >
            결과 지우기
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto rounded bg-gray-50 p-4">
          {testResults.length === 0 ? (
            <p className="text-gray-500">
              테스트를 실행하면 결과가 여기에 표시됩니다.
            </p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono text-sm">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

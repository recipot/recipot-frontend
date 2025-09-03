'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRefreshToken, setToken, setUser } = useAuth();
  const [status, setStatus] = useState('구글 로그인 처리 중...');

  const handleTokenReceived = useCallback(
    async (token: string) => {
      try {
        setStatus('사용자 정보를 확인하는 중...');

        // 토큰 검증 및 사용자 정보 조회
        const userResponse = await authService.verifyToken(token);

        if (userResponse.success && userResponse.data) {
          localStorage.setItem('authToken', token);
          setToken(token);
          setUser(userResponse.data);

          // 토큰 콜백의 경우 임시로 리프레시 토큰을 생성
          const tempRefreshToken = `temp_refresh_${Date.now()}`;
          localStorage.setItem('refreshToken', tempRefreshToken);
          setRefreshToken(tempRefreshToken);

          setStatus('로그인 성공! 메인 페이지로 이동합니다...');
          setTimeout(() => router.push('/'), 1000);
        } else {
          throw new Error('사용자 정보 조회 실패');
        }
      } catch (error) {
        console.error('토큰 처리 실패:', error);
        setStatus('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.push('/'), 2000);
      }
    },
    [router, setRefreshToken, setToken, setUser]
  );

  const handleAuthCode = useCallback(
    async (code: string) => {
      try {
        setStatus('구글 인증을 처리하는 중...');

        // authService를 통해 토큰 받기 (GET 요청)
        const tokenData = await authService.getTokenFromGoogleCallback(code);

        const { accessToken, refreshToken, user } = tokenData;
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);

        setStatus('로그인 성공! 메인 페이지로 이동합니다...');
        setTimeout(() => router.push('/'), 1000);
      } catch (error) {
        console.error('구글 인증 코드 처리 실패:', error);
        setStatus('구글 로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.push('/'), 2000);
      }
    },
    [router, setRefreshToken, setToken, setUser]
  );

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus('구글 로그인에 실패했습니다.');
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    if (token) {
      // 백엔드에서 JWT 토큰을 쿼리 파라미터로 전달받는 경우 (테스트용)
      handleTokenReceived(token);
    } else if (code) {
      // 구글에서 받은 인증 코드를 백엔드로 전달 (실제 플로우)
      handleAuthCode(code);
    } else {
      setStatus('구글 인증 정보를 찾을 수 없습니다.');
      setTimeout(() => router.push('/'), 2000);
    }
  }, [searchParams, router, handleAuthCode, handleTokenReceived]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-red-600" />
        <p className="text-lg font-medium">{status}</p>
        <p className="mt-2 text-sm text-gray-600">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}

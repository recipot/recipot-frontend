import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { code, token } = router.query;

    if (token) {
      // 백엔드에서 JWT 토큰을 쿼리 파라미터로 전달받는 경우
      localStorage.setItem('authToken', token as string);
      router.push('/');
    } else if (code) {
      // 인증 코드를 받아서 백엔드로 전달하는 경우
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/login/kakao/callback?code=${code}`
      )
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('authToken', data.token as string);
          router.push('/');
        });
    }
  }, [router]);

  return <div>로그인 처리 중...</div>;
}

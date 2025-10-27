import './globals.css';

import localFont from 'next/font/local';

import Providers from './providers';

import type { Metadata } from 'next';

const pretendard = localFont({
  display: 'swap',
  src: '../../public/fonts/pretendard/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '100 900',
});

export const metadata: Metadata = {
  description: '냉장고 속 재료로 만드는 유연채식 집밥 레시피. 귀찮고 피곤한 날에도 건강한 한끼를 챙길 수 있게.',
  title: '작심삼일 없는 집밥 루틴 서비스. 한끼부터',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} antialiased`}>
      <head>
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@recipot/api'],
  images: {
    // 임시 이미지 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    domains: [
      'appcook-bucket-cook-admin-ap-northeast-2.s3.ap-northeast-2.amazonaws.com',
    ],
  },

  // 개발 환경에서 백엔드 프록시 설정
  async rewrites() {
    // 개발 환경에서만 프록시 사용
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
        },
      ];
    }
    return [];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;

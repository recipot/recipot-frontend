import React from 'react';
import Image from 'next/image';

import LoadingBob from '../../../../public/loading_bob.webp';

interface LoadingPageProps {
  /** 로딩 메시지 (children으로 전달) */
  children?: React.ReactNode;
}

/**
 * 전체 화면 로딩 컴포넌트
 *
 * 이미지와 스타일은 고정되어 있으며, 하단 텍스트만 children으로 커스터마이징 가능합니다.
 *
 * @example
 * // 기본 사용 (기본 메시지 표시)
 * <LoadingPage />
 *
 * @example
 * // 간단한 텍스트
 * <LoadingPage>레시피를 검색하고 있어요</LoadingPage>
 *
 * @example
 * // 여러 줄 텍스트
 * <LoadingPage>
 *   {userName}님의 <br />
 *   지금 바로 해먹을 수 있는 요리를<br />
 *   찾고 있어요
 * </LoadingPage>
 */
const LoadingPage = ({ children }: LoadingPageProps) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#00000099]">
      <div className="mb-8 size-[138px] overflow-hidden rounded-full">
        <Image
          src={LoadingBob}
          alt="로딩 중"
          width={138}
          height={138}
          className="size-full object-cover"
        />
      </div>
      <p className="text-18sb text-center text-white">
        {children ?? '열심히 요리 중...'}
      </p>
    </div>
  );
};

export default LoadingPage;

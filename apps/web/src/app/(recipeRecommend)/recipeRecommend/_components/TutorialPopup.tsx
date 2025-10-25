'use client';

import React from 'react';

import { RefreshIcon } from '@/components/Icons';

interface TutorialPopupProps {
  onClose: () => void;
}

export default function TutorialPopup({ onClose }: TutorialPopupProps) {
  return (
    <div className="">
      {/* 배경 딤 (dim) - opacity: 0.8 */}
      <div className="dim-80" />

      {/* 우측 상단 새로고침 표시 원형 버튼 */}
      <div className="absolute top-0 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-[100px] bg-white p-2">
        <RefreshIcon size={24} color="#212529" />
      </div>

      {/* 튜토리얼 다이얼로그 */}
      <div className="absolute top-[9rem] left-1/2 z-[70] w-[342px] -translate-x-1/2 rounded-[18px] bg-white px-6 pb-6">
        {/* 텍스트 영역 */}
        <div className="px-6 pt-[26px] pb-6 text-center">
          <p className="text-16b text-[#212529]">
            컨디션과 재료는 그대로,
            <br />
            다른 레시피를 원한다면?
            <br />
          </p>
          <span className="text-17sb text-[#68982D]">
            새로고침을 눌러 추천받으세요!{' '}
          </span>
        </div>

        {/* 확인 버튼 */}
        <div className="mb-4 flex h-6 justify-center">
          <button
            onClick={onClose}
            className="text-15sb h-10 w-[294px] rounded-[100px] bg-[#68982d] px-5 py-2 text-center text-white transition-colors hover:bg-[#5a7a26] focus:ring-2 focus:ring-[#68982d] focus:ring-offset-2 focus:outline-none"
          >
            확인했어요
          </button>
        </div>
      </div>
    </div>
  );
}

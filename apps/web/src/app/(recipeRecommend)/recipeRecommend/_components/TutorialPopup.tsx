'use client';

import React from 'react';

import { Button } from '@/components/common/Button';
import { RefreshIcon } from '@/components/Icons';

interface TutorialPopupProps {
  onClose: () => void;
}

export default function TutorialPopup({ onClose }: TutorialPopupProps) {
  return (
    <>
      {/* 배경 딤 (dim) - opacity: 0.8 */}
      <div className="dim-80" />

      {/* 우측 상단 새로고침 표시 원형 버튼 */}
      <div className="absolute top-2 right-5 z-[60] flex size-12 items-center justify-center rounded-[100px] bg-white p-2">
        <RefreshIcon size={24} color="#212529" />
      </div>

      {/* 튜토리얼 다이얼로그 */}
      <div className="absolute top-[5rem] left-1/2 z-[70] w-[calc(100%-48px)] -translate-x-1/2 rounded-[18px] bg-white px-6 pb-6 before:absolute before:-top-[8px] before:right-[0.7rem] before:border-r-[10px] before:border-b-[10px] before:border-l-[10px] before:border-r-transparent before:border-b-white before:border-l-transparent before:content-['']">
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
          <Button size="full" onClick={onClose}>
            확인했어요
          </Button>
        </div>
      </div>
    </>
  );
}

import React from 'react';
import Image from 'next/image';

import type { MeasurementGuideContentProps } from './types';

export function MeasurementGuideContent({
  activeTab,
  measurementData,
}: MeasurementGuideContentProps) {
  if (!activeTab) {
    return null;
  }

  // API 응답의 키를 그대로 사용 (이미 한글)
  const items = measurementData[activeTab] || [];

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex flex-nowrap gap-[20px] overflow-x-auto rounded-xl pb-5">
      {items.map(item => (
        <div
          key={item.standard}
          className="flex flex-shrink-0 flex-col items-center justify-center"
        >
          <div className="flex h-[125px] w-[125px] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.standard}
                width={84}
                height={84}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-13 text-gray-400">이미지 준비중</div>
            )}
          </div>
          <div className="mt-3">
            <div className="text-14sb mb-2 text-center text-gray-700">
              {item.standard}
            </div>
            <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-2 py-[2px]">
              <p className="text-13">{item.description ?? '상세 설명'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import Image from 'next/image';

interface MeasurementItem {
  standard: string;
  imageUrl: string;
  description: string;
}

interface MeasurementData {
  [key: string]: MeasurementItem[];
}

interface MeasurementGuideContentProps {
  activeTab: string | null;
  measurementData: MeasurementData;
  categoryMapping: Record<string, string>;
}

export function MeasurementGuideContent({
  activeTab,
  categoryMapping,
  measurementData,
}: MeasurementGuideContentProps) {
  if (!activeTab) {
    return null;
  }

  const categoryName = categoryMapping[activeTab];
  const items = measurementData[categoryName] || [];

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex w-full flex-nowrap gap-[20px] self-stretch overflow-x-auto rounded-xl px-4 pb-5">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-shrink-0 flex-col items-center justify-center"
        >
          <div className="flex h-[125px] w-[125px] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.standard}
                width={125}
                height={125}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-gray-400">이미지 없음</div>
            )}
          </div>
          <div className="mt-3">
            <div className="text-14sb mb-2 text-center text-gray-700">
              {item.description || '상세 설명'}
            </div>
            <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-2 py-[2px]">
              <p className="text-13">{item.standard}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeasurementGuideContent;

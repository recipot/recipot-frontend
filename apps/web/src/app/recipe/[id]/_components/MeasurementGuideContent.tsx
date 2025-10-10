import React from 'react';

interface MeasurementGuideContentProps {
  activeTab: string | null;
}

export function MeasurementGuideContent({
  activeTab,
}: MeasurementGuideContentProps) {
  if (!activeTab) {
    return null;
  }

  return (
    <div className="mt-4 flex w-full flex-nowrap items-start gap-[20px] self-stretch overflow-x-auto rounded-xl px-4 pt-3 pb-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-[125px] w-[125px] items-center justify-center rounded-lg bg-gray-100" />
        <div className="mt-3">
          <div className="text-14sb mb-2 text-center text-gray-700">
            1숟가락 가득
          </div>
          <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-2 py-[2px]">
            <p className="text-13">1큰술 &nbsp;</p>
            <p className="text-13sb">15ml</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-[125px] w-[125px] items-center justify-center rounded-lg bg-gray-100" />
        <div className="mt-3">
          <div className="text-14sb mb-2 text-center text-gray-700">
            1숟가락 가득
          </div>
          <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-2 py-[2px]">
            <p className="text-13">1큰술 &nbsp;</p>
            <p className="text-13sb">15ml</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeasurementGuideContent;

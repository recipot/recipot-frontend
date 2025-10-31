import React, { useState } from 'react';

import { MEASUREMENT_TABS } from '@/app/recipe/[id]/_components/IngredientsSection.constants';

import { MEASUREMENT_GUIDE_DATA } from './constants';
import {
  MeasurementGuideContent,
  MeasurementGuideToggle,
  MeasurementTab,
} from './index';

// 탭 ID를 한글 라벨로 매핑
const TAB_ID_TO_LABEL_MAP: Record<string, string> = {
  liquid: '액체류',
  powder: '가루류',
  sauce: '장,젓갈류',
};

interface MeasurementGuideProps {
  /** 초기 활성 탭 ID (선택사항) */
  initialActiveTab?: string;
}

export function MeasurementGuide({ initialActiveTab }: MeasurementGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(() => {
    if (initialActiveTab) {
      const isValidTab = MEASUREMENT_TABS.some(
        tab => tab.id === initialActiveTab
      );
      if (isValidTab) {
        return initialActiveTab;
      }
    }
    return MEASUREMENT_TABS.length > 0 ? MEASUREMENT_TABS[0].id : null;
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // 탭 ID를 한글 라벨로 변환하여 데이터 접근
  const activeTabLabel =
    activeTab && activeTab in TAB_ID_TO_LABEL_MAP
      ? TAB_ID_TO_LABEL_MAP[activeTab]
      : null;

  return (
    <MeasurementGuideToggle isOpen={isOpen} onToggle={handleToggle}>
      <div className="space-y-3 px-4 pt-3 pb-4">
        <MeasurementTab activeTab={activeTab} onTabChange={handleTabChange} />
        <MeasurementGuideContent
          activeTab={activeTabLabel}
          measurementData={MEASUREMENT_GUIDE_DATA}
        />
      </div>
    </MeasurementGuideToggle>
  );
}

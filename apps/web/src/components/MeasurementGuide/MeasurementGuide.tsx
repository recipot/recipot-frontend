import React, { useEffect, useState } from 'react';

import {
  MEASUREMENT_GUIDE_CATEGORIES,
  MEASUREMENT_GUIDE_DATA,
} from './constants';
import {
  MeasurementGuideContent,
  MeasurementGuideToggle,
  MeasurementTab,
} from './index';

interface MeasurementGuideProps {
  /** 초기 활성 탭 (선택사항) */
  initialActiveTab?: string;
}

export function MeasurementGuide({ initialActiveTab }: MeasurementGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 초기 활성 탭 설정
  useEffect(() => {
    if (
      initialActiveTab &&
      MEASUREMENT_GUIDE_CATEGORIES.includes(initialActiveTab)
    ) {
      setActiveTab(initialActiveTab);
    } else if (!activeTab && MEASUREMENT_GUIDE_CATEGORIES.length > 0) {
      setActiveTab(MEASUREMENT_GUIDE_CATEGORIES[0]);
    }
  }, [initialActiveTab, activeTab]);

  return (
    <MeasurementGuideToggle isOpen={isOpen} onToggle={handleToggle}>
      <div className="space-y-3 px-4 pt-3 pb-4">
        <MeasurementTab
          activeTab={activeTab}
          onTabChange={handleTabChange}
          categories={MEASUREMENT_GUIDE_CATEGORIES}
        />
        <MeasurementGuideContent
          activeTab={activeTab}
          measurementData={MEASUREMENT_GUIDE_DATA}
        />
      </div>
    </MeasurementGuideToggle>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { tokenUtils } from 'packages/api/src/auth';

import IngredientGroup from './IngredientGroup';
import {
  MEASUREMENT_GUIDE_LABELS,
  MEASUREMENT_TABS,
} from './IngredientsSection.constants';
import MeasurementGuideContent from './MeasurementGuideContent';
import MeasurementGuideToggle from './MeasurementGuideToggle';
import { MeasurementTab } from './MeasurementTab';
import SeasoningList from './SeasoningList';

import type { IngredientsGroup, Seasoning } from '../types/recipe.types';

interface MeasurementItem {
  standard: string;
  imageUrl: string;
  description: string;
}

interface MeasurementData {
  [key: string]: MeasurementItem[];
}

interface IngredientsSectionProps {
  ingredients: IngredientsGroup;
  seasonings: Seasoning[];
}

export function IngredientsSection({
  ingredients,
  seasonings,
}: IngredientsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({});

  const token = tokenUtils.getToken();

  // 탭 ID와 API 카테고리명 매핑

  // 측정 가이드 데이터 fetch
  useEffect(() => {
    const fetchMeasurementGuide = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/measurement-guides`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.data?.data) {
          setMeasurementData(response.data.data.data);
        }
      } catch (error) {
        console.error('측정 가이드 데이터 fetch 실패:', error);
      }
    };

    fetchMeasurementGuide();
  }, [token]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };
  return (
    <div id="ingredients" className="space-y-4">
      {/* Ingredients */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-17sb text-gray-900">재료</p>
          <p className="text-15 text-gray-500">1인분</p>
        </div>
        <IngredientGroup ingredients={ingredients} status="owned" />
        <IngredientGroup ingredients={ingredients} status="notOwned" />
        <IngredientGroup
          ingredients={ingredients}
          status="alternativeUnavailable"
        />

        <div className="mt-8">
          <div className="white rounded-2xl p-4">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">양념류</h3>
            </div>

            <SeasoningList seasonings={seasonings} />

            <MeasurementGuideToggle isOpen={isOpen} onToggle={handleToggle} />

            {isOpen && (
              <div className="rounded-xl border-[1px] border-dashed">
                <div className="no-scrollbar flex w-full flex-nowrap items-center justify-center space-x-4 self-stretch overflow-x-auto px-4 pt-3 pb-5">
                  {MEASUREMENT_TABS.map(tab => (
                    <MeasurementTab
                      key={tab.id}
                      tab={tab}
                      isActive={activeTab === tab.id}
                      onClick={handleTabClick}
                    />
                  ))}
                </div>

                {isOpen && activeTab && (
                  <MeasurementGuideContent
                    activeTab={activeTab}
                    measurementData={measurementData}
                    categoryMapping={MEASUREMENT_GUIDE_LABELS}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientsSection;

'use client';

import React, { useState } from 'react';

import IngredientGroup from './IngredientGroup';
import { MEASUREMENT_TABS } from './IngredientsSection.constants';
import MeasurementGuideContent from './MeasurementGuideContent';
import MeasurementGuideToggle from './MeasurementGuideToggle';
import { MeasurementTab } from './MeasurementTab';
import SeasoningList from './SeasoningList';

import type { Ingredient, Seasoning } from '../types/recipe.types';

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  ingredientsRef: React.RefObject<HTMLDivElement>;
}

export function IngredientsSection({
  ingredients,
  ingredientsRef,
  seasonings,
}: IngredientsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };
  return (
    <div ref={ingredientsRef} data-section="ingredients" className="space-y-4">
      {/* Ingredients */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-17sb text-gray-900">재료</p>
          <p className="text-15 text-gray-500">1인분</p>
        </div>
        <IngredientGroup ingredients={ingredients} status="owned" />
        <IngredientGroup ingredients={ingredients} status="substitutable" />
        <IngredientGroup ingredients={ingredients} status="required" />

        <div className="mt-8">
          <div className="white rounded-2xl p-4">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">양념류</h3>
            </div>

            <SeasoningList seasonings={seasonings} />

            <MeasurementGuideToggle isOpen={isOpen} onToggle={handleToggle} />

            {isOpen && (
              <div className="rounded-xl border-[1px] border-dashed">
                <div className="no-scrollbar flex w-full flex-nowrap items-center justify-center space-x-4 self-stretch overflow-x-auto px-4 pt-3 pb-4">
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
                  <MeasurementGuideContent activeTab={activeTab} />
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

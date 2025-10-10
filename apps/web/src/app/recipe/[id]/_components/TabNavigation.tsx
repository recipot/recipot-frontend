import React from 'react';

import {
  CookOrderIcon,
  CookwareIcon,
  IngredientIcon,
} from '@/components/Icons';
import type { IconProps } from '@/types/Icon.types';

import type { TabId } from '../types/recipe.types';

interface Tab {
  icon: React.FC<IconProps>;
  id: TabId;
  label: string;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabClick: (tabId: TabId) => void;
  tabContainerRef: React.RefObject<HTMLDivElement>;
}

export function TabNavigation({
  activeTab,
  onTabClick,
  tabContainerRef,
}: TabNavigationProps) {
  const tabs: Tab[] = [
    { icon: IngredientIcon, id: 'ingredients', label: '재료' },
    { icon: CookwareIcon, id: 'cookware', label: '조리도구' },
    { icon: CookOrderIcon, id: 'steps', label: '조리순서' },
  ];

  return (
    <div
      ref={tabContainerRef}
      className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm"
    >
      <div className="flex space-x-1">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex items-center space-x-2 rounded-[100px] px-3 py-[9px] transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-transparent text-gray-600'
              }`}
            >
              <IconComponent
                className="mr-1"
                size={20}
                color={activeTab === tab.id ? '#ffffff' : '#6B7280'}
              />
              <p className="text-15">{tab.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabNavigation;

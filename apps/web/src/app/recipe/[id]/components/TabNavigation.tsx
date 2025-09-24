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

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabClick,
  tabContainerRef,
}) => {
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
              className={`flex items-center space-x-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <IconComponent
                className="h-4 w-4"
                color={activeTab === tab.id ? '#ffffff' : '#6B7280'}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;

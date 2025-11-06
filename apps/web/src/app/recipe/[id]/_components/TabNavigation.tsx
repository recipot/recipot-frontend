import React from 'react';
import { Link as ScrollLink } from 'react-scroll';

import {
  CookOrderIcon,
  CookwareIcon,
  IngredientIcon,
} from '@/components/Icons';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/Icon.types';

import type { TabId } from '../types/recipe.types';

interface Tab {
  icon: React.FC<IconProps>;
  id: TabId;
  label: string;
}

interface TabNavigationProps {
  activeTab: TabId;
  offset: number;
  onTabChange: (tabId: TabId) => void;
  hasTools?: boolean;
}

const TABS: Tab[] = [
  { icon: IngredientIcon, id: 'ingredients', label: '재료' },
  { icon: CookwareIcon, id: 'cookware', label: '조리도구' },
  { icon: CookOrderIcon, id: 'steps', label: '조리순서' },
];

export function TabNavigation({
  activeTab,
  hasTools = true,
  offset,
  onTabChange,
}: TabNavigationProps) {
  const filteredTabs = TABS.filter(tab => tab.id !== 'cookware' || hasTools);

  return (
    <div className="sticky top-14 z-10 bg-gray-100 px-4 py-3">
      <nav aria-label="레시피 섹션 네비게이션">
        <ul className="flex space-x-1">
          {filteredTabs.map(tab => {
            const IconComponent = tab.icon;
            const isActive = tab.id === activeTab;

            return (
              <li key={tab.id}>
                <ScrollLink
                  to={tab.id}
                  smooth
                  spy
                  duration={0}
                  offset={-offset}
                  onSetActive={to => {
                    onTabChange(to as TabId);
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-[100px] px-3 py-[9px] transition-all duration-200',
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-transparent text-gray-600'
                  )}
                >
                  <IconComponent
                    className="mr-1"
                    size={20}
                    color={isActive ? '#ffffff' : '#6B7280'}
                  />
                  <span className="text-15">{tab.label}</span>
                </ScrollLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default TabNavigation;

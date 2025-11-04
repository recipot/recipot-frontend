import React from 'react';

import { getToolIcon } from '@/utils/iconMatcher';

import type { Cookware } from '../types/recipe.types';

interface CookwareSectionProps {
  cookware: Cookware[];
}

export function CookwareSection({ cookware }: CookwareSectionProps) {
  if (!cookware || cookware.length === 0) {
    return null;
  }

  return (
    <div id="cookware" className="mt-6 rounded-2xl bg-white p-6">
      <div className="mb-4 flex items-center">
        <h3 className="text-17 mr-1 text-gray-900">조리도구</h3>
        <span className="text-18sb text-primary">{cookware?.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {cookware?.map(item => {
          const IconComponent = getToolIcon(item.name);

          // CookWareTransparentIcon만 props를 받을 수 있음
          return (
            <div key={item.id} className="flex flex-col items-center">
              <IconComponent />
              <span className="text-15">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CookwareSection;

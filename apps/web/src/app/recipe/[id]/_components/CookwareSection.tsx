import React from 'react';

import Title from '@/components/common/RecipeDetails/common/Title';
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
    <div id="cookware" className="space-y-3 rounded-2xl bg-white p-6">
      <Title title="조리도구" className="justify-start gap-1">
        <span className="text-18sb text-primary">{cookware?.length}</span>
      </Title>
      <div className="flex gap-6">
        {cookware?.map(item => {
          const IconComponent = getToolIcon(item.name);

          // CookWareTransparentIcon만 props를 받을 수 있음
          return (
            <div key={item.id} className="flex flex-col items-center gap-1">
              <IconComponent />
              <span className="text-15 text-gray-700">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CookwareSection;

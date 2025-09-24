import React from 'react';

import type { Cookware } from '../types/recipe.types';

interface CookwareSectionProps {
  cookware: Cookware[];
  cookwareRef: React.RefObject<HTMLDivElement>;
}

const CookwareSection: React.FC<CookwareSectionProps> = ({
  cookware,
  cookwareRef,
}) => {
  return (
    <div
      ref={cookwareRef}
      data-section="cookware"
      className="mt-6 rounded-2xl bg-white p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">조리도구</h3>
        <span className="text-sm font-semibold text-green-600">
          {cookware.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {cookware.map((item, index) => (
          <div key={index} className="text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-gray-100" />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookwareSection;

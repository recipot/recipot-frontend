'use client';

import { useState } from 'react';

import { PageHeader } from '@/app/mypage/_components/PageHeader';
import CookedRecipeList from '@/app/mypage/recipes/[type]/_components/CookedRecipeList';
import DefaultRecipeList from '@/app/mypage/recipes/[type]/_components/DefaultRecipeList';
import {
  mockCookedRecipes,
  mockDefaultRecipes,
} from '@/mocks/data/myPage.mock';
import type { PageType } from '@/types/MyPage.types';

const PAGE_CONFIG = {
  cooked: {
    noneBackImage: '',
    overLayColor: '#F4FCE3',
    themeColor: '#F4FCE3',
    title: '내가 만든 요리',
    titleColor: '#66A80F',
  },
  recent: {
    noneBackImage: '/mypage/none-refrigrator-purple.png',
    overLayColor: '#F3F0FF',
    themeColor: '#f3f0ff',
    title: '최근 본 레시피',
    titleColor: '#845ef7',
  },
  saved: {
    noneBackImage: '/mypage/none-refrigrator-blue.png',
    overLayColor: '#CAE9FF',
    themeColor: '#e7f5ff',
    title: '보관한 레시피',
    titleColor: '#228be6',
  },
};

export default function RecipeListPage({ type }: { type: PageType }) {
  const config = PAGE_CONFIG[type];

  const [cookedRecipes, setCookedRecipes] = useState(mockCookedRecipes);
  const [defaultRecipes, setDefaultRecipes] = useState(mockDefaultRecipes);

  const handleToggleSave = (recipeId: number) => {
    if (type === 'cooked') {
      setCookedRecipes(prev =>
        prev.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, isSaved: !recipe.isSaved }
            : recipe
        )
      );
    } else {
      setDefaultRecipes(prev =>
        prev.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, isSaved: !recipe.isSaved }
            : recipe
        )
      );
    }
  };

  return (
    <div>
      <div className="px-5">
        <PageHeader title={config.title} />
      </div>
      <main className="px-5">
        {type === 'cooked' ? (
          <CookedRecipeList
            config={config}
            recipes={cookedRecipes}
            onToggleSave={handleToggleSave}
          />
        ) : (
          <DefaultRecipeList
            config={config}
            recipes={defaultRecipes}
            onToggleSave={handleToggleSave}
          />
        )}
      </main>
    </div>
  );
}

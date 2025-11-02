'use client';

import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/app/mypage/_components/PageHeader';
import CookedRecipeList from '@/app/mypage/recipes/[type]/_components/CookedRecipeList';
import DefaultRecipeList from '@/app/mypage/recipes/[type]/_components/DefaultRecipeList';
import { useCompletedRecipes } from '@/hooks/useCompletedRecipes';
import { useRecentRecipes } from '@/hooks/useRecentRecipes';
import { useStoredRecipes } from '@/hooks/useStoredRecipes';
import {
  mockCookedRecipes,
  mockDefaultRecipes,
} from '@/mocks/data/myPage.mock';
import type { PageType } from '@/types/MyPage.types';

const PAGE_CONFIG = {
  cooked: {
    noneBackImage: '/mypage/none-refrigerator-green.png',
    overLayColor: '#F4FCE3',
    themeColor: '#F4FCE3',
    title: '내가 만든 요리',
    titleColor: '#66A80F',
  },
  recent: {
    noneBackImage: '/mypage/none-refrigerator-purple.png',
    overLayColor: '#F3F0FF',
    themeColor: '#f3f0ff',
    title: '최근 본 레시피',
    titleColor: '#845ef7',
  },
  saved: {
    noneBackImage: '/mypage/none-refrigerator-blue.png',
    overLayColor: '#CAE9FF',
    themeColor: '#e7f5ff',
    title: '보관한 레시피',
    titleColor: '#228be6',
  },
};

export default function RecipeListPage({ type }: { type: PageType }) {
  const config = PAGE_CONFIG[type];

  // 완료한 요리 데이터
  const { data: completedRecipesData, isLoading } = useCompletedRecipes({
    limit: 100,
    page: 1,
  });

  const { data: storedRecipesData, isLoading: isStoredLoading } =
    useStoredRecipes({
      limit: 100,
      page: 1,
    });

  const { data: recentRecipesData, isLoading: isRecentLoading } =
    useRecentRecipes({
      limit: 100,
      page: 1,
    });

  // API 데이터 우선 사용, 없으면 mock 데이터
  const cookedRecipes = completedRecipesData?.items ?? mockCookedRecipes;
  const storedRecipes = storedRecipesData?.items ?? mockDefaultRecipes;
  const recentRecipes = recentRecipesData?.items ?? mockDefaultRecipes;

  const queryClient = useQueryClient();

  const queryKeyMap: Record<PageType, string> = {
    cooked: 'completed-recipes',
    recent: 'recent-recipes',
    saved: 'stored-recipes',
  };
  const key = queryKeyMap[type];
  const defaultRecipe = type === 'saved' ? storedRecipes : recentRecipes;
  const handleToggleSave = () => {
    queryClient.invalidateQueries({
      queryKey: [key],
    });
  };

  // 로딩 처리
  if (isLoading || isStoredLoading || isRecentLoading) {
    return (
      <div>
        <div className="px-5">
          <PageHeader title={config.title} />
        </div>
        <main className="px-5">
          <div className="py-20 text-center text-gray-500">로딩 중...</div>
        </main>
      </div>
    );
  }

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
            recipes={defaultRecipe}
            onToggleSave={handleToggleSave}
            type={type}
          />
        )}
      </main>
    </div>
  );
}

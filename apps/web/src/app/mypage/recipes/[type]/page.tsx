import { use } from 'react';

import type {
  CookedRecipe,
  Recipe,
  RecipePageProps,
} from '@/components/page/mypage/MyPage.types';
import { PageHeader } from '@/components/page/mypage/PageHeader';
import CookedRecipeList from '@/components/page/mypage/recipes/CookedRecipeList';
import DefaultRecipeList from '@/components/page/mypage/recipes/DefaultRecipeList';

const PAGE_CONFIG = {
  cooked: {
    overLayColor: '',
    themeColor: '#F4FCE3',
    title: '내가 만든 요리',
    titleColor: '#66A80F',
  },
  recent: {
    overLayColor: '#F3F0FF',
    themeColor: '#f3f0ff',
    title: '최근 본 레시피',
    titleColor: '#845ef7',
  },
  saved: {
    overLayColor: '#CAE9FF',
    themeColor: '#e7f5ff',
    title: '보관한 레시피',
    titleColor: '#228be6',
  },
};

const mockDefaultRecipes: Recipe[] = [
  {
    description: '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    id: 1,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    title: '새우 땅콩 버거',
  },
  {
    description: '신선한 야채와 과일로 비타민을 보충하세요.',
    id: 2,
    imageUrl: '/recipeImage.png',
    isSaved: false,
    title: '건강한 야채 샐러드',
  },
  {
    description: '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    id: 3,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    title: '새우 땅콩 버거',
  },
  {
    description: '신선한 야채와 과일로 비타민을 보충하세요.',
    id: 4,
    imageUrl: '/recipeImage.png',
    isSaved: false,
    title: '건강한 야채 샐러드',
  },
  {
    description: '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    id: 5,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    title: '새우 땅콩 버거',
  },
  {
    description: '신선한 야채와 과일로 비타민을 보충하세요.',
    id: 6,
    imageUrl: '/recipeImage.png',
    isSaved: false,
    title: '건강한 야채 샐러드',
  },
  {
    description: '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    id: 7,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    title: '새우 땅콩 버거',
  },
  {
    description: '신선한 야채와 과일로 비타민을 보충하세요.',
    id: 8,
    imageUrl: '/recipeImage.png',
    isSaved: false,
    title: '건강한 야채 샐러드',
  },
];

const mockCookedRecipes: CookedRecipe[] = [
  {
    cookedDate: '25.08.12',
    description: '부드러운 닭가슴살과 특제 소스의 조화',
    id: 101,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    reviewId: 1,
    title: '닭가슴살 스테이크',
  },
  {
    cookedDate: '25.08.12',
    description: '부드러운 닭가슴살과 특제 소스의 조화',
    id: 102,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    reviewId: 1,
    title: '닭가슴살 스테이크',
  },
  {
    cookedDate: '25.08.11',
    description: '달콤하고 부드러운 맛이 일품인 영양 만점 스프',
    id: 103,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    reviewId: null,
    title: '단호박 스프',
  },
];

export default function MyRecipePage({ params }: RecipePageProps) {
  const { type } = use(params);
  const config = PAGE_CONFIG[type];

  const recipes = type === 'cooked' ? mockCookedRecipes : mockDefaultRecipes;

  return (
    <div>
      <div className="px-5">
        <PageHeader title="마이페이지" />
      </div>

      <main className="px-5">
        {type === 'cooked' ? (
          <CookedRecipeList
            config={config}
            recipes={recipes as CookedRecipe[]}
          />
        ) : (
          <DefaultRecipeList config={config} recipes={recipes} type={type} />
        )}
      </main>
    </div>
  );
}

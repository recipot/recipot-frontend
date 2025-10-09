import { CookedRecipe, Recipe } from '@/types/MyPage.types';

// 보관한 레시피, 최근 본 레시피 목록 mock
export const mockDefaultRecipes: Recipe[] = [
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

// 내가 만든 요리 목록 mock
export const mockCookedRecipes: CookedRecipe[] = [
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
    reviewId: 2,
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
  {
    cookedDate: '25.08.11',
    description: '달콤하고 부드러운 맛이 일품인 영양 만점 스프',
    id: 104,
    imageUrl: '/recipeImage.png',
    isSaved: true,
    reviewId: null,
    title: '단호박 스프',
  },
];

// 마이페이지 유저 정보 mock
export const mockUser = {
  nickname: '오리무중체다치즈',
  email: 'abc@facebook.com',
  profileImageUrl: '/mypage/default-profile.png',
};

// 못 먹는 음식 mock
export const mockRestrictions = [
  { id: 1, name: '게' },
  { id: 2, name: '능이' },
  { id: 3, name: '느타리' },
  { id: 4, name: '복숭아' },
  { id: 5, name: '새우' },
  { id: 6, name: '고등어' },
];

import { CookedRecipe, Recipe } from '@/types/MyPage.types';
import { CompletedRecipe } from '@recipot/api';

// 보관한 레시피, 최근 본 레시피 목록 mock
export const mockDefaultRecipes: CompletedRecipe[] = [
  {
    id: 1,
    userId: 1,
    recipeId: 1,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 2,
    userId: 1,
    recipeId: 2,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 3,
    userId: 1,
    recipeId: 3,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 4,
    userId: 1,
    recipeId: 4,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 5,
    userId: 1,
    recipeId: 5,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 6,
    userId: 1,
    recipeId: 6,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 7,
    userId: 1,
    recipeId: 7,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 8,
    userId: 1,
    recipeId: 8,
    recipeTitle: '새우 땅콩 버거',
    recipeDescription:
      '새우는 단백질이 풍부하고, 포만감을 주어 다이어트에 좋아요.',
    recipeImages: ['/recipeImage.png'],
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
];

// 내가 만든 요리 목록 mock
export const mockCookedRecipes: CompletedRecipe[] = [
  {
    id: 101,
    userId: 1,
    recipeId: 201,
    recipeTitle: '닭가슴살 스테이크',
    recipeDescription: '부드러운 닭가슴살과 특제 소스의 조화',
    recipeImages: ['/recipeImage.png'],
    isCompleted: 1,
    isReviewed: 1,
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 101,
    userId: 1,
    recipeId: 201,
    recipeTitle: '닭가슴살 스테이크',
    recipeDescription: '부드러운 닭가슴살과 특제 소스의 조화',
    recipeImages: ['/recipeImage.png'],
    isCompleted: 1,
    isReviewed: 1,
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 102,
    userId: 1,
    recipeId: 202,
    recipeTitle: '닭가슴살 스테이크',
    recipeDescription: '부드러운 닭가슴살과 특제 소스의 조화',
    recipeImages: ['/recipeImage.png'],
    isCompleted: 1,
    isReviewed: 0,
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 103,
    userId: 1,
    recipeId: 203,
    recipeTitle: '닭가슴살 스테이크',
    recipeDescription: '부드러운 닭가슴살과 특제 소스의 조화',
    recipeImages: ['/recipeImage.png'],
    isCompleted: 1,
    isReviewed: 0,
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 104,
    userId: 1,
    recipeId: 204,
    recipeTitle: '닭가슴살 스테이크',
    recipeDescription: '부드러운 닭가슴살과 특제 소스의 조화',
    recipeImages: ['/recipeImage.png'],
    isCompleted: 1,
    isReviewed: 1,
    createdAt: '2025-08-12T10:00:00Z',
    isBookmarked: true,
  },
];

// 마이페이지 유저 정보 mock
export const mockUser = {
  id: 1,
  email: 'abc@facebook.com',
  nickname: '오리무중체다치즈',
  profileImageUrl: '/mypage/default-profile.png',
  recipeCompleteCount: 0,
  isFirstEntry: true, // 온보딩 미완료 사용자
  role: 'general',
  platform: 'google',
};

// 못 먹는 음식 mock
// Allergy.constants의 ID와 매핑된 못먹는 음식 목록
// 어패류: 1-7, 육류/계란: 8-13, 견과류: 14-18, 곡류: 19-21, 유제품: 22-25, 기타: 26-31
export const mockRestrictions = [
  { id: 2, name: '고등어' }, // 어패류
  { id: 5, name: '굴' }, // 어패류
  { id: 11, name: '계란' }, // 육류/계란
  { id: 14, name: '땅콩' }, // 견과류
  { id: 29, name: '복숭아' }, // 기타
  { id: 22, name: '우유' }, // 유제품
];

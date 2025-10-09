import { NextResponse } from 'next/server';

import type { Recipe } from '@/types/recipe.types';

import type { NextRequest } from 'next/server';

// 임시 레시피 데이터 (실제 구현 시 데이터베이스에서 조회)
const mockRecipes: Recipe[] = [
  {
    cookingSteps: [
      {
        description:
          '김치를 적당한 크기로 자르고, 돼지고기는 한입 크기로 썰어주세요. 두부는 2cm 크기로 썰고, 대파는 어슷하게 썰어주세요.',
        estimatedTime: 5,
        id: 1,
        stepNumber: 1,
        tips: '김치는 너무 작게 자르지 말고 적당한 크기로 자르면 식감이 좋습니다.',
        title: '재료 준비',
      },
      {
        description:
          '팬에 기름을 두르고 돼지고기를 넣어 볶아주세요. 고기가 익을 때까지 중불에서 볶습니다.',
        estimatedTime: 5,
        id: 2,
        stepNumber: 2,
        tips: '고기를 너무 오래 볶으면 질겨질 수 있으니 적당히 볶아주세요.',
        title: '돼지고기 볶기',
      },
      {
        description:
          '볶은 돼지고기에 김치를 넣고 함께 볶아주세요. 김치 국물이 나올 때까지 볶습니다.',
        estimatedTime: 3,
        id: 3,
        stepNumber: 3,
        tips: '김치를 볶을 때는 김치 국물이 나올 때까지 볶아야 맛이 좋습니다.',
        title: '김치 넣기',
      },
      {
        description:
          '물을 넣고 끓인 후 고춧가루를 넣어주세요. 10분 정도 끓인 후 두부를 넣어주세요.',
        estimatedTime: 10,
        id: 4,
        stepNumber: 4,
        tips: '물의 양은 개인 취향에 맞게 조절하세요. 너무 많으면 맛이 연해질 수 있습니다.',
        title: '물 넣고 끓이기',
      },
      {
        description:
          '대파를 넣고 마지막으로 간을 맞춰주세요. 소금과 설탕으로 간을 조절합니다.',
        estimatedTime: 2,
        id: 5,
        stepNumber: 5,
        tips: '대파는 마지막에 넣어야 아삭한 식감을 유지할 수 있습니다.',
        title: '완성',
      },
    ],
    cookingTime: 30,
    description: '맛있는 김치찌개 만들기',
    difficulty: 'easy',
    id: 1,
    imageUrl: '/recipeImage.png',
    ingredients: [
      { amount: '200', id: 1, name: '김치', unit: 'g' },
      { amount: '100', id: 2, name: '돼지고기', unit: 'g' },
      { amount: '1/2', id: 3, name: '두부', unit: '모' },
      { amount: '1', id: 4, name: '대파', unit: '대' },
      { amount: '1', id: 5, name: '고춧가루', unit: '큰술' },
    ],
    servings: 2,
    title: '김치찌개',
  },
  {
    cookingSteps: [
      {
        description:
          '두부는 2cm 크기로 썰고, 애호박은 1cm 두께로 썰어주세요. 양파는 채썰고, 대파는 어슷하게 썰어주세요.',
        estimatedTime: 5,
        id: 6,
        stepNumber: 1,
        title: '재료 준비',
      },
      {
        description:
          '냄비에 물을 넣고 된장을 풀어주세요. 된장이 완전히 풀릴 때까지 저어주세요.',
        estimatedTime: 3,
        id: 7,
        stepNumber: 2,
        title: '된장 풀기',
      },
      {
        description:
          '애호박과 양파를 넣고 끓여주세요. 야채가 익을 때까지 끓입니다.',
        estimatedTime: 8,
        id: 8,
        stepNumber: 3,
        title: '야채 넣기',
      },
      {
        description: '두부를 넣고 3분 정도 더 끓여주세요.',
        estimatedTime: 3,
        id: 9,
        stepNumber: 4,
        title: '두부 넣기',
      },
      {
        description: '대파를 넣고 마지막으로 간을 맞춰주세요.',
        estimatedTime: 1,
        id: 10,
        stepNumber: 5,
        title: '완성',
      },
    ],
    cookingTime: 25,
    description: '구수한 된장찌개 만들기',
    difficulty: 'easy',
    id: 2,
    imageUrl: '/recipeImage.png',
    ingredients: [
      { amount: '2', id: 6, name: '된장', unit: '큰술' },
      { amount: '1/2', id: 7, name: '두부', unit: '모' },
      { amount: '1/4', id: 8, name: '애호박', unit: '개' },
      { amount: '1/2', id: 9, name: '양파', unit: '개' },
      { amount: '1', id: 10, name: '대파', unit: '대' },
    ],
    servings: 2,
    title: '된장찌개',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = parseInt(params.id);

    if (isNaN(recipeId)) {
      return NextResponse.json(
        { message: '유효하지 않은 레시피 ID입니다.', success: false },
        { status: 400 }
      );
    }

    const recipe = mockRecipes.find(r => r.id === recipeId);

    if (!recipe) {
      return NextResponse.json(
        { message: '레시피를 찾을 수 없습니다.', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: recipe,
      success: true,
    });
  } catch (error) {
    console.error('Recipe API error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.', success: false },
      { status: 500 }
    );
  }
}

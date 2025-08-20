import type { UserInfoResponse } from '@recipot/types';

// UserInfoResponse를 확장하여 provider 필드 추가
interface ExtendedUserInfoResponse extends UserInfoResponse {
  data: UserInfoResponse['data'] & {
    provider: 'kakao' | 'google';
  };
}

export const mockUsers: ExtendedUserInfoResponse[] = [
  {
    status: 200,
    data: {
      id: 1,
      email: 'test@test.com',
      nickname: 'test',
      profile_image_url: 'https://test.com/test.png',
      recipe_complete_count: 0,
      is_first_entry: true,
      unavailable_ingredients: [],
      created_at: '2021-01-01',
      updated_at: '2021-01-01',
      provider: 'kakao',
    },
  },
  {
    status: 200,
    data: {
      id: 2,
      email: 'google@test.com',
      nickname: 'google_user',
      profile_image_url: 'https://test.com/google.png',
      recipe_complete_count: 5,
      is_first_entry: false,
      unavailable_ingredients: [
        { id: 1, name: '우유' },
        { id: 2, name: '견과류' },
      ],
      created_at: '2021-02-01',
      updated_at: '2021-02-01',
      provider: 'google',
    },
  },
];

export const mockDietaryRestrictions = [
  { id: 1, name: '우유', category: 'dairy' },
  { id: 2, name: '견과류', category: 'nuts' },
  { id: 3, name: '해산물', category: 'seafood' },
  { id: 4, name: '글루텐', category: 'gluten' },
  { id: 5, name: '달걀', category: 'eggs' },
  { id: 6, name: '대두', category: 'soy' },
];

export const mockHealthStatus = {
  allergies: ['우유', '견과류'],
  dietaryPreferences: ['비건'],
  healthConditions: ['당뇨'],
  medications: ['인슐린'],
};

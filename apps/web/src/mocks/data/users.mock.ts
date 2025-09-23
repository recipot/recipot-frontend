import { UserInfo } from '@recipot/types';

export const mockUsers: UserInfo[] = [
  {
    id: '1',
    name: '김철수',
    email: 'test@kakao.com',
    provider: 'kakao',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
  },
  {
    id: '2',
    name: '이영희',
    email: 'test@google.com',
    provider: 'google',
    createdAt: '2024-02-20T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
  },
  {
    id: '3',
    name: '박요리사',
    email: 'chef@example.com',
    provider: 'kakao',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
  },
];

// 추가 사용자 정보 (확장된 데이터)
export const mockUsersExtended = [
  {
    ...mockUsers[0],
    avatar: 'https://picsum.photos/100/100?random=1',
    cookingLevel: 'intermediate' as const,
    joinDate: new Date('2024-01-15'),
    providerUserId: 'kakao_123456',
  },
  {
    ...mockUsers[1],
    avatar: 'https://picsum.photos/100/100?random=2',
    cookingLevel: 'beginner' as const,
    joinDate: new Date('2024-02-20'),
    providerUserId: 'google_789012',
  },
  {
    ...mockUsers[2],
    avatar: 'https://picsum.photos/100/100?random=3',
    cookingLevel: 'advanced' as const,
    joinDate: new Date('2024-01-01'),
    providerUserId: 'kakao_345678',
  },
];

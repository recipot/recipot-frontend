import { UserInfo } from '@recipot/types';

export const mockUsers: UserInfo[] = [
  {
    id: 1,
    email: 'test@kakao.com',
    nickname: '김철수',
    profileImageUrl: 'https://picsum.photos/100/100?random=1',
    recipeCompleteCount: 15,
    isFirstEntry: false, // 온보딩 완료된 사용자
    role: 'general',
    platform: 'kakao',
  },
  {
    id: 2,
    email: 'test@google.com',
    nickname: '이영희',
    profileImageUrl: 'https://picsum.photos/100/100?random=2',
    recipeCompleteCount: 0,
    isFirstEntry: true, // 온보딩 미완료 사용자
    role: 'general',
    platform: 'google',
  },
  {
    id: 3,
    email: 'appcook2025@gmail.com',
    nickname: '박요리사',
    profileImageUrl: 'https://picsum.photos/100/100?random=3',
    recipeCompleteCount: 42,
    isFirstEntry: false, // 온보딩 완료된 사용자
    role: 'general',
    platform: 'kakao',
  },
];

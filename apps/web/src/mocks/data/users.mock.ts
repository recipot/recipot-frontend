export const mockUsers = [
  {
    avatar: 'https://picsum.photos/100/100?random=1',
    cookingLevel: 'intermediate' as const,
    email: 'test@kakao.com',
    id: '1',
    joinDate: new Date('2024-01-15'),
    name: '김철수',
    provider: 'kakao' as const,
    providerUserId: 'kakao_123456',
  },
  {
    avatar: 'https://picsum.photos/100/100?random=2', 
    cookingLevel: 'beginner' as const,
    email: 'test@google.com',
    id: '2',
    joinDate: new Date('2024-02-20'),
    name: '이영희',
    provider: 'google' as const,
    providerUserId: 'google_789012',
  },
  {
    avatar: 'https://picsum.photos/100/100?random=3',
    cookingLevel: 'advanced' as const, 
    email: 'chef@example.com',
    id: '3',
    joinDate: new Date('2024-01-01'),
    name: '박요리사',
    provider: 'kakao' as const,
    providerUserId: 'kakao_345678',
  }
];

export const mockDietaryRestrictions = [
  { category: 'allergy' as const, id: '1', name: '견과류' },
  { category: 'allergy' as const, id: '2', name: '갑각류' },
  { category: 'allergy' as const, id: '3', name: '유제품' },
  { category: 'religion' as const, id: '4', name: '돼지고기' },
  { category: 'religion' as const, id: '5', name: '소고기' },
  { category: 'preference' as const, id: '6', name: '매운음식' },
  { category: 'preference' as const, id: '7', name: '생선' },
];

export const mockHealthStatus = {
  additionalInfo: '',
  breastfeeding: false,
  diet: 'normal' as const, // 'normal' | 'diet' | 'bulk'
  pregnancy: false,
};
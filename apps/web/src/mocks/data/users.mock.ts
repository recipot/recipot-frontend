export const mockUsers = [
  {
    id: '1',
    email: 'test@kakao.com',
    name: '김철수',
    avatar: 'https://picsum.photos/100/100?random=1',
    provider: 'kakao' as const,
    providerUserId: 'kakao_123456',
    joinDate: new Date('2024-01-15'),
    cookingLevel: 'intermediate' as const,
  },
  {
    id: '2', 
    email: 'test@google.com',
    name: '이영희',
    avatar: 'https://picsum.photos/100/100?random=2',
    provider: 'google' as const,
    providerUserId: 'google_789012',
    joinDate: new Date('2024-02-20'),
    cookingLevel: 'beginner' as const,
  },
  {
    id: '3',
    email: 'chef@example.com', 
    name: '박요리사',
    avatar: 'https://picsum.photos/100/100?random=3',
    provider: 'kakao' as const,
    providerUserId: 'kakao_345678',
    joinDate: new Date('2024-01-01'),
    cookingLevel: 'advanced' as const,
  }
];

export const mockDietaryRestrictions = [
  { id: '1', name: '견과류', category: 'allergy' as const },
  { id: '2', name: '갑각류', category: 'allergy' as const },
  { id: '3', name: '유제품', category: 'allergy' as const },
  { id: '4', name: '돼지고기', category: 'religion' as const },
  { id: '5', name: '소고기', category: 'religion' as const },
  { id: '6', name: '매운음식', category: 'preference' as const },
  { id: '7', name: '생선', category: 'preference' as const },
];

export const mockHealthStatus = {
  pregnancy: false,
  breastfeeding: false,
  diet: 'normal' as const, // 'normal' | 'diet' | 'bulk'
  additionalInfo: '',
};
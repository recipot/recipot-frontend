// 랜덤 ID 생성
export const generateId = (prefix: string = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 랜덤 날짜 생성
export const generateRandomDate = (daysFromNow: number = 7) => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysFromNow);
  return new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);
};

// 랜덤 사용자 데이터 생성
export const generateMockUser = (overrides: any = {}) => {
  return {
    avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000)}`,
    cookingLevel: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
    email: `test${Date.now()}@example.com`,
    id: generateId('user_'),
    joinDate: generateRandomDate(-30), // 30일 전부터
    name: `테스트유저${Math.floor(Math.random() * 1000)}`,
    provider: Math.random() > 0.5 ? 'kakao' : 'google',
    ...overrides,
  };
};

// 랜덤 재료 데이터 생성
export const generateMockIngredient = (overrides: any = {}) => {
  const names = ['김치', '돼지고기', '두부', '양파', '마늘', '대파', '당근', '감자'];
  const categories = ['채소류', '육류', '콩류', '곡류'];
  const units = ['g', 'kg', '개', '컵', 'ml'];
  
  return {
    category: categories[Math.floor(Math.random() * categories.length)],
    expiryDate: generateRandomDate(14), // 2주 내
    id: generateId('ingredient_'),
    image: `https://picsum.photos/150/150?random=${Math.floor(Math.random() * 1000)}`,
    name: names[Math.floor(Math.random() * names.length)],
    quantity: Math.floor(Math.random() * 500) + 50,
    unit: units[Math.floor(Math.random() * units.length)],
    ...overrides,
  };
};

// 응답 지연 시뮬레이션 (네트워크 상황별)
export const getNetworkDelay = (type: 'fast' | 'normal' | 'slow' = 'normal') => {
  const delays = {
    fast: Math.random() * 200 + 100,    // 100-300ms
    normal: Math.random() * 500 + 300,  // 300-800ms  
    slow: Math.random() * 2000 + 1000,  // 1-3초
  };
  return Math.floor(delays[type]);
};

// 에러 응답 생성기
export const createErrorResponse = (message: string, code?: string, status: number = 400) => {
  return {
    code: code || 'BAD_REQUEST',
    error: message,
    path: 'mock-api',
    timestamp: new Date().toISOString(),
  };
};

// 성공 응답 생성기
export const createSuccessResponse = (data: any, message?: string) => {
  return {
    data,
    message: message || 'Success',
    success: true,
    timestamp: new Date().toISOString(),
  };
};

// Mock 데이터 검증기
export const validateMockData = (data: any, requiredFields: string[]) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  return true;
};

// 페이지네이션 헬퍼
export const paginateData = (data: any[], page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      hasNext: endIndex < data.length,
      hasPrev: page > 1,
      limit,
      page,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};

// 검색 헬퍼
export const searchData = (data: any[], query: string, searchFields: string[]) => {
  if (!query) return data;
  
  return data.filter(item =>
    searchFields.some(field => 
      item[field]?.toString().toLowerCase().includes(query.toLowerCase())
    )
  );
};
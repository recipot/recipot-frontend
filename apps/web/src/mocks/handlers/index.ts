import { authHandlers } from './auth.handlers';
import { allergyCheckHandlers } from './allergyCheck.handlers';
import { foodHandlers } from './food.handlers';

import { moodHandlers } from './mood.handlers';
import { recipeRecommendHandlers } from './recipeRecommend.handlers';
import { mypageHandlers } from './mypage.handlers';
// 추후 다른 도메인 핸들러들을 추가할 예정
// import { ingredientHandlers } from './ingredient.handlers';
// import { recipeHandlers } from './recipe.handlers';
// import { profileHandlers } from './profile.handlers';

export const handlers = [
  ...authHandlers,
  ...allergyCheckHandlers, // 알고리즘 체크 핸들러 추가
  ...foodHandlers, // 재료 관련 핸들러 추가
  ...moodHandlers, // 기분 상태 관련 핸들러 추가
  ...recipeRecommendHandlers, // 레시피 추천 핸들러 추가
  ...mypageHandlers,
  // ...ingredientHandlers,    // B 담당자가 완성 후 추가
  // ...recipeHandlers,        // C 담당자가 완성 후 추가
  // ...profileHandlers,       // D 담당자가 완성 후 추가
];

// 도메인별로 핸들러를 분리해서 export (디버깅용)
export { authHandlers };
export { allergyCheckHandlers };
export { foodHandlers };
export { moodHandlers };
export { recipeRecommendHandlers };
export { mypageHandlers };
// export { ingredientHandlers };
// export { recipeHandlers };
// export { profileHandlers };

// 핸들러 개수 확인용 (개발 시 유용)
export const handlerCounts = {
  auth: authHandlers.length,
  allergyCheck: allergyCheckHandlers.length,
  food: foodHandlers.length,
  mood: moodHandlers.length,
  mypage: mypageHandlers.length,
  // ingredient: ingredientHandlers.length,
  // recipe: recipeHandlers.length,
  // profile: profileHandlers.length,
  total: handlers.length,
};

// MSW 상태 확인용 헬퍼
export const getMswStatus = () => {
  return {
    domains: [
      'auth',
      'allergyCheck',
      'food',
      'mood',
      'recipeRecommend',
      'mypage',
    ], // 완성된 도메인들
    handlersCount: handlers.length,
    isEnabled: process.env.NODE_ENV === 'development',
    // domains: ['auth', 'allergyCheck', 'food', 'mood', 'ingredient', 'recipe', 'profile'], // 모든 도메인 완성 후
  };
};

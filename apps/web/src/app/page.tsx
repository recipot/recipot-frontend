'use client';

import FoodAdd from '@/components/FoodAdd/FoodAdd';

export default function Home() {
  const handleFoodSubmit = (selectedFoods: number[]) => {
    // eslint-disable-next-line no-console -- 개발용 로그
    console.log('선택된 재료 ID 목록:', selectedFoods);

    // TODO: 서버로 POST 요청 보내기
    // - API 엔드포인트: /api/ingredients/recommend
    // - 요청 데이터: { ingredientIds: selectedFoods }
    // - 응답 처리: 추천 요리 데이터 받아서 상태 업데이트 또는 페이지 이동
    // 예시:
    // try {
    //   const response = await fetch('/api/ingredients/recommend', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ ingredientIds: selectedFoods })
    //   });
    //   const recommendedRecipes = await response.json();
    //   // 추천 요리 페이지로 이동 또는 상태 업데이트
    // } catch (error) {
    //   console.error('추천 요리 요청 실패:', error);
    // }
  };

  return <FoodAdd onSubmit={handleFoodSubmit} />;
}

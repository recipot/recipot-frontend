'use client';

import IngredientsSearch from '@/components/IngredientsSearch/IngredientsSearch';

export default function RefrigeratorPage() {
  const handleSubmissionSuccess = () => {
    // eslint-disable-next-line no-console -- 개발용 로그
    console.log('재료 선택이 완료되었습니다. 레시피 추천 페이지로 이동합니다.');

    // TODO: 레시피 추천 페이지로 이동
    // - 추천 요리 페이지로 라우팅
    // - 또는 모달로 추천 결과 표시
    // 예시:
    // router.push('/recipes/recommendations');
    // 또는
    // setShowRecommendations(true);
  };

  return <IngredientsSearch onSubmissionSuccess={handleSubmissionSuccess} />;
}

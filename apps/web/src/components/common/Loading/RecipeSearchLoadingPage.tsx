import React from 'react';

import LoadingPage from './LoadingPage';

interface RecipeSearchLoadingPageProps {
  /** 사용자 이름 */
  userName?: string;
}

/**
 * 레시피 검색용 로딩 페이지
 *
 * @example
 * <RecipeSearchLoadingPage userName="홍길동" />
 */
const RecipeSearchLoadingPage = ({
  userName = '사용자',
}: RecipeSearchLoadingPageProps) => {
  return (
    <LoadingPage>
      {userName}님의 <br />
      지금 바로 해먹을 수 있는 요리를
      <br /> 찾고 있어요
    </LoadingPage>
  );
};

export default RecipeSearchLoadingPage;

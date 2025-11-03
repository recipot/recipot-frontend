'use client';

import React from 'react';

import RecipeHeader from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeHeader';
import { Header } from '@/components/common/Header';
import { ExploreComplete } from '@/components/ExploreComplete';

export default function ExploreCompletePage() {
  return (
    <>
      <RecipeHeader onRefresh={() => {}} />
      <Header.Spacer />
      <ExploreComplete />
    </>
  );
}

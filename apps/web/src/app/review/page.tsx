'use client';

import { ReviewBottomSheet } from '@/components/review';
import React, { useState } from 'react';

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    // 컴포넌트 확인용도
    <ReviewBottomSheet
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={() => setIsOpen(false)}
      reviewData={{
        completionCount: 1,
        recipeId: '1',
        recipeImage: '/recipeImage.png',
        recipeName: 'test',
      }}
    />
  );
};

export default Home;

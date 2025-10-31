'use client';

import React, { useState } from 'react';

import { ReviewBottomSheet } from '@/components/review';

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ReviewBottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      recipeId={completedRecipeId}
    />
  );
};

export default function ReviewPage() {
  return (
    <Suspense fallback={null}>
      <ReviewContent />
    </Suspense>
  );
}

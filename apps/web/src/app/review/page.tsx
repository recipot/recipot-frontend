'use client';

import React, { useState } from 'react';

import { ReviewBottomSheet } from '@/components/review';

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    // 컴포넌트 확인용도
    <ReviewBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
};

export default Home;

'use client';

import { allergyPost } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

import { AlgorithCheck } from '@/components/Algorith';
import type { AlgorithFormSchema } from '@/components/Algorith/Algorith.constants';

import type { z } from 'zod';

export default function Home() {
  const { mutate } = useMutation({
    mutationFn: allergyPost,
  });

  const handleSubmit = (data: z.infer<typeof AlgorithFormSchema>) => {
    // mutation을 직접 호출
    mutate({ categories: data.items });
  };

  return (
    <div>
      <AlgorithCheck onSubmit={handleSubmit} />
    </div>
  );
}

'use client';

import { allergyPost } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

import { AllergyCheck } from '@/components/Allergy';
import type { AllergyFormSchema } from '@/components/Allergy/Allergy.constants';

import type { z } from 'zod';

export default function Home() {
  const { mutate } = useMutation({
    mutationFn: allergyPost,
  });

  const handleSubmit = (data: z.infer<typeof AllergyFormSchema>) => {
    // mutation을 직접 호출
    mutate({ categories: data.items });
  };

  return (
    <div>
      <AllergyCheck onSubmit={handleSubmit} />
    </div>
  );
}

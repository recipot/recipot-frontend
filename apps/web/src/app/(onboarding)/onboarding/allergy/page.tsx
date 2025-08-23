'use client';

import { allergyPost } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

import { AllergyCheckContainer } from '@/components/Allergy';

export default function AllergyPage() {
  const allergyMutation = useMutation({
    mutationFn: allergyPost,
    onError: error => {
      console.error('API 호출 실패:', error);
    },
    onSuccess: data => {
      console.log('API 호출 성공:', data);
    },
  });

  const handleSubmit = (data: { items: number[] }) => {
    allergyMutation.mutate({ categories: data.items });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <AllergyCheckContainer onSubmit={handleSubmit} />
    </div>
  );
}

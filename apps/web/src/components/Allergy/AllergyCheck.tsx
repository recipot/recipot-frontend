'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { categories } from './Allergy.constants';
import AllergyCheckItem from './AllergyCheckItem';

import type { AllergyFormSchema } from './Allergy.constants';
import type { z } from 'zod';

/**
 * AllergyCheck
 * @param onSubmit - onSubmit function
 * @returns AllergyCheck component
 */
export default function AllergyCheck({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof AllergyFormSchema>) => void;
}) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemToggle = (itemId: number) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 선택된 항목들을 ID 순서대로 정렬하여 전송
    const sortedItems = [...selectedItems].sort((a, b) => a - b);
    onSubmit({ items: sortedItems });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {categories.map(category => (
        <AllergyCheckItem
          key={category.title}
          items={category.items}
          label={category.title}
          selectedItems={selectedItems}
          onItemToggle={handleItemToggle}
        />
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );
}

'use client';

import { Button } from '@/components/ui/button';

import { categories } from './Allergy.constants';
import AllergyCheckItem from './AllergyCheckItem';

/**
 * AllergyCheckPresenter
 * @param selectedItems - number[]
 * @param onItemToggle - (itemId: number) => void
 * @param onSubmit - (e: React.FormEvent) => void
 * @returns AllergyCheckPresenter component
 */
export default function AllergyCheckPresenter({
  onItemToggle,
  onSubmit,
  selectedItems,
}: {
  selectedItems: number[];
  onItemToggle: (itemId: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-8">
      {categories.map(category => (
        <AllergyCheckItem
          key={category.title}
          items={category.items}
          label={category.title}
          selectedItems={selectedItems}
          onItemToggle={onItemToggle}
        />
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );
}

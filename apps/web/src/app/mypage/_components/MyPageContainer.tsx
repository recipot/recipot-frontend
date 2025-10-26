'use client';

import { useMemo } from 'react';
import { useAuth } from '@recipot/contexts';

import { MyPagePresenter } from '@/app/mypage/_components/MyPagePresenter';
import { useAllergyData } from '@/components/Allergy';
import { mockCookedRecipes, mockRestrictions, mockUser } from '@/mocks/data/myPage.mock';
import { useAllergyStepData } from '@/stores/onboardingStore';

export function MyPageContainer() {
  const { user } = useAuth();
  const allergyStepData = useAllergyStepData();
  const { categories } = useAllergyData();

  const restrictions = useMemo(() => {
    if (allergyStepData?.allergies !== undefined) {
      const selectedIds = allergyStepData.allergies;

      if (selectedIds.length === 0) {
        return [];
      }

      const allItems = categories.flatMap(category => category.items);

      return selectedIds
        .map((id: number) => {
          const item = allItems.find(item => item.id === id);
          return item ? { id: item.id, name: item.label } : null;
        })
        .filter((item): item is { id: number; name: string } => item !== null);
    }

    return mockRestrictions;
  }, [allergyStepData, categories]);

  return (
    <MyPagePresenter
      user={user ?? mockUser}
      restrictions={restrictions}
      cookedRecipes={mockCookedRecipes}
    />
  );
}

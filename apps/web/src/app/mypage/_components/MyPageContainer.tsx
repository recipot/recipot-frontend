'use client';

import { useMemo } from 'react';

import { MyPagePresenter } from '@/app/mypage/_components/MyPagePresenter';
import { categories } from '@/components/Allergy/Allergy.constants';
import {
  mockCookedRecipes,
  mockRestrictions,
  mockUser,
} from '@/mocks/data/myPage.mock';
import { useAllergyStepData } from '@/stores/onboardingStore';

export function MyPageContainer() {
  // 온보딩에서 저장된 알레르기 데이터 가져오기
  const allergyStepData = useAllergyStepData();

  // 온보딩 데이터를 DietaryRestriction 형식으로 변환
  const restrictions = useMemo(() => {
    if (allergyStepData?.allergies && allergyStepData.allergies.length > 0) {
      // 온보딩에서 선택한 알레르기 ID를 이름으로 변환
      const selectedIds = allergyStepData.allergies;
      const allItems = categories.flatMap(category => category.items);

      return selectedIds
        .map(id => {
          const item = allItems.find(item => item.id === id);
          return item ? { id: item.id, name: item.label } : null;
        })
        .filter((item): item is { id: number; name: string } => item !== null);
    }

    // 온보딩 데이터가 없으면 mock 데이터 사용
    return mockRestrictions;
  }, [allergyStepData]);

  return (
    <MyPagePresenter
      user={mockUser}
      restrictions={restrictions}
      cookedRecipes={mockCookedRecipes}
    />
  );
}

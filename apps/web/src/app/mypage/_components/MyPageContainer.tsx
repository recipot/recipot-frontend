'use client';

import { useMemo } from 'react';
import { useAuth } from '@recipot/contexts';

import { MyPagePresenter } from '@/app/mypage/_components/MyPagePresenter';
import { useAllergyData } from '@/components/Allergy';
import {
  mockCookedRecipes,
  mockRestrictions,
  mockUser,
} from '@/mocks/data/myPage.mock';
import { useAllergyStepData } from '@/stores/onboardingStore';

export function MyPageContainer() {
  // 인증된 유저 정보 가져오기
  const { user } = useAuth();

  // 온보딩에서 저장된 알레르기 데이터 가져오기
  const allergyStepData = useAllergyStepData();

  // 백엔드에서 재료 데이터 가져오기
  const { categories } = useAllergyData();

  // 온보딩 데이터를 DietaryRestriction 형식으로 변환
  const restrictions = useMemo(() => {
    // 온보딩 데이터가 있으면 해당 데이터 사용 (빈 배열도 포함)
    if (allergyStepData?.allergies !== undefined) {
      const selectedIds = allergyStepData.allergies;

      // 빈 배열이면 빈 배열 반환 (못먹는 음식이 없음)
      if (selectedIds.length === 0) {
        return [];
      }

      // 알레르기 ID를 이름으로 변환
      const allItems = categories.flatMap(category => category.items);

      return selectedIds
        .map((id: number) => {
          const item = allItems.find(item => item.id === id);
          return item ? { id: item.id, name: item.label } : null;
        })
        .filter((item): item is { id: number; name: string } => item !== null);
    }

    // 온보딩을 아직 하지 않았을 때만 mock 데이터 사용
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

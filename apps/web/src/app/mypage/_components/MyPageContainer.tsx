'use client';

import { useEffect, useMemo } from 'react';
import { useAuth } from '@recipot/contexts';

import { MyPagePresenter } from '@/app/mypage/_components/MyPagePresenter';
import { useAllergyData } from '@/components/Allergy';
import { useIsLoggedIn } from '@/hooks';
import { useCompletedRecipes } from '@/hooks/useCompletedRecipes';
import { mockRestrictions } from '@/mocks/data/myPage.mock';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

export function MyPageContainer() {
  const { user } = useAuth();
  const isLoggedIn = useIsLoggedIn();
  const openLoginModal = useLoginModalStore(state => state.openModal);

  // 게스트 상태일 때 로그인 모달 표시
  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
    }
  }, [isLoggedIn, openLoginModal]);

  // 완료한 요리 데이터
  const { data: completedRecipesData, isLoading: isLoadingRecipes } =
    useCompletedRecipes({ limit: 10, page: 1 });

  // 온보딩에서 저장된 알레르기 데이터 가져오기
  const allergyStepData = useAllergiesStore();
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

  const cookedRecipes = completedRecipesData?.items ?? [];

  // 로딩 중(TODO: 별도 스피너나 스켈있는지)
  if (isLoadingRecipes) {
    return <div>로딩 중...</div>;
  }

  return (
    <MyPagePresenter
      user={user ?? null}
      restrictions={restrictions}
      cookedRecipes={cookedRecipes}
      isGuest={!isLoggedIn}
    />
  );
}

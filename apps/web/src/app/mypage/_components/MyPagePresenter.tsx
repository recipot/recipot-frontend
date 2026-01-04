'use client';

import { useState } from 'react';

import { PageHeader } from '@/app/mypage/_components/PageHeader';
import { useAllergiesStore } from '@/stores/allergiesStore';
import type { DietaryRestriction, User } from '@/types/MyPage.types';

import DietaryRestrictions from './DietaryRestrictions';
import DietaryRestrictionsSheet from './DietaryRestrictionsSheet';
import InfoLinks from './InfoLinks';
import MyRecipesLink from './MyRecipesLink';
import QuickLinks from './QuickLinks';
import UserProfile from './UserProfile';

import type { CompletedRecipe } from '@recipot/api';

interface MyPagePresenterProps {
  user: User | null;
  restrictions: DietaryRestriction[];
  cookedRecipes: CompletedRecipe[];
  isGuest?: boolean;
}

export function MyPagePresenter({
  cookedRecipes,
  isGuest = false,
  restrictions,
  user,
}: MyPagePresenterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const setAllergies = useAllergiesStore(state => state.setAllergies);
  const setSelectedItems = useAllergiesStore(state => state.setSelectedItems);

  const handleOpenSheet = () => setIsSheetOpen(true);
  const handleCloseSheet = () => setIsSheetOpen(false);

  // restrictions의 id를 초기 선택 항목으로 변환
  const initialSelectedItems = restrictions.map(item => item.id);

  const handleSave = (selectedItems: number[]) => {
    // TODO: API 연동하여 서버에 저장
    console.info('선택된 못먹는 음식 ID:', selectedItems);

    // 알러지 스토어 업데이트 (로컬 상태 관리)
    setAllergies(selectedItems);
    setSelectedItems(selectedItems);

    console.info('✅ 못먹는 음식이 업데이트되었습니다.');
    // 서버 응답 후 restrictions 상태를 업데이트해야 함
  };

  return (
    <div>
      <div className="px-5">
        <PageHeader title="마이페이지" />
      </div>
      <main className="px-5">
        <UserProfile user={user} isGuest={isGuest} />
        <QuickLinks />
        <MyRecipesLink cookedRecipes={cookedRecipes} />
        <DietaryRestrictions
          restrictions={restrictions}
          onOpenSheet={handleOpenSheet}
        />
      </main>

      <footer>
        <div className="h-2 bg-gray-50" />
        <div className="px-5">
          <InfoLinks />
        </div>
      </footer>

      <DietaryRestrictionsSheet
        initialSelectedItems={initialSelectedItems}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        onSave={handleSave}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';

import { PageHeader } from '@/app/mypage/_components/PageHeader';
import type {
  CookedRecipe,
  DietaryRestriction,
  User,
} from '@/types/MyPage.types';

import DietaryRestrictions from './DietaryRestrictions';
import DietaryRestrictionsSheet from './DietaryRestrictionsSheet';
import InfoLinks from './InfoLinks';
import MyRecipesLink from './MyRecipesLink';
import QuickLinks from './QuickLinks';
import UserProfile from './UserProfile';

interface MyPagePresenterProps {
  user: User | null;
  restrictions: DietaryRestriction[];
  cookedRecipes: CookedRecipe[];
}

export function MyPagePresenter({
  cookedRecipes,
  restrictions,
  user,
}: MyPagePresenterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenSheet = () => setIsSheetOpen(true);
  const handleCloseSheet = () => setIsSheetOpen(false);

  // restrictions의 id를 초기 선택 항목으로 변환
  const initialSelectedItems = restrictions.map(item => item.id);

  const handleSave = (selectedItems: number[]) => {
    // TODO: API 연동하여 서버에 저장
    console.info('선택된 못먹는 음식 ID:', selectedItems);
    // 서버 응답 후 restrictions 상태를 업데이트해야 함
  };

  return (
    <div>
      <div className="px-5">
        <PageHeader title="마이페이지" />
      </div>
      <main className="px-5">
        <UserProfile user={user} />
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

'use client';

import { MyPagePresenter } from '@/app/mypage/_components/MyPagePresenter';
import {
  mockCookedRecipes,
  mockRestrictions,
  mockUser,
} from '@/mocks/data/myPage.mock';

export function MyPageContainer() {
  return (
    <MyPagePresenter
      user={mockUser}
      restrictions={mockRestrictions}
      cookedRecipes={mockCookedRecipes}
    />
  );
}

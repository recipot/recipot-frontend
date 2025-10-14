import { PageHeader } from '@/app/mypage/_components/PageHeader';
import type {
  CookedRecipe,
  DietaryRestriction,
  User,
} from '@/types/MyPage.types';

import DietaryRestrictions from './DietaryRestrictions';
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
  return (
    <div>
      <div className="px-5">
        <PageHeader title="마이페이지" />
      </div>
      <main className="px-5">
        <UserProfile user={user} />
        <QuickLinks />
        <MyRecipesLink cookedRecipes={cookedRecipes} />
        <DietaryRestrictions restrictions={restrictions} />
      </main>

      <footer>
        <div className="h-2 bg-gray-50" />
        <div className="px-5">
          <InfoLinks />
        </div>
      </footer>
    </div>
  );
}

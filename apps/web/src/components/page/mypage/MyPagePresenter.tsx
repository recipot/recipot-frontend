import { PageHeader } from '@/components/page/mypage/PageHeader';

import DietaryRestrictions from './components/DietaryRestrictions';
import InfoLinks from './components/InfoLinks';
import MyRecipesLink from './components/MyRecipesLink';
import QuickLinks from './components/QuickLinks';
import UserProfile from './components/UserProfile';

export function MyPagePresenter() {
  return (
    <div>
      <div className="px-5">
        <PageHeader title="마이페이지" />
      </div>
      <main className="px-5">
        <UserProfile />
        <QuickLinks />
        <MyRecipesLink />
        <DietaryRestrictions />
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

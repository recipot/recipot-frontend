import { PageHeader } from '@/app/mypage/_components/PageHeader';

import DietaryRestrictions from './DietaryRestrictions';
import InfoLinks from './InfoLinks';
import MyRecipesLink from './MyRecipesLink';
import QuickLinks from './QuickLinks';
import UserProfile from './UserProfile';

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

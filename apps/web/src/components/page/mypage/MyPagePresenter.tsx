import { DietaryRestrictions } from '@/components/page/mypage/components/DietaryRestrictions';
import { InfoLinks } from '@/components/page/mypage/components/InfoLinks';
import { MyRecipesLink } from '@/components/page/mypage/components/MyRecipesLink';
import { QuickLinks } from '@/components/page/mypage/components/QuickLinks';
import { UserProfile } from '@/components/page/mypage/components/UserProfile';
import { PageHeader } from '@/components/page/mypage/PageHeader';

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

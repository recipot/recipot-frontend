import { DietaryRestrictions } from '@/components/page/mypage/components/DietaryRestrictions';
import { InfoLinks } from '@/components/page/mypage/components/InfoLinks';
import { MyRecipesLink } from '@/components/page/mypage/components/MyRecipesLink';
import { QuickLinks } from '@/components/page/mypage/components/QuickLinks';
import { UserProfile } from '@/components/page/mypage/components/UserProfile';
import { PageHeader } from '@/components/page/mypage/PageHeader';

export const MyPagePresenter = ({ onGoBack }) => {
  return (
    <div>
      <PageHeader />

      <main>
        <UserProfile />
        <QuickLinks />
        <MyRecipesLink />
        <DietaryRestrictions />
      </main>

      <footer>
        <InfoLinks />
      </footer>
    </div>
  );
};

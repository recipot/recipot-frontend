import Link from 'next/link';

import type { CompletedRecipe } from '@/api/mypageAPI';
import { Button } from '@/components/common/Button';
import { ArrowIcon, CookIcon } from '@/components/Icons';

export default function MyRecipesLink({
  cookedRecipes,
}: {
  cookedRecipes: CompletedRecipe[];
}) {
  return (
    <Link href="/mypage/recipes/cooked">
      <Button
        shape="square"
        className="mb-[1.875rem] flex h-[4.313rem] w-full items-center justify-between rounded-[0.875rem] bg-[#F4FCE3] py-[1.5625rem] pr-5 pl-7"
      >
        <div className="flex items-center gap-1.5">
          <CookIcon size={18} />
          <span className="text-16 leading-[100%] font-medium text-[#66A80F]">
            내가 만든 요리
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-28 text-[#66A80F]">{cookedRecipes.length}</span>
          <ArrowIcon size={18} color="hsl(var(--brand-primary))" />
        </div>
      </Button>
    </Link>
  );
}

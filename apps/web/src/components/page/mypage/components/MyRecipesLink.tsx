import { Button } from '@/components/common/Button';
import { ArrowIcon, CookIcon } from '@/components/Icons';

export function MyRecipesLink() {
  return (
    <Button
      shape="square"
      className="mb-[30px] flex h-[69px] w-full items-center justify-between rounded-lg bg-[#F4FCE3] py-6 pr-5 pl-7"
    >
      <div className="flex items-center gap-1.5">
        <CookIcon className="h-5 w-5" />
        <span className="text-16 text-[#66A80F]">내가 만든 요리</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-28 text-[#66A80F]">0</span>
        <ArrowIcon size={18} color="hsl(var(--brand-primary))" />
      </div>
    </Button>
  );
}

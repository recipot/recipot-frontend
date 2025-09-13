import { Button } from '@/components/common/Button';
import { AddIcon } from '@/components/Icons';

export function DietaryRestrictions() {
  return (
    <div className="mb-10 flex flex-col gap-5">
      <span className="text-17sb">못먹는 음식</span>
      <Button
        shape="square"
        className="flex h-[69px] items-center gap-1 bg-gray-100 py-[25px] active:bg-[#E9ECEF]"
      >
        <AddIcon size={18} color="hsl(var(--gray-600))" />
        <span className="text-16 text-gray-600">못먹는 음식이 있나요?</span>
      </Button>
    </div>
  );
}

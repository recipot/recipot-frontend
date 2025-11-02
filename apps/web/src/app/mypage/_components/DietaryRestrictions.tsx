import { Button } from '@/components/common/Button';
import { AddIcon } from '@/components/Icons';
import type { DietaryRestriction } from '@/types/MyPage.types';

export default function DietaryRestrictions({
  onOpenSheet,
  restrictions,
}: {
  restrictions: DietaryRestriction[];
  onOpenSheet: () => void;
}) {
  const hasRestrictions = restrictions.length > 0;

  return (
    <div className="mb-10 flex flex-col gap-5">
      <span className="text-17sb">
        못먹는 음식{hasRestrictions && ` ${restrictions.length}개`}
      </span>

      {hasRestrictions ? (
        <div className="relative">
          <div className="no-scrollbar flex items-start gap-3 overflow-x-auto pr-20">
            {restrictions.map(item => (
              <div
                key={item.id}
                className="flex flex-shrink-0 flex-col items-center"
              >
                <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gray-100">
                  <span className="text-14b text-gray-900">{item.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-0 right-0 z-10 flex h-full items-center">
            <div className="flex flex-col items-center gap-[0.875rem]">
              <Button
                shape="round"
                className="bg-primary-subGreen flex h-12 w-12 items-center justify-center p-0"
                size="md"
                onClick={onOpenSheet}
              >
                <AddIcon size={22} color="white" />
              </Button>
              <span className="text-16 text-primary-subGreen leading-[100%]">
                변경
              </span>
            </div>
          </div>

          <div className="from-background via-background/80 pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l to-transparent" />
        </div>
      ) : (
        <Button
          shape="square"
          className="flex h-[4.313rem] items-center gap-1 rounded-[0.875rem] bg-gray-100 py-[1.563rem] active:bg-gray-200"
          onClick={onOpenSheet}
        >
          <AddIcon size={18} />
          <p className="text-16 text-gray-600">
            어떤 재료를 추천에서 빼드릴까요?
          </p>
        </Button>
      )}
    </div>
  );
}

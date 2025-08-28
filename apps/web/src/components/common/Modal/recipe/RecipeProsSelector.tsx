import { EmotionGoodIcon } from '@/components/Icons';
import { Checkbox } from '@/components/ui/checkbox';

interface ProsSectionProps {
  pros: string[];
  onTogglePro: (text: string) => void;
}

const PROS_OPTIONS = [
  '간단해서 빨리 만들 수 있어요',
  '재료가 집에 있는 걸로 충분해요',
  '맛 균형이 좋아요',
  '다음에도 또 해먹고 싶어요',
  '아이도 잘 먹어요',
] as const;

export function RecipeProsSelector({ onTogglePro, pros }: ProsSectionProps) {
  return (
    <div className="w-full">
      <div className="flex justify-center items-center mb-4 rounded-2xl bg-[#FFE2E2] py-3 text-center text-[#D25D5D] font-semibold">
        <EmotionGoodIcon className="mr-1" />
        <span>또 해먹을래요</span>
      </div>

      <p className="mb-3 text-body17 font-semibold text-center">
        어떤점이 좋았나요?
      </p>

      <ul className="flex flex-col gap-2">
        {PROS_OPTIONS.map(text => {
          const isSelected = pros.includes(text);
          return (
            <li key={text}>
              <label
                htmlFor={text}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2"
              >
                <Checkbox
                  id={text}
                  checked={isSelected}
                  onCheckedChange={() => onTogglePro(text)}
                />
                <span className="text-16 text-left">{text}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import React from 'react';

import { EmotionGoodIcon } from '@/components/Icons';
import { cn } from '@/lib/utils';

import CheckboxIcon from './CheckboxIcon';

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
  const handleKeyDown = (e: React.KeyboardEvent, text: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTogglePro(text);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-feel-back-free text-feel-free-text text-15sb mt-5 mb-6 flex items-center justify-center rounded-2xl py-5 text-center">
        <EmotionGoodIcon className="mr-1" />
        <span>또 해먹을래요</span>
      </div>

      <p className="text-22 mb-3 text-center">어떤점이 좋았나요?</p>

      <ul className="flex flex-col gap-2">
        {PROS_OPTIONS.map(text => {
          const isSelected = pros.includes(text);
          const id = `pros-${text.replace(/\s+/g, '-').toLowerCase()}`;

          return (
            <li key={id}>
              <div
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={e => handleKeyDown(e, text)}
                onClick={() => onTogglePro(text)}
                className={cn(
                  'group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2'
                )}
              >
                <CheckboxIcon isSelected={isSelected} />
                <span className="text-16 text-left">{text}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

import { Button } from '@/components/common/Button';
import { CloseIcon, RefreshIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useScrollGradient } from '@/hooks/useScrollGradient';

// TODO: api 연동 후 삭제
const DIETARY_CATEGORIES = [
  { key: 'seafood', name: '해산물류' },
  { key: 'meat_dairy', name: '육류 및 유제품' },
  { key: 'nuts_grains', name: '견과류 및 곡류' },
  { key: 'fish', name: '견과류 및 곡류' },
  { key: 'shell', name: '견과류 및 곡류' },
];

// TODO: api 연동 후 삭제
const DIETARY_ITEMS = {
  fish: ['어류', '게', '새우', '오징어', '조개류'],
  meat_dairy: ['돼지', '닭', '소', '유제품'],
  nuts_grains: ['땅콩', '호두', '잣'],
  seafood: ['어류', '게', '새우', '오징어', '조개류'],
  shell: ['어류', '게', '새우', '오징어', '조개류'],
};

interface DietaryRestrictionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DietaryRestrictionsSheet({
  isOpen,
  onClose,
}: DietaryRestrictionsSheetProps) {
  const [activeCategory, setActiveCategory] = useState(
    DIETARY_CATEGORIES[0].key
  );

  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );

  const { scrollRef, showGradient } = useScrollGradient([selectedRestrictions]);

  const handleSelect = (item: string) => {
    setSelectedRestrictions(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleReset = () => {
    setSelectedRestrictions([]);
    console.log('선택 초기화');
  };

  const handleComplete = () => {
    console.log('못 먹는 음식 선택 완료:', selectedRestrictions);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex h-[90vh] w-full flex-col rounded-3xl">
        <div className="flex h-full flex-col">
          <div className="flex justify-end px-5">
            <DrawerClose asChild>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
              >
                <CloseIcon size={24} />
              </button>
            </DrawerClose>
          </div>

          <DrawerTitle className="text-20sb mb-[2rem] px-6 text-gray-900">
            못먹는 음식 설정
          </DrawerTitle>

          <div
            ref={scrollRef}
            className="flex-grow overflow-y-auto px-[1.875rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-9">
              {DIETARY_CATEGORIES.map(category => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`text-15sb h-10 flex-shrink-0 rounded-full px-4 py-[0.5313rem] transition-colors ${
                    activeCategory === category.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {DIETARY_CATEGORIES.map(category => (
                <div key={category.key}>
                  <h3 className="text-17sb mb-3 text-gray-900">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_ITEMS[
                      category.key as keyof typeof DIETARY_ITEMS
                    ]?.map(item => (
                      <Button
                        key={item}
                        onClick={() => handleSelect(item)}
                        variant="foodItem"
                        shape="square"
                        className={`text-15sb h-10 flex-grow basis-[calc(33.33%-0.5rem)] rounded-[0.625rem] border border-gray-300 px-3 py-[1.125rem] ${
                          selectedRestrictions.includes(item)
                            ? 'bg-[#F6FFEC] text-[#68982D]'
                            : ''
                        } `}
                      >
                        {item}
                      </Button>
                    ))}
                    <div className="basis-[calc(33.33%-0.5rem)]" />
                    <div className="basis-[calc(33.33%-0.5rem)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pb-10" />
          </div>
          <div
            className={`pointer-events-none absolute bottom-[5.375rem] h-6 w-full transition-opacity duration-300 ${
              showGradient
                ? 'bg-gradient-to-t from-white/90 to-transparent opacity-100'
                : 'opacity-0'
            } `}
          />
          <div className="sticky bottom-0 flex flex-shrink-0 items-center gap-3 bg-white px-6 pb-[2.125rem] transition-shadow duration-200">
            <Button
              variant="reset"
              className="flex h-14 w-14 items-center justify-center bg-gray-600 p-0 hover:bg-gray-400"
              onClick={handleReset}
            >
              <RefreshIcon size={24} color="white" />
            </Button>

            <Button
              shape="round"
              className="text-17sb bg-primary h-14 flex-1 text-white"
              onClick={handleComplete}
              size="full"
              disabled={selectedRestrictions.length === 0}
            >
              못먹는 음식 선택 완료
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

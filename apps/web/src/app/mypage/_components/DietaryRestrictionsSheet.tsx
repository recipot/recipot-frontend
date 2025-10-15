'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { RefreshIcon } from '@/components/Icons'; // RefreshIcon이 있다고 가정
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'; // ReviewBottomSheet에서 사용된 Drawer 컴포넌트 가정

// 이미지에 있는 카테고리
const DIETARY_CATEGORIES = [
  { key: 'seafood', name: '해산물류' },
  { key: 'meat_dairy', name: '육류 및 유제품' },
  { key: 'nuts_grains', name: '견과류 및 곡류' },
  // TODO: 실제 데이터를 기반으로 확장
];

// 이미지에 있는 아이템
const DIETARY_ITEMS = {
  meat_dairy: ['돼지', '닭', '소', '유제품'],
  nuts_grains: ['땅콩', '호두', '잣'],
  seafood: ['어류', '게', '새우', '오징어', '조개류'],
};

// UI에서 사용될 props 타입
interface DietaryRestrictionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // TODO: onSave, initialRestrictions (초기 선택 값) 등의 prop 추가
}

export default function DietaryRestrictionsSheet({
  isOpen,
  onClose,
}: DietaryRestrictionsSheetProps) {
  // 현재 활성화된 카테고리 탭 상태
  const [activeCategory, setActiveCategory] = useState(
    DIETARY_CATEGORIES[0].key
  );

  // TODO: 실제 선택된 못 먹는 음식 리스트 상태 관리 로직 추가
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );

  const handleSelect = (item: string) => {
    // TODO: 선택/해제 로직 구현
    console.log(`Toggling selection for: ${item}`);
  };

  const handleReset = () => {
    // TODO: 초기화 로직 구현
    setSelectedRestrictions([]);
    console.log('선택 초기화');
  };

  const handleComplete = () => {
    // TODO: 최종 저장/onSubmit 로직 구현
    console.log('못 먹는 음식 선택 완료');
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="mx-auto flex h-[90vh] w-full max-w-[430px] flex-col">
        <div className="flex h-full flex-col">
          {/* 헤더 - 상단에 고정 */}
          <div className="flex justify-end px-4 pt-3">
            <DrawerClose asChild>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-900" />
                <span className="sr-only">닫기</span>
              </button>
            </DrawerClose>
          </div>

          <DrawerTitle className="text-20sb mb-6 px-4 text-gray-900">
            못먹는 음식 설정
          </DrawerTitle>

          {/* 컨텐츠 영역 - 스크롤 가능 */}
          <div className="flex-grow overflow-y-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* 탭/카테고리 영역 */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-6">
              {DIETARY_CATEGORIES.map(category => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`text-14sb flex-shrink-0 rounded-full px-4 py-2 transition-colors ${
                    activeCategory === category.key
                      ? 'bg-gray-900 text-white' // 선택된 탭 스타일 (이미지 참고)
                      : 'bg-gray-100 text-gray-900' // 기본 탭 스타일
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* 실제 아이템 선택 섹션 (전체 카테고리 표시) */}
            <div className="space-y-8">
              {DIETARY_CATEGORIES.map(category => (
                <div key={category.key}>
                  <h3 className="text-17sb mb-4 text-gray-900">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_ITEMS[
                      category.key as keyof typeof DIETARY_ITEMS
                    ]?.map(item => (
                      <button
                        key={item}
                        onClick={() => handleSelect(item)}
                        className={`text-14 rounded-lg border px-4 py-2 transition-colors ${
                          selectedRestrictions.includes(item)
                            ? 'bg-primary-light text-primary-sub border-primary-sub' // 선택된 아이템 스타일
                            : 'border-gray-300 bg-white text-gray-900' // 기본 아이템 스타일
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 패딩 확보 */}
            <div className="h-4" />
          </div>

          {/* 버튼 영역 - 하단에 고정 */}
          <div className="sticky bottom-0 flex flex-shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-4 pt-4 pb-6">
            {/* 새로고침/초기화 버튼 */}
            <Button
              shape="round"
              className="flex h-14 w-14 items-center justify-center bg-gray-300 p-0 hover:bg-gray-400"
              onClick={handleReset}
            >
              {/* 이미지에 있는 아이콘과 유사한 RefreshIcon을 사용했다고 가정 */}
              <RefreshIcon size={24} color="white" />
            </Button>

            {/* 선택 완료 버튼 */}
            <Button
              shape="round"
              className="text-17sb bg-primary h-14 flex-1 text-white"
              onClick={handleComplete}
              size="full"
              // TODO: disabled 상태 추가: 최소 1개 이상 선택 시 활성화
              // disabled={selectedRestrictions.length === 0}
            >
              못먹는 음식 선택 완료
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  AllergyCheckContainer,
  AllergyNavigationTabs,
  useAllergyCheck,
  useAllergyData,
} from '@/components/Allergy';
import type { AllergyFormSchema } from '@/components/Allergy/Allergy.constants';
import { CATEGORY_METADATA } from '@/components/Allergy/Allergy.constants';
import { Button } from '@/components/common/Button';
import { CloseIcon, RefreshIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';

import type { z } from 'zod';

interface DietaryRestrictionsSheetProps {
  initialSelectedItems?: number[];
  isOpen: boolean;
  onClose: () => void;
  onSave?: (selectedItems: number[]) => void;
}

export default function DietaryRestrictionsSheet({
  initialSelectedItems = [],
  isOpen,
  onClose,
  onSave,
}: DietaryRestrictionsSheetProps) {
  // 백엔드에서 재료 데이터 페칭
  const { categories, error, initialSelectedIds, isLoading } = useAllergyData();

  const { handleItemToggle, resetItems, resetToInitial, selectedItems } =
    useAllergyCheck(initialSelectedItems);

  const [activeCategory, setActiveCategory] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gnbRef = useRef<HTMLDivElement>(null);

  // 시트가 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (isOpen) {
      resetToInitial();
    }
  }, [isOpen, resetToInitial]);

  // 스크롤 스파이를 위한 섹션 ID 생성
  const sectionIds = useMemo(
    () =>
      CATEGORY_METADATA.map(
        (_: unknown, index: number) => `allergy-section-${index}`
      ),
    []
  );

  // Drawer 내부 스크롤 감지
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      let currentActiveSectionId: string | null = null;
      const offset = 150;

      // 스크롤 컨테이너 하단에 도달했는지 확인
      const isAtBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
        scrollContainer.clientHeight + 2;

      if (isAtBottom) {
        currentActiveSectionId = sectionIds[sectionIds.length - 1];
      } else {
        for (const id of sectionIds) {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            const relativeTop = rect.top - containerRect.top;

            if (relativeTop <= offset) {
              currentActiveSectionId = id;
            }
          }
        }
      }

      if (currentActiveSectionId) {
        const activeSectionIndex = sectionIds.findIndex(
          id => id === currentActiveSectionId
        );
        if (activeSectionIndex !== -1) {
          setActiveCategory(activeSectionIndex);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    handleScroll(); // 초기 실행

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  // 활성 탭 자동 중앙 정렬
  useEffect(() => {
    if (!gnbRef.current) return;

    const activeButton = gnbRef.current.querySelector<HTMLButtonElement>(
      `[data-section-id="allergy-section-${activeCategory}"]`
    );

    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  const handleTabClick = (index: number) => {
    setActiveCategory(index);

    // requestAnimationFrame으로 다음 프레임에 스크롤 실행
    requestAnimationFrame(() => {
      const section = document.getElementById(`allergy-section-${index}`);
      const scrollContainer = scrollContainerRef.current;

      if (section && scrollContainer) {
        const navigationOffset = 80;

        const elementPosition = section.getBoundingClientRect().top;
        const containerPosition = scrollContainer.getBoundingClientRect().top;
        const targetPosition =
          elementPosition -
          containerPosition +
          scrollContainer.scrollTop -
          navigationOffset;

        // 부드러운 스크롤 애니메이션
        const startPosition = scrollContainer.scrollTop;
        const distance = targetPosition - startPosition;
        const duration = 300; // 300ms
        let startTime: number | null = null;

        const animation = (currentTime: number) => {
          startTime ??= currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);

          // easeInOutCubic
          const ease =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          scrollContainer.scrollTop = startPosition + distance * ease;

          if (progress < 1) {
            requestAnimationFrame(animation);
          }
        };

        requestAnimationFrame(animation);
      }
    });
  };

  const handleReset = () => {
    resetItems();
  };

  const handleSubmit = (data: z.infer<typeof AllergyFormSchema>) => {
    // TODO: API 연동
    onSave?.(data.items);
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

          <DrawerTitle className="!text-22sb mb-4 px-6 text-gray-900">
            못먹는 음식 설정
          </DrawerTitle>

          <div
            ref={scrollContainerRef}
            data-scroll-container
            className="flex-grow overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="sticky top-0 z-50 bg-white py-4">
              <AllergyNavigationTabs
                activeIndex={activeCategory}
                gnbRef={gnbRef}
                onTabClick={handleTabClick}
                variant="drawer"
              />
            </div>

            <div className="px-6 pt-5">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="text-gray-600">
                    재료 목록을 불러오는 중...
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center py-10">
                  <div className="text-red-600">
                    재료 목록을 불러오는데 실패했습니다.
                  </div>
                </div>
              ) : (
                <AllergyCheckContainer
                  categories={categories}
                  formId="dietary-restrictions-form"
                  onSubmit={handleSubmit}
                  selectedItems={selectedItems}
                  onItemToggle={handleItemToggle}
                />
              )}
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-shrink-0 items-center gap-3 bg-white px-6 pt-4 pb-[2.125rem] transition-shadow duration-200">
            <Button
              variant="reset"
              className="flex h-14 w-14 items-center justify-center bg-gray-600 p-0 hover:bg-gray-400"
              onClick={handleReset}
            >
              <RefreshIcon size={24} color="white" />
            </Button>

            <Button
              form="dietary-restrictions-form"
              shape="round"
              className="text-17sb bg-primary h-14 flex-1 text-white"
              type="submit"
              size="full"
            >
              못먹는 음식 선택 완료
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

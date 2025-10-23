'use client';

import React, { useEffect, useRef } from 'react';

import { Allergy, useAllergyContext } from '@/components/Allergy';
import type { AllergyFormSchema } from '@/components/Allergy/constants/constants';
import { CloseIcon } from '@/components/Icons';
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

const EMPTY_ARRAY: number[] = [];

function DietaryRestrictionsContent({
  onClose,
  onSave,
  scrollContainerRef,
}: {
  onClose: () => void;
  onSave?: (selectedItems: number[]) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) {
  const { activeIndex, gnbRef, setActiveIndex } = useAllergyContext();

  // 활성 탭 자동 중앙 정렬
  useEffect(() => {
    if (!gnbRef?.current) return;

    const activeButton = gnbRef.current.querySelector<HTMLButtonElement>(
      `[data-section-id="allergy-section-${activeIndex}"]`
    );

    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex, gnbRef]);

  // Drawer 내부 스크롤 감지 (Context의 ScrollSpy를 덮어씀)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      let currentActiveSectionId: string | null = null;
      const offset = 150;

      const isAtBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
        scrollContainer.clientHeight + 2;

      if (isAtBottom) {
        const lastIndex = 8; // CATEGORY_METADATA 길이 - 1
        setActiveIndex(lastIndex);
        return;
      }

      for (let index = 0; index <= 8; index++) {
        const id = `allergy-section-${index}`;
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

      if (currentActiveSectionId) {
        const match = currentActiveSectionId.match(/allergy-section-(\d+)/);
        if (match) {
          const index = Number.parseInt(match[1], 10);
          setActiveIndex(index);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    handleScroll(); // 초기 실행

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef, setActiveIndex]);

  const handleSubmit = (data: z.infer<typeof AllergyFormSchema>) => {
    // TODO: API 연동
    onSave?.(data.items);
    onClose();
  };

  return (
    <>
      <div className="flex justify-end px-5">
        <DrawerClose asChild>
          <button
            className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
            onClick={onClose}
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
        className="flex-grow overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-scroll-container
      >
        <div className="sticky top-0 z-50 bg-white py-4">
          <Allergy.Navigation variant="drawer" />
        </div>

        <div className="px-6 pt-5">
          <Allergy.LoadingState />
          <Allergy.ErrorState />
          <Allergy.Content onSubmit={handleSubmit} />
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-shrink-0 items-center gap-3 bg-white px-6 pt-4 pb-[2.125rem] transition-shadow duration-200">
        <Allergy.ResetButton />

        <Allergy.SubmitButton
          className="text-17sb bg-primary h-14 flex-1 text-white"
          text="못먹는 음식 선택 완료"
        />
      </div>
    </>
  );
}

export default function DietaryRestrictionsSheet({
  initialSelectedItems = EMPTY_ARRAY,
  isOpen,
  onClose,
  onSave,
}: DietaryRestrictionsSheetProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollConfig = React.useMemo(
    () => ({
      containerRef: scrollContainerRef,
      navigationOffset: 80,
      scrollSpyOffset: 150,
      useWindowScroll: false,
    }),
    []
  );

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex h-[90vh] w-full flex-col rounded-3xl">
        <div className="flex h-full flex-col">
          <Allergy
            formId="dietary-restrictions-form"
            initialSelectedItems={initialSelectedItems}
            scrollConfig={scrollConfig}
          >
            <DietaryRestrictionsContent
              onClose={onClose}
              onSave={onSave}
              scrollContainerRef={scrollContainerRef}
            />
          </Allergy>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

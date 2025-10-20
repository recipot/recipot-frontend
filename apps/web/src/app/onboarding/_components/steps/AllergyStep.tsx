'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  AllergyCheckContainer,
  AllergyNavigationTabs,
  useAllergyCheck,
  useAllergyData,
} from '@/components/Allergy';
import { Button } from '@/components/common/Button';
import { useScrollSpy } from '@/hooks';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { ONBOARDING_CONSTANTS, SCROLLBAR_HIDE_STYLE } from '../../_constants';
import { useOnboardingActions, useOnboardingStep } from '../../_hooks';
import { getSubmitButtonText, onboardingStyles } from '../../_utils';

import type { AllergyStepData } from '../../_types';

export default function AllergyStep() {
  // 온보딩 스텝 로직
  const { handleError, isSubmitting, saveAndProceed } = useOnboardingStep(1);

  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed } = useOnboardingActions();

  // 백엔드에서 재료 데이터 페칭
  const { categories, error, initialSelectedIds, isLoading } = useAllergyData();

  // 저장된 데이터 불러오기 (있으면 사용, 없으면 백엔드 초기값)
  const stepData = useOnboardingStore(state => state.stepData[1]);
  const savedSelectedItems =
    stepData?.selectedItems ?? initialSelectedIds ?? [];

  const { handleItemToggle, resetItems, selectedItems } =
    useAllergyCheck(savedSelectedItems);

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed) {
      resetItems();
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [isRefreshed, resetItems, clearRefreshFlag]);

  // categories 배열에서 섹션 정보 동적 생성
  const ALLERGY_SECTIONS = useMemo(
    () =>
      categories.map((category, index) => ({
        id: `allergy-section-${index}`,
        label: category.title,
      })),
    [categories]
  );

  // ScrollSpy 훅 사용
  const sectionIds = useMemo(
    () => ALLERGY_SECTIONS.map(section => section.id),
    [ALLERGY_SECTIONS]
  );

  const { activeSection, gnbRef } = useScrollSpy(sectionIds, {
    offset: ONBOARDING_CONSTANTS.SCROLL_SPY_OFFSET,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // 활성 섹션에 따라 인덱스 업데이트
  useEffect(() => {
    if (activeSection) {
      const index = sectionIds.findIndex(id => id === activeSection);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [activeSection, sectionIds]);

  const handleSubmit = async (data: { items: number[] }) => {
    try {
      const allergyData: AllergyStepData = {
        allergies: data.items,
        selectedItems,
      };

      await saveAndProceed(allergyData);
    } catch (error) {
      handleError(error as Error);
    }
  };

  // 섹션으로 스크롤하는 함수
  const handleTabClick = (index: number) => {
    const section = ALLERGY_SECTIONS.at(index);
    if (!section) return;

    const element = document.getElementById(section.id);
    if (element) {
      const navigationOffset = 130;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navigationOffset;

      window.scrollTo({
        behavior: 'smooth',
        top: Math.max(0, offsetPosition),
      });
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={onboardingStyles.container}>
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg text-gray-600">
            재료 목록을 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={onboardingStyles.container}>
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <div className="text-lg text-red-600">
            재료 목록을 불러오는데 실패했습니다.
          </div>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={onboardingStyles.container}>
      {/* 네비게이션 바 */}
      <div className={onboardingStyles.navigation.wrapper}>
        <div
          className={onboardingStyles.navigation.list}
          style={SCROLLBAR_HIDE_STYLE}
        >
          <AllergyNavigationTabs
            activeIndex={activeIndex}
            gnbRef={gnbRef}
            onTabClick={handleTabClick}
            variant="default"
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={onboardingStyles.content.wrapper}>
        <AllergyCheckContainer
          categories={categories}
          formId="allergy-form"
          onSubmit={handleSubmit}
          selectedItems={selectedItems}
          onItemToggle={handleItemToggle}
        />
      </div>

      {/* 하단 버튼 */}
      <div className={onboardingStyles.submitButton.wrapper}>
        <Button form="allergy-form" disabled={isSubmitting} type="submit">
          {getSubmitButtonText(isSubmitting, 1)}
        </Button>
      </div>
    </div>
  );
}

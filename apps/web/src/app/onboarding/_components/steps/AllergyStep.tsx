'use client';

import { useEffect, useState } from 'react';

import { AllergyCheckContainer, useAllergyCheck } from '@/components/Allergy';
import { categories } from '@/components/Allergy/Allergy.constants';
import { Button } from '@/components/common/Button';
import { useScrollSpy } from '@/hooks';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { ONBOARDING_CONSTANTS, SCROLLBAR_HIDE_STYLE } from '../../_constants';
import { useOnboardingActions, useOnboardingStep } from '../../_hooks';
import {
  getNavigationButtonClass,
  getNavigationItemClass,
  getSubmitButtonText,
  onboardingStyles,
} from '../../_utils';

import type { AllergyStepData } from '../../_types';

// categories 배열에서 섹션 정보 동적 생성 (실제 렌더링과 일치)
const ALLERGY_SECTIONS = categories.map((category, index) => ({
  id: `allergy-section-${index}`,
  label: category.title,
}));

export default function AllergyStep() {
  // 온보딩 스텝 로직
  const { handleError, isSubmitting, saveAndProceed } = useOnboardingStep(1);

  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed } = useOnboardingActions();

  // 저장된 데이터 불러오기
  const stepData = useOnboardingStore(state => state.stepData[1]);
  const savedSelectedItems = stepData?.selectedItems ?? [];

  const { handleItemToggle, resetItems, selectedItems } =
    useAllergyCheck(savedSelectedItems);

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed && stepData && Object.keys(stepData).length === 0) {
      resetItems();
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [stepData, isRefreshed, resetItems, clearRefreshFlag]);

  // 스크롤 상태 추적
  const [hasScrolled, setHasScrolled] = useState(false);

  // ScrollSpy 훅 사용
  const sectionIds = ALLERGY_SECTIONS.map(section => section.id);
  const { activeSection, gnbRef } = useScrollSpy(sectionIds, {
    offset: ONBOARDING_CONSTANTS.SCROLL_SPY_OFFSET,
  });

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > ONBOARDING_CONSTANTS.SCROLL_THRESHOLD) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // 섹션으로 스크롤하는 함수 (URL 해시 변경 없이)
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className={onboardingStyles.container}>
      {/* 네비게이션 바 */}
      <div className={onboardingStyles.navigation.wrapper}>
        <ul
          ref={gnbRef}
          className={onboardingStyles.navigation.list}
          style={SCROLLBAR_HIDE_STYLE}
        >
          {ALLERGY_SECTIONS.map((section, index) => (
            <li
              key={section.id}
              data-section-id={section.id}
              className={getNavigationItemClass(index, ALLERGY_SECTIONS.length)}
            >
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={getNavigationButtonClass(
                  activeSection === section.id,
                  hasScrolled
                )}
                aria-label={`${section.label} 섹션으로 이동`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={onboardingStyles.content.wrapper}>
        <AllergyCheckContainer
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

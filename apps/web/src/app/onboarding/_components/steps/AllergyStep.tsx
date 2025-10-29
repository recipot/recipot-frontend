'use client';

import { useEffect, useMemo } from 'react';

import { Allergy, useAllergyContext } from '@/components/Allergy';
import { useAllergiesStore } from '@/stores/allergiesStore';

import { ONBOARDING_CONSTANTS, SCROLLBAR_HIDE_STYLE } from '../../_constants';
import { useOnboardingActions, useOnboardingStep } from '../../_hooks';
import { getSubmitButtonText, onboardingStyles } from '../../_utils';

function AllergyStepContent() {
  // 온보딩 스텝 로직
  const { handleError, isSubmitting, saveAndProceed } = useOnboardingStep(1);

  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed } = useOnboardingActions();

  // Context에서 상태 가져오기
  const { resetItems, selectedItems } = useAllergyContext();

  // 알러지 스토어에 저장
  const setAllergies = useAllergiesStore(state => state.setAllergies);
  const setSelectedItems = useAllergiesStore(state => state.setSelectedItems);

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed) {
      resetItems();
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [isRefreshed, resetItems, clearRefreshFlag]);

  const handleSubmit = async (data: { items: number[] }) => {
    try {
      // 알러지 스토어에 저장
      setAllergies(data.items);
      setSelectedItems(selectedItems);

      await saveAndProceed();
    } catch (error) {
      handleError(error as Error);
    }
  };

  return (
    <div className={onboardingStyles.container}>
      {/* 로딩 상태 */}
      <Allergy.LoadingState className="h-screen" />

      {/* 에러 상태 */}
      <Allergy.ErrorState className="h-screen" />

      {/* 네비게이션 바 */}
      <div className={onboardingStyles.navigation.wrapper}>
        <div
          className={onboardingStyles.navigation.list}
          style={SCROLLBAR_HIDE_STYLE}
        >
          <Allergy.Navigation variant="default" />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={onboardingStyles.content.wrapper}>
        <Allergy.Content onSubmit={handleSubmit} />
      </div>

      {/* 하단 버튼 */}
      <div className={onboardingStyles.submitButton.wrapper}>
        <Allergy.SubmitButton disabled={isSubmitting}>
          {getSubmitButtonText(isSubmitting, 1)}
        </Allergy.SubmitButton>
      </div>
    </div>
  );
}

export default function AllergyStep() {
  // 저장된 데이터 불러오기 (allergiesStore에서)
  const savedSelectedItems = useAllergiesStore(state => state.selectedItems);

  const scrollConfig = useMemo(
    () => ({
      navigationOffset: 130,
      scrollSpyOffset: ONBOARDING_CONSTANTS.SCROLL_SPY_OFFSET,
      useWindowScroll: true,
    }),
    []
  );

  return (
    <Allergy
      formId="allergy-form"
      initialSelectedItems={savedSelectedItems}
      scrollConfig={scrollConfig}
    >
      <AllergyStepContent />
    </Allergy>
  );
}

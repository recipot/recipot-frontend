'use client';

import { useEffect, useState } from 'react';

import { AllergyCheckContainer, useAllergyCheck } from '@/components/Allergy';
import { categories } from '@/components/Allergy/Allergy.constants';
import { Button } from '@/components/common/Button';
import { useScrollSpy } from '@/hooks';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { onboardingStorage } from '@/utils/onboardingStorage';

// categories 배열에서 섹션 정보 동적 생성 (실제 렌더링과 일치)
const ALLERGY_SECTIONS = categories.map((category, index) => ({
  id: `allergy-section-${index}`,
  label: category.title,
}));

// 스크롤바 숨김 스타일
const scrollbarHideStyle = {
  msOverflowStyle: 'none' as const,
  scrollbarWidth: 'none' as const,
};

export default function AllergyStep() {
  // 저장된 데이터 불러오기
  const stepData = useOnboardingStore(state => state.stepData[1]);
  const isRefreshed = useOnboardingStore(state => state.isRefreshed);
  const clearRefreshFlag = useOnboardingStore(state => state.clearRefreshFlag);
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
  const goToNextStep = useOnboardingStore(state => state.goToNextStep);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );
  const setStepData = useOnboardingStore(state => state.setStepData);

  // 스크롤 상태 추적
  const [hasScrolled, setHasScrolled] = useState(false);

  // ScrollSpy 훅 사용
  const sectionIds = ALLERGY_SECTIONS.map(section => section.id);
  const { activeSection, gnbRef } = useScrollSpy(sectionIds, { offset: 100 });

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // 50px 이상 스크롤했을 때
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로딩 상태 관리 (기존 mutation 대신)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { items: number[] }) => {
    try {
      setIsSubmitting(true);

      // localStorage에 알레르기 데이터 저장
      onboardingStorage.saveStepData(1, {
        allergies: data.items,
      });

      // 스토어 업데이트 (UI 상태 관리용)
      setStepData(1, { allergies: data.items, selectedItems });
      markStepCompleted(1);

      console.info('✅ Step 1 완료: 알레르기 정보 저장됨', {
        allergies: data.items,
        selectedItems,
      });

      // 다음 단계로 이동
      goToNextStep();
    } catch (error) {
      console.error('❌ 알레르기 데이터 저장 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsSubmitting(false);
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
    <div className="container mx-auto max-w-4xl">
      {/* 네비게이션 바 */}
      <div className="sticky top-0 z-10 bg-white py-4">
        <ul
          ref={gnbRef}
          className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={scrollbarHideStyle}
        >
          {ALLERGY_SECTIONS.map((section, index) => (
            <li
              key={section.id}
              data-section-id={section.id}
              className={`flex-shrink-0 ${index === 0 ? 'pl-4' : ''} ${
                index === ALLERGY_SECTIONS.length - 1 ? 'pr-4' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`text-15sb inline-block cursor-pointer rounded-full px-4 py-2 transition-all duration-200 ${
                  hasScrolled && activeSection === section.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } `}
                aria-label={`${section.label} 섹션으로 이동`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6">
        <AllergyCheckContainer
          formId="allergy-form"
          onSubmit={handleSubmit}
          selectedItems={selectedItems}
          onItemToggle={handleItemToggle}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 flex justify-center bg-gradient-to-t from-white via-white to-transparent px-6 py-[10px] pt-8">
        <Button form="allergy-form" disabled={isSubmitting} type="submit">
          {isSubmitting ? '저장 중...' : '여유에 맞는 요리 추천받기'}
        </Button>
      </div>
    </div>
  );
}

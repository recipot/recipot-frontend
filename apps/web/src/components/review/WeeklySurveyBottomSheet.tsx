'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  healthSurvey,
  type HealthSurveyPreparationResponse,
  type HealthSurveyRequest,
  type HealthSurveySubmitResponse,
} from '@recipot/api';
import { tokenUtils } from 'packages/api/src/auth';

import { isProduction } from '@/lib/env';
import { useApiErrorModalStore } from '@/stores';

import { Button } from '../common/Button';
import { CloseIcon } from '../Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '../ui/drawer';
import {
  HEALTH_CHANGE_OPTIONS_ARRAY,
  HEALTH_IMPROVEMENT_OPTIONS_ARRAY,
} from './constants';
import HealthChangeOptions from './HealthChangeOptions';
import { ImprovementOptions } from './ImprovementOptions';

interface SurveyFormData {
  persistentIssueCode: string;
  effectCodes: string[];
  additionalNote: string;
}

// 유틸리티 함수들
const IMPROVEMENT_CODE = 'H01003'; // 개선됐어요 코드

const isImprovementSelected = (healthChange: string) => {
  return healthChange === IMPROVEMENT_CODE;
};

const shouldShowImprovementSection = (healthChange: string) => {
  return isImprovementSelected(healthChange);
};

const isSubmitDisabled = (
  isEligible: boolean,
  recentCompletionCount: number,
  healthChange: string,
  improvements: string[],
  additionalNote: string,
  isSubmitting: boolean
) => {
  // 제출 중인 경우 비활성화
  if (isSubmitting) {
    return true;
  }

  // 자격 및 완료 여부는 서버에서 검증하므로 클라이언트에서는 저장만 함
  if (isEligible === false || recentCompletionCount >= 1) {
    return true;
  }

  // 건강 변화를 선택하지 않은 경우 비활성화
  if (!healthChange) {
    return true;
  }

  // 개선됐어요를 선택했는데 개선 항목을 선택하지 않은 경우 비활성화
  if (isImprovementSelected(healthChange) && improvements.length === 0) {
    return true;
  }

  // 기타만 선택한 경우 의견 입력 필수
  if (
    improvements.length === 1 &&
    improvements.includes('H02005') &&
    !additionalNote.trim()
  ) {
    return true;
  }

  // 모든 필수 항목이 완료된 경우 활성화
  // 자격 및 완료 여부는 서버에서 검증
  return false;
};

export function WeeklySurveyBottomSheet() {
  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparationData, setPreparationData] =
    useState<HealthSurveyPreparationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEligible, setIsEligible] = useState(false);

  const [recentCompletionCount, setRecentCompletionCount] = useState(0);
  const isFetchingRef = useRef(false);
  const improvementSectionRef = useRef<HTMLElement | null>(null);
  const improvementTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const healthChangeQuestionRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 자격 확인 및 준비 데이터 가져오기
  const initializeData = useCallback(async () => {
    if (isFetchingRef.current) return;

    if (!useCookieAuth && !token) {
      setLoading(false);
      return;
    }

    isFetchingRef.current = true;

    try {
      setLoading(true);

      const [eligibilityData, preparation] = await Promise.all([
        healthSurvey.getEligibility(),
        healthSurvey.getPreparation(),
      ]);

      // 자격 및 완료 여부는 서버에서 검증하므로 클라이언트에서는 저장만 함
      setIsEligible(eligibilityData.isEligible);
      setRecentCompletionCount(eligibilityData.recentCompletionCount);
      setPreparationData(preparation);
    } catch (error) {
      console.error('데이터 초기화 실패:', error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [token, useCookieAuth]);

  useEffect(() => {
    void initializeData();
  }, [initializeData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void initializeData();
      }
    };

    const handleWindowFocus = () => {
      void initializeData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [initializeData]);

  const { handleSubmit, register, setValue, watch } = useForm<SurveyFormData>({
    defaultValues: {
      additionalNote: '',
      effectCodes: [],
      persistentIssueCode: '',
    },
  });

  const additionalNoteRegister = register('additionalNote');

  const watchedValues = watch([
    'persistentIssueCode',
    'effectCodes',
    'additionalNote',
  ]);
  const [watchedHealthChange, watchedImprovements, watchedAdditionalFeedback] =
    watchedValues;

  // textarea ref 콜백 함수
  const handleTextareaRef = (element: HTMLTextAreaElement | null) => {
    additionalNoteRegister.ref(element);
    improvementTextareaRef.current = element;
  };

  const handleOptionToggle = (option: string) => {
    const isIncludedOption = watchedImprovements.includes(option);
    const filteredImprovements = watchedImprovements.filter(
      item => item !== option
    );
    const newImprovements = isIncludedOption
      ? filteredImprovements
      : [...watchedImprovements, option];
    setValue('effectCodes', newImprovements);
  };

  const handleHealthChangeSelect = (option: string) => {
    setValue('persistentIssueCode', option);
  };

  // 개선됐어요 선택 시 다중선택 섹션으로 스크롤
  useEffect(() => {
    if (
      isImprovementSelected(watchedHealthChange) &&
      improvementSectionRef.current
    ) {
      improvementSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [watchedHealthChange]);

  // 기타 옵션 선택 시 textarea로 스크롤
  useEffect(() => {
    if (
      watchedImprovements.includes('H02005') &&
      improvementTextareaRef.current
    ) {
      improvementTextareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [watchedImprovements]);

  const handleClose = () => {
    setIsOpen(prev => !prev);
  };

  const onSubmit = async (data: SurveyFormData) => {
    if (!useCookieAuth && !token) {
      return;
    }

    const { additionalNote, effectCodes, persistentIssueCode } = data;

    setIsSubmitting(true);

    try {
      // form 데이터를 API 형식으로 변환
      const healthSurveyRequest: HealthSurveyRequest = {
        additionalNote,
        effectCodes,
        persistentIssueCode,
      };

      // API 호출
      const healthSurveySubmitResponse: HealthSurveySubmitResponse =
        await healthSurvey.submitHealthSurvey(healthSurveyRequest);

      if (healthSurveySubmitResponse.status === 200) {
        handleClose();
      } else {
        useApiErrorModalStore.getState().showError({
          message: '설문 제출 실패',
        });
      }
    } catch {
      useApiErrorModalStore.getState().showError({
        message: '설문 제출 실패',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent className="mx-auto w-full max-w-[430px]">
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-lg text-gray-600">
                데이터를 불러오는 중...
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="mx-auto flex min-h-0 w-full max-w-[430px] flex-col">
        <VisuallyHidden asChild>
          <DrawerTitle>어제 드신 메뉴 어떠셨나요?</DrawerTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DrawerDescription>
            집밥을 챙겨 먹은 후 건강에 어떤 변화가 있었는지 알려주세요.
          </DrawerDescription>
        </VisuallyHidden>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col px-6"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* 고정 헤더 영역 */}
            <div className="flex-shrink-0">
              <div className="flex justify-end py-4">
                <DrawerClose
                  type="button"
                  className="rounded-full p-1.5"
                  aria-label="리뷰 리마인드 바텀시트 닫기"
                >
                  <CloseIcon size={24} color="#626A7A" />
                  <span className="sr-only">닫기</span>
                </DrawerClose>
              </div>

              <section
                aria-labelledby="review-request-title"
                className="space-y-8"
              >
                <div className="mb-2">
                  <h1
                    id="review-request-title"
                    className="text-24 mb-2 text-gray-900"
                  >
                    집밥을 챙겨 먹은 후에
                    <br />
                    건강에 어떤 변화가 있었나요?
                  </h1>
                </div>
              </section>
              <h3 className="text-15 text-gray-600">
                더 건강한 메뉴를 위해 여러분의 의견을 들려주세요
              </h3>
            </div>

            {/* 스크롤 가능한 항목 선택 영역 */}
            <div
              ref={scrollContainerRef}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="mt-6 h-0 w-[390px] border-t border-dashed border-gray-300" />
              <div className="mt-6">
                <section className="flex flex-col items-center justify-center">
                  <h2 className="text-18sb text-gray-900">
                    평소 건강 문제에 변화가 있었나요?
                  </h2>
                  <div ref={healthChangeQuestionRef}>
                    <HealthChangeOptions
                      options={
                        preparationData?.persistentIssueOption ??
                        HEALTH_CHANGE_OPTIONS_ARRAY
                      }
                      onSelect={handleHealthChangeSelect}
                      selectedValue={watchedHealthChange}
                    />
                  </div>
                </section>
                {/* 개선됐어요가 선택되었을 때만 다중선택 영역 표시 */}
                {shouldShowImprovementSection(watchedHealthChange) && (
                  <section ref={improvementSectionRef} className="mt-6">
                    <h2 className="text-18sb mb-6 text-gray-800">
                      어떤 점이 개선되었나요?(다중선택)
                    </h2>

                    <ImprovementOptions
                      options={
                        preparationData?.effectOptions ??
                        HEALTH_IMPROVEMENT_OPTIONS_ARRAY
                      }
                      onToggle={handleOptionToggle}
                      selectedValues={watchedImprovements}
                    />

                    <div className="textarea-container">
                      <textarea
                        {...additionalNoteRegister}
                        ref={handleTextareaRef}
                        value={watchedAdditionalFeedback}
                        placeholder="구체적으로 느낀 변화를 적어주세요!"
                        className="text-17 w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-600 placeholder:text-gray-400 focus:border-[#68982d] focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </section>
                )}
              </div>

              {/* 선택 전 또는 개선됐어요가 아닌 경우에만 표시되는 여백 */}
              {(!watchedHealthChange ||
                !shouldShowImprovementSection(watchedHealthChange)) && (
                <div className="h-[257px]" />
              )}
            </div>

            {/* 설문완료 버튼 - 하단 고정 */}
            <div className="flex-shrink-0 px-[30px] pt-4 pb-[34px]">
              <Button
                type="submit"
                disabled={isSubmitDisabled(
                  isEligible,
                  recentCompletionCount,
                  watchedHealthChange,
                  watchedImprovements,
                  watchedAdditionalFeedback,
                  isSubmitting
                )}
                className="text-17sb w-full rounded-full bg-[#68982d] py-4 text-white hover:bg-[#5a7a26] disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isSubmitting ? '제출 중...' : '설문완료'}
              </Button>
            </div>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

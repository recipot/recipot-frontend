'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { tokenUtils } from 'packages/api/src/auth';

import { Button } from '../common/Button';
import CheckboxIcon from '../common/CheckboxIcon';
import { CloseIcon } from '../Icons';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '../ui/drawer';

const HEALTH_IMPROVEMENT_OPTIONS = [
  '피로가 줄었다',
  '몸이 가벼워 졌다',
  '속이 편했다',
  '체중 관리에 도움이 된다',
  '기타',
] as const;

const HEALTH_CHANGE_OPTIONS = [
  '더 나빠졌어요',
  '비슷해요',
  '개선됐어요',
] as const;

type SurveyFormData = {
  healthChange: string;
  improvements: string[];
  additionalFeedback: string;
};

// API 요청 타입 (실제 API 스펙에 맞게 수정)
type HealthSurveyRequest = {
  issueCode: string; // H01: 건강 변화 선택
  effectCodes: string[]; // H02: 개선 사항들
  additionalNote: string; // 추가 피드백
};

// API 응답 타입
type HealthSurveyResponse = {
  success: boolean;
  message: string;
};

export function WeeklySurveyBottomSheet() {
  const token = tokenUtils.getToken();
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, setValue, watch } = useForm<SurveyFormData>({
    defaultValues: {
      additionalFeedback: '',
      healthChange: '',
      improvements: [],
    },
  });

  const watchedValues = watch([
    'healthChange',
    'improvements',
    'additionalFeedback',
  ]);
  const [watchedHealthChange, watchedImprovements, watchedAdditionalFeedback] =
    watchedValues;

  const handleOptionToggle = (option: string) => {
    const newImprovements = watchedImprovements.includes(option)
      ? watchedImprovements.filter(item => item !== option)
      : [...watchedImprovements, option];
    setValue('improvements', newImprovements);
  };

  const handleHealthChangeSelect = (option: string) => {
    setValue('healthChange', option);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // API 호출 함수 (실제 API 엔드포인트에 맞게 수정)
  const submitHealthSurvey = async (
    data: HealthSurveyRequest
  ): Promise<HealthSurveyResponse> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/health-survey`,
        {
          body: JSON.stringify(data),
          headers: {
            // TODO: 인증 토큰이 필요한 경우 추가
            Authorization: `Bearer ${token}`,
          },
          method: 'POST',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ?? `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Health Survey API Error:', error);
      throw error;
    }
  };

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true);

    try {
      // form 데이터를 API 형식으로 변환
      // TODO : 데이터 수정 필요
      const apiData: HealthSurveyRequest = {
        additionalNote: data.additionalFeedback || '', // 추가 피드백 (빈 문자열로 기본값 설정)
        effectCodes: data.improvements, // H02: 개선 사항들
        issueCode: data.healthChange, // H01: 건강 변화 선택
      };

      // API 호출
      const result = await submitHealthSurvey(apiData);

      if (result.success) {
        // 성공 시 바텀시트 닫기
        handleClose();
      } else {
        console.error('설문 제출 실패:', result.message);
        // TODO: 에러 토스트 표시
      }
    } catch (error) {
      console.error('설문 제출 중 오류 발생:', error);
      // TODO: 에러 토스트 표시
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="mx-auto w-full max-w-[430px]">
        <VisuallyHidden asChild>
          <DrawerTitle>어제 드신 메뉴 어떠셨나요?</DrawerTitle>
        </VisuallyHidden>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="overflow-y-auto px-6">
            {/* 헤더 - 상단에 고정 */}
            <header className="sticky top-0 z-10 -mx-4 flex justify-end bg-white px-4">
              <DrawerClose
                type="button"
                className="rounded-full p-1.5"
                aria-label="리뷰 리마인드 바텀시트 닫기"
              >
                <CloseIcon size={24} color="#626A7A" />
                <span className="sr-only">닫기</span>
              </DrawerClose>
            </header>

            {/* 메인 컨텐츠 영역 */}
            <main className="mt-2">
              {/* 리뷰 요청 섹션 */}
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
              <div className="mt-6 h-0 w-[390px] border-t border-dashed border-gray-300" />
              <div className="mt-6 flex items-center">
                <div className="w-full">
                  <section>
                    <h2 className="text-18sb text-gray-900">
                      평소 건강 문제에 변화가 있었나요?
                    </h2>
                    <div className="mt-2 flex gap-2">
                      {HEALTH_CHANGE_OPTIONS.map(option => (
                        <Button
                          key={option}
                          variant="outline"
                          size="full"
                          type="button"
                          onClick={() => handleHealthChangeSelect(option)}
                          className={`text-15sb rounded-[10px] border p-3 ${
                            watchedHealthChange === option
                              ? 'border-secondary-soft-green bg-secondary-light-green text-primary'
                              : 'border-gray-300 text-gray-600'
                          }`}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </section>
                  <section className="mt-6">
                    <h2 className="text-18sb mb-6 text-gray-800">
                      어떤 점이 개선되었나요?(다중선택)
                    </h2>

                    {HEALTH_IMPROVEMENT_OPTIONS.map(option => (
                      <div
                        key={option}
                        className="flex cursor-pointer items-center gap-3 py-[10px]"
                        onClick={() => handleOptionToggle(option)}
                      >
                        <CheckboxIcon
                          isSelected={watchedImprovements.includes(option)}
                        />
                        <span className="text-base text-[#000000]/96">
                          {option}
                        </span>
                      </div>
                    ))}

                    <div className="relative">
                      <textarea
                        {...register('additionalFeedback')}
                        value={watchedAdditionalFeedback}
                        placeholder="구체적으로 느낀 변화를 적어주세요!"
                        className="text-17 w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-600 placeholder:text-gray-400 focus:border-[#68982d] focus:outline-none"
                        rows={3}
                      />

                      <div className="textarea-gradient-overlay pointer-events-none absolute right-0 bottom-0 left-0 h-6 rounded-b-xl" />
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>

          {/* 설문완료 버튼 - 하단 고정 */}
          <div className="sticky bottom-0 bg-white px-[30px] pt-0 pb-[34px]">
            <Button
              type="submit"
              disabled={
                !watchedHealthChange ||
                watchedImprovements.length === 0 ||
                isSubmitting
              }
              className="text-17sb w-full rounded-full bg-[#68982d] py-4 text-white hover:bg-[#5a7a26] disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isSubmitting ? '제출 중...' : '설문완료'}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

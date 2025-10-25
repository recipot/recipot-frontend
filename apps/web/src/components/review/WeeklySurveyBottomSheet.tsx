'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import axios from 'axios';

import { Button } from '../common/Button';
import { CloseIcon } from '../Icons';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '../ui/drawer';
import { ImprovementOptions } from './ImprovementOptions';

// API에서 가져온 데이터로 대체될 예정이므로 임시로 유지
// API 응답과 동일한 객체 형태로 변경하여 일관성 유지
const HEALTH_IMPROVEMENT_OPTIONS = [
  { code: 'H02001', codeName: '피로가 줄었다' },
  { code: 'H02002', codeName: '몸이 가벼워 졌다' },
  { code: 'H02003', codeName: '속이 편했다' },
  { code: 'H02004', codeName: '체중 관리에 도움이 된다' },
  { code: 'H02005', codeName: '기타' },
] as const;

const HEALTH_CHANGE_OPTIONS = [
  { code: 'H01001', codeName: '더 나빠졌어요' },
  { code: 'H01002', codeName: '비슷해요' },
  { code: 'H01003', codeName: '개선됐어요' },
] as const;

const HEALTH_CHANGE_OPTIONS_ARRAY = [...HEALTH_CHANGE_OPTIONS];
const HEALTH_IMPROVEMENT_OPTIONS_ARRAY = [...HEALTH_IMPROVEMENT_OPTIONS];

type SurveyFormData = {
  healthChange: string;
  improvements: string[];
  additionalFeedback: string;
};

// API 준비 데이터 타입
type HealthSurveyPreparationResponse = {
  persistentIssueOption: {
    code: string;
    codeName: string;
  }[];
  effectOptions: {
    code: string;
    codeName: string;
  }[];
};

// API 요청 타입 (실제 API 스펙에 맞게 수정)
type HealthSurveyRequest = {
  persistentIssueCode: string; // H01: 건강 변화 선택
  effectCodes: string[]; // H02: 개선 사항들
  additionalNote: string; // 추가 피드백
};

// API 응답 타입
type HealthSurveyResponse = {
  status: number;
  data: {
    surveyId: number;
  };
};

// API 호출 함수들
const getAuthToken = async (): Promise<string> => {
  const {
    data: {
      data: { accessToken },
    },
  } = await axios.post(`api/v1/auth/debug`, {
    role: 'user',
    userId: 1,
  });
  return accessToken;
};

const getEligibilityData = async (token: string) => {
  const {
    data: {
      data: { isEligible, recentCompletionCount },
    },
  } = await axios.get(`api/v1/health-survey/eligibility`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { isEligible, recentCompletionCount };
};

const getHealthSurveyPreparation = async (
  token: string
): Promise<HealthSurveyPreparationResponse> => {
  const { data } = await axios.get(`api/v1/health-survey/preparation`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const submitHealthSurvey = async (
  data: HealthSurveyRequest,
  token: string
): Promise<HealthSurveyResponse> => {
  const { data: responseData } = await axios.post(
    `api/v1/health-survey`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return responseData;
};

// 유틸리티 함수들
const IMPROVEMENT_CODE = 'H01003'; // 개선됐어요 코드

const isImprovementSelected = (healthChange: string): boolean => {
  return healthChange === IMPROVEMENT_CODE;
};

const shouldShowImprovementSection = (healthChange: string): boolean => {
  return isImprovementSelected(healthChange);
};

const isSubmitDisabled = (
  isEligible: boolean,
  recentCompletionCount: number,
  healthChange: string,
  improvements: string[],
  isSubmitting: boolean
): boolean => {
  return (
    isEligible === false ||
    recentCompletionCount >= 1 ||
    !healthChange ||
    (isImprovementSelected(healthChange) && improvements.length === 0) ||
    isSubmitting
  );
};

// 옵션 렌더링 컴포넌트
const HealthChangeOptions = ({
  onSelect,
  options,
  selectedValue,
}: {
  options: Array<{ code: string; codeName: string }>;
  onSelect: (value: string) => void;
  selectedValue: string;
}) => (
  <div className="mt-2 flex gap-2">
    {options.map(option => {
      const optionText = option.codeName;
      const optionValue = option.code;

      return (
        <Button
          key={optionValue}
          variant="outline"
          size="full"
          type="button"
          onClick={() => onSelect(optionValue)}
          className={`text-15sb rounded-[10px] border p-3 ${
            selectedValue === optionValue
              ? 'border-secondary-soft-green bg-secondary-light-green text-primary'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          {optionText}
        </Button>
      );
    })}
  </div>
);

export function WeeklySurveyBottomSheet() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [preparationData, setPreparationData] =
    useState<HealthSurveyPreparationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [recentCompletionCount, setRecentCompletionCount] = useState(0);

  // 토큰 가져오기
  useEffect(() => {
    const initializeToken = async () => {
      try {
        const authToken = await getAuthToken();
        setToken(authToken);
      } catch (error) {
        console.error('토큰 가져오기 실패:', error);
      }
    };
    initializeToken();
  }, []);

  // 자격 확인 및 준비 데이터 가져오기
  useEffect(() => {
    const initializeData = async () => {
      if (!token) return;

      try {
        setLoading(true);

        // 병렬로 자격 확인과 준비 데이터 가져오기
        const [eligibilityData, preparationData] = await Promise.all([
          getEligibilityData(token),
          getHealthSurveyPreparation(token),
        ]);

        setIsEligible(eligibilityData.isEligible);
        setRecentCompletionCount(eligibilityData.recentCompletionCount);
        setPreparationData(preparationData);
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [token]);

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

  const onSubmit = async (data: SurveyFormData) => {
    if (!token) {
      console.error('토큰이 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      // form 데이터를 API 형식으로 변환
      const apiData: HealthSurveyRequest = {
        additionalNote: data.additionalFeedback || '',
        effectCodes: data.improvements,
        persistentIssueCode: data.healthChange,
      };

      // API 호출
      const result = await submitHealthSurvey(apiData, token);

      if (result.status === 200) {
        handleClose();
      } else {
        console.error('설문 제출 실패:', result);
        // TODO: 에러 토스트 표시
      }
    } catch (error: unknown) {
      console.error('설문 제출 중 오류 발생:', error);

      if (error instanceof Error && isEligible === false) {
        console.error('현재는 건강 설문을 작성할 수 없습니다.');
      }
      // TODO: 에러 토스트 표시
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
                    <HealthChangeOptions
                      options={
                        preparationData?.persistentIssueOption ??
                        HEALTH_CHANGE_OPTIONS_ARRAY
                      }
                      onSelect={handleHealthChangeSelect}
                      selectedValue={watchedHealthChange}
                    />
                  </section>
                  {/* 개선됐어요가 선택되었을 때만 다중선택 영역 표시 */}
                  {shouldShowImprovementSection(watchedHealthChange) && (
                    <section className="mt-6">
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
                          {...register('additionalFeedback')}
                          value={watchedAdditionalFeedback}
                          placeholder="구체적으로 느낀 변화를 적어주세요!"
                          className="text-17 w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-600 placeholder:text-gray-400 focus:border-[#68982d] focus:outline-none"
                          rows={3}
                        />
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </main>
          </div>

          {/* 선택 전 또는 개선됐어요가 아닌 경우에만 표시되는 여백 */}
          {(!watchedHealthChange ||
            !shouldShowImprovementSection(watchedHealthChange)) && (
            <div className="h-[257px]" />
          )}

          {/* 설문완료 버튼 - 하단 고정 */}
          <div className="sticky bottom-0 bg-white px-[30px] pt-0 pb-[34px]">
            <Button
              type="submit"
              disabled={isSubmitDisabled(
                isEligible,
                recentCompletionCount,
                watchedHealthChange,
                watchedImprovements,
                isSubmitting
              )}
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

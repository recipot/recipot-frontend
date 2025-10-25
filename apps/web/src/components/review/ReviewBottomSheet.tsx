'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { tokenUtils } from '@recipot/api';
import axios from 'axios';
import Image from 'next/image';

import { moodToConditionId } from '@/app/onboarding/_utils';
import { useCookStateStepData } from '@/stores';
// import Image from 'next/image';
import type {
  ReviewBottomSheetProps,
  ReviewData,
  ReviewFormData,
} from '@/types/review.types';

import { Button } from '../common/Button';
import { CloseIcon } from '../Icons';
import { Drawer, DrawerContent, DrawerTitle } from '../ui/drawer';
import { EmotionSection } from './EmotionSection';

// API에서 받은 데이터를 사용하므로 하드코딩된 옵션 제거

// UI용 매핑 객체 - 이미지 디자인에 맞는 텍스트로 변환
const UI_TEXT_MAPPING: Record<string, string> = {
  // 맛 관련
  R03001: '별로예요',
  R03002: '그저그래요',
  R03003: '맛있어요',

  // 시작하기 관련
  R04001: '힘들어요',
  R04002: '적당해요',
  R04003: '쉬워요',

  // 직접 요리해보니 관련
  R05001: '어려워요',
  R05002: '적당해요',
  R05003: '간단해요',
};

export function ReviewBottomSheet({ isOpen, onClose }: ReviewBottomSheetProps) {
  const [conditionId, setConditionId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  const cookStateData = useCookStateStepData();

  useEffect(() => {
    if (cookStateData) {
      const conditionId = moodToConditionId(cookStateData.mood);
      setConditionId(conditionId);
    }
  }, [cookStateData]);

  const token = tokenUtils.getToken();

  // v1/conditions API 호출하여 conditionId 가져오기
  useEffect(() => {
    const getCondition = async () => {
      if (!token) {
        return;
      }

      try {
        setIsLoading(true);

        const {
          data: {
            data: { conditions },
          },
        } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/conditions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConditionId(conditions[0]?.id ?? 0);
      } catch (error) {
        console.error('💥 Conditions API 호출 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getCondition();
  }, [token]); // token이 변경될 때만 실행

  // v1/reviews/preparation API 호출
  useEffect(() => {
    const getReviewData = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/reviews/preparation?completedRecipeId=${conditionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviewData(res.data.data);
      } catch (error) {
        console.error('💥 Reviews preparation API 호출 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getReviewData();
  }, [token, conditionId]);

  const { handleSubmit, register, setValue, watch } = useForm<ReviewFormData>({
    defaultValues: {
      completedRecipeId: conditionId,
      content: '',
      difficultyOption: null,
      experienceOption: null,
      tasteOption: null,
    },
    mode: 'onChange',
  });

  const watchedTasteOption = watch('tasteOption');
  const watchedDifficultyOption = watch('difficultyOption');
  const watchedExperienceOption = watch('experienceOption');
  const watchedContent = watch('content');

  // conditionId가 변경될 때 폼의 completedRecipeId도 업데이트
  useEffect(() => {
    if (conditionId > 0) {
      setValue('completedRecipeId', conditionId);
    }
  }, [conditionId, setValue]);

  // 폼 유효성 검사
  const isFormValid =
    watchedTasteOption !== null &&
    watchedDifficultyOption !== null &&
    watchedExperienceOption !== null &&
    watchedContent?.trim();

  const handleEmotionSelect = (
    type: 'taste' | 'difficulty' | 'experience',
    value: string
  ) => {
    if (!reviewData) return;

    const fieldMap = {
      difficulty: 'difficultyOption',
      experience: 'experienceOption',
      taste: 'tasteOption',
    } as const;

    const optionsMap = {
      difficulty: reviewData.difficultyOptions,
      experience: reviewData.experienceOptions,
      taste: reviewData.tasteOptions,
    } as const;

    const field = fieldMap[type];
    const options = optionsMap[type];
    const selectedOption = options.find(option => option.code === value);

    if (selectedOption) {
      const currentValue = watch(field);
      // 토글: 같은 값 클릭 시 선택 해제, 다른 값 클릭 시 교체
      setValue(field, currentValue?.code === value ? null : selectedOption);
    }
  };

  const onFormSubmit = async (data: ReviewFormData) => {
    if (!reviewData) return;

    const { content, difficultyOption, experienceOption, tasteOption } = data;

    const submitData = {
      completedRecipeId: conditionId,
      completionCount: reviewData.completionCount,
      completionMessage: reviewData.completionMessage,
      content,
      difficultyOptions: difficultyOption ? [difficultyOption] : [],
      experienceOptions: experienceOption ? [experienceOption] : [],
      recipeImageUrl: reviewData.recipeImageUrl,
      recipeName: reviewData.recipeName,
      tasteOptions: tasteOption ? [tasteOption] : [],
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/reviews`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.info('리뷰 제출 결과:', res.data);
      onClose(); // 성공 시 모달 닫기
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
    }
  };

  // 닫기 기능을 컴포넌트 내부에서만 제어
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer open={isOpen}>
      <DrawerContent className="mx-auto w-full max-w-[430px]">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <VisuallyHidden asChild>
            <DrawerTitle>후기 등록하기</DrawerTitle>
          </VisuallyHidden>
          <div className="rounded-t-2xl px-4 pb-6">
            {/* 헤더 - 상단에 고정 */}
            <div className="sticky top-0 z-10 -mx-4 flex justify-end bg-white px-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5"
              >
                <CloseIcon size={24} />
              </button>
            </div>

            {/* 컨텐츠 영역 */}
            <div>
              {/* 로딩 및 에러 상태 표시 */}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">
                    데이터를 불러오는 중...
                  </div>
                </div>
              )}

              {/* 레시피 정보 */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                  {reviewData?.recipeImageUrl ? (
                    <Image
                      src={reviewData.recipeImageUrl}
                      alt={reviewData.recipeName}
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="h-7 w-7 rounded bg-gray-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-15 text-gray-600">
                    {reviewData?.completionCount}번째 레시피 해먹기 완료!
                  </p>
                  <h2 className="text-20 truncate text-gray-900">
                    {reviewData?.recipeName}
                  </h2>
                </div>
              </div>

              {/* 감정 선택 섹션 */}
              {reviewData && (
                <div>
                  {[
                    {
                      options: reviewData.tasteOptions,
                      title: '요리의 맛은 어땠나요?',
                      type: 'taste' as const,
                      value: watchedTasteOption,
                    },
                    {
                      options: reviewData.difficultyOptions,
                      title: '요리를 시작하기가 어땠나요?',
                      type: 'difficulty' as const,
                      value: watchedDifficultyOption,
                    },
                    {
                      options: reviewData.experienceOptions,
                      title: '직접 요리해보니 어땠나요?',
                      type: 'experience' as const,
                      value: watchedExperienceOption,
                    },
                  ].map(section => (
                    <EmotionSection
                      key={section.type}
                      title={section.title}
                      options={section.options}
                      selectedValue={section.value?.code ?? null}
                      onSelect={value =>
                        handleEmotionSelect(section.type, value)
                      }
                      uiTextMapping={UI_TEXT_MAPPING}
                    />
                  ))}
                </div>
              )}

              {/* 코멘트 입력 */}
              <div className="textarea-container mb-[13px]">
                <p className="text-18sb mb-2 text-gray-900">
                  기타 의견이 있어요!
                </p>
                <textarea
                  {...register('content')}
                  placeholder="내용을 입력해 주세요"
                  className="text-17 w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-[#68982d] focus:outline-none"
                  maxLength={200}
                />
              </div>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                disabled={!isFormValid}
                className="px-8 py-[15px]"
                size="full"
              >
                후기 등록하기
              </Button>
            </div>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

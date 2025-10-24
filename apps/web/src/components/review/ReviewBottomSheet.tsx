'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { debugAuth } from '@recipot/api';
import axios from 'axios';
import Image from 'next/image';

// import Image from 'next/image';
import type {
  ReviewBottomSheetProps,
  ReviewData,
  ReviewFormData,
} from '@/types/review.types';

import { Button } from '../common/Button';
import { CloseIcon } from '../Icons';
import { Drawer, DrawerContent, DrawerTitle } from '../ui/drawer';
import { Textarea } from '../ui/textarea';
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
  const [token, setToken] = useState<string | null>(null);
  const [conditionId, setConditionId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  // 토큰 생성 - 에러 처리 개선
  useEffect(() => {
    const getToken = async () => {
      try {
        setIsLoading(true);
        setTokenError(null);

        const tokenResponse = await debugAuth.generateDebugToken({
          role: 'user',
          userId: 1,
        });

        setToken(tokenResponse.accessToken);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setTokenError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getToken();
  }, []);

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
        console.info(conditions, 'conditions');

        setConditionId(conditions[0]?.id ?? 0);
      } catch (error) {
        console.error('💥 Conditions API 호출 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getCondition();
  }, [token, conditionId]); // token이 변경될 때만 실행

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
      difficultyOptions: [],
      experienceOptions: [],
      tasteOptions: [],
    },
    mode: 'onChange',
  });

  const watchedTasteOptions = watch('tasteOptions');
  const watchedDifficultyOptions = watch('difficultyOptions');
  const watchedExperienceOptions = watch('experienceOptions');
  const watchedContent = watch('content');

  // conditionId가 변경될 때 폼의 completedRecipeId도 업데이트
  useEffect(() => {
    if (conditionId > 0) {
      setValue('completedRecipeId', conditionId);
    }
  }, [conditionId, setValue]);

  // 폼 유효성 검사
  const isFormValid =
    watchedTasteOptions.length > 0 &&
    watchedDifficultyOptions.length > 0 &&
    watchedExperienceOptions.length > 0 &&
    watchedContent.trim();

  const handleEmotionSelect = (type: string, value: string) => {
    if (!reviewData) return;

    // 선택된 옵션을 찾아서 배열에 추가/제거
    if (type === 'taste') {
      const selectedOption = reviewData.tasteOptions.find(
        option => option.code === value
      );
      if (selectedOption) {
        const currentOptions = watchedTasteOptions;
        const isSelected = currentOptions.some(option => option.code === value);

        if (isSelected) {
          // 이미 선택된 경우 제거
          setValue(
            'tasteOptions',
            currentOptions.filter(option => option.code !== value)
          );
        } else {
          // 선택되지 않은 경우 추가
          setValue('tasteOptions', [...currentOptions, selectedOption]);
        }
      }
    } else if (type === 'difficulty') {
      const selectedOption = reviewData.difficultyOptions.find(
        option => option.code === value
      );
      if (selectedOption) {
        const currentOptions = watchedDifficultyOptions;
        const isSelected = currentOptions.some(option => option.code === value);

        if (isSelected) {
          setValue(
            'difficultyOptions',
            currentOptions.filter(option => option.code !== value)
          );
        } else {
          setValue('difficultyOptions', [...currentOptions, selectedOption]);
        }
      }
    } else if (type === 'experience') {
      const selectedOption = reviewData.experienceOptions.find(
        option => option.code === value
      );
      if (selectedOption) {
        const currentOptions = watchedExperienceOptions;
        const isSelected = currentOptions.some(option => option.code === value);

        if (isSelected) {
          setValue(
            'experienceOptions',
            currentOptions.filter(option => option.code !== value)
          );
        } else {
          setValue('experienceOptions', [...currentOptions, selectedOption]);
        }
      }
    }
  };

  const onFormSubmit = async (data: ReviewFormData) => {
    if (!reviewData) return;

    const { content, difficultyOptions, experienceOptions, tasteOptions } =
      data;

    const submitData = {
      data: {
        completedRecipeId: conditionId,
        completionCount: reviewData.completionCount,
        completionMessage: reviewData.completionMessage,
        content,
        difficultyOptions,
        experienceOptions,
        recipeImageUrl: reviewData.recipeImageUrl,
        recipeName: reviewData.recipeName,
        tasteOptions,
      },
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
            <div className="space-y-6">
              {/* 로딩 및 에러 상태 표시 */}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">
                    데이터를 불러오는 중...
                  </div>
                </div>
              )}

              {tokenError && (
                <div className="rounded-lg bg-red-50 p-3">
                  <div className="text-sm text-red-600">{tokenError}</div>
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
                <div className="">
                  <EmotionSection
                    title="요리의 맛은 어땠나요?"
                    options={reviewData.tasteOptions}
                    selectedValue={
                      watchedTasteOptions.length > 0
                        ? watchedTasteOptions[0].code
                        : null
                    }
                    onSelect={value => handleEmotionSelect('taste', value)}
                    uiTextMapping={UI_TEXT_MAPPING}
                  />

                  <EmotionSection
                    title="요리를 시작하기가 어땠나요?"
                    options={reviewData.difficultyOptions}
                    selectedValue={
                      watchedDifficultyOptions.length > 0
                        ? watchedDifficultyOptions[0].code
                        : null
                    }
                    onSelect={value => handleEmotionSelect('difficulty', value)}
                    uiTextMapping={UI_TEXT_MAPPING}
                  />

                  <EmotionSection
                    title="직접 요리해보니 어땠나요?"
                    options={reviewData.experienceOptions}
                    selectedValue={
                      watchedExperienceOptions.length > 0
                        ? watchedExperienceOptions[0].code
                        : null
                    }
                    onSelect={value => handleEmotionSelect('experience', value)}
                    uiTextMapping={UI_TEXT_MAPPING}
                  />
                </div>
              )}

              {/* 코멘트 입력 */}
              <div className="mb-[13px]">
                <p className="text-18sb mb-2 text-gray-900">
                  기타 의견이 있어요!
                </p>
                <Textarea
                  {...register('content')}
                  placeholder="내용을 입력해 주세요"
                  className="text-17 min-h-[100px] w-full text-ellipsis text-gray-600"
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

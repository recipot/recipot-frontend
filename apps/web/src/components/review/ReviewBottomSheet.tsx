'use client';

import './styles.css';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { recipe } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { isProduction } from '@/lib/env';
import { useApiErrorModalStore } from '@/stores';
import type {
  ReviewBottomSheetProps,
  ReviewData,
  ReviewFormData,
} from '@/types/review.types';

import { Button } from '../common/Button';
import { CloseIcon } from '../Icons';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '../ui/drawer';
import {
  EMOTION_SECTIONS,
  EMOTION_TO_FORM_FIELD_MAP,
  EMOTION_TO_REVIEW_DATA_OPTIONS_MAP,
  type EmotionSectionType,
  UI_TEXT_MAPPING,
} from './constants';
import { EmotionSection } from './EmotionSection';
import ReviewCompleteModal from './ReviewCompleteModal';
import { ReviewRecipeInfo } from './ReviewRecipeInfo';

const TEXT_AREA_MAX_LENGTH = 200;

export function ReviewBottomSheet({
  isOpen,
  onClose,
  recipeId,
}: ReviewBottomSheetProps) {
  const queryClient = useQueryClient();
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const { token } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // v1/reviews/preparation API 호출 - 바텀시트가 열릴 때만 데이터 로드
  useEffect(() => {
    // isOpen이 false이면 데이터를 초기화하고 리턴
    if (!isOpen) {
      setReviewData(null);
      return;
    }

    // recipeId가 없으면 리턴
    if (!recipeId) {
      return;
    }

    // 프로덕션 환경에서는 쿠키 인증을 사용하므로 token 체크를 건너뛰고,
    // 개발 환경에서는 token이 필요함
    if (!isProduction && !token) {
      return;
    }

    const getReviewData = async () => {
      try {
        const res = await recipe.getCompletedRecipeDetail(recipeId);
        setReviewData(res);
      } catch {
        useApiErrorModalStore.getState().showError({
          message: '레시피 상세 정보를 불러올 수 없습니다.',
        });
      }
    };

    getReviewData();
  }, [isOpen, token, recipeId]);

  const formMethods = useForm<ReviewFormData>({
    defaultValues: {
      completedRecipeId: recipeId,
      content: '',
      difficultyOption: null,
      experienceOption: null,
      tasteOption: null,
    },
    mode: 'onChange',
  });

  const { handleSubmit, register, setValue, watch } = formMethods;
  const contentRegister = register('content');

  // const watchedTasteOption = watch('tasteOption');
  // const watchedDifficultyOption = watch('difficultyOption');
  // const watchedExperienceOption = watch('experienceOption');

  const watchOptions = watch([
    'tasteOption',
    'difficultyOption',
    'experienceOption',
  ]);

  // 감정 섹션 데이터 생성
  const createEmotionSections = () => {
    if (!reviewData) return [];

    const optionsByType = {
      difficulty: reviewData.difficultyOptions,
      experience: reviewData.experienceOptions,
      taste: reviewData.tasteOptions,
    };

    const valuesByType = {
      difficulty: watchOptions[1],
      experience: watchOptions[2],
      taste: watchOptions[0],
    };

    return EMOTION_SECTIONS.map(section => ({
      ...section,
      options: optionsByType[section.type],
      value: valuesByType[section.type],
    }));
  };

  const emotionSections = createEmotionSections();

  // recipeId가 변경될 때 폼의 completedRecipeId도 업데이트
  useEffect(() => {
    if (recipeId > 0) {
      setValue('completedRecipeId', recipeId);
    }
  }, [recipeId, setValue]);

  // 폼 유효성 검사
  const isFormValid =
    watchOptions[0] !== null &&
    watchOptions[1] !== null &&
    watchOptions[2] !== null;

  // textarea ref 콜백 함수
  const handleTextareaRef = (element: HTMLTextAreaElement | null) => {
    contentRegister.ref(element);
    textareaRef.current = element;
  };

  // 모든 항목이 선택되었을 때 textarea로 부드럽게 스크롤
  useEffect(() => {
    if (isFormValid && textareaRef.current) {
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isFormValid]);

  const handleEmotionSelect = (type: EmotionSectionType, value: string) => {
    if (!reviewData) return;

    // 타입 안전한 매핑 사용
    const field = EMOTION_TO_FORM_FIELD_MAP[type];
    const optionsKey = EMOTION_TO_REVIEW_DATA_OPTIONS_MAP[type];
    const options = reviewData[optionsKey];
    const selectedOption = options.find(
      (option: { code: string }) => option.code === value
    );

    if (selectedOption) {
      const currentValue = watch(field);
      // 토글: 같은 값 클릭 시 선택 해제, 다른 값 클릭 시 교체
      setValue(field, currentValue?.code === value ? null : selectedOption);
    }
  };

  const onFormSubmit = async (data: ReviewFormData) => {
    if (!reviewData) return;

    const { completionCount, completionMessage } = reviewData;

    const { content, difficultyOption, experienceOption, tasteOption } = data;

    const submitData = {
      completedRecipeId: recipeId,
      completionCount,
      completionMessage,
      content,
      difficultyCode: difficultyOption?.code,
      experienceCode: experienceOption?.code,
      tasteCode: tasteOption?.code,
    };

    try {
      await recipe.postRecipeReview(submitData);
      queryClient.invalidateQueries({ queryKey: ['completed-recipes'] });
      setIsCompleteModalOpen(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        useApiErrorModalStore.getState().showError({
          message:
            error.message ?? '레시피 완료 후에만 후기를 작성할 수 있습니다.',
        });
      }
      if (error instanceof AxiosError && error.response?.status === 409) {
        useApiErrorModalStore.getState().showError({
          message:
            error.message ?? '이미 해당 레시피에 대한 후기를 작성했습니다.',
        });
      }
    }
  };

  return (
    <Drawer open={isOpen}>
      <DrawerContent className="mx-auto flex w-full flex-col">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col overflow-y-auto"
        >
          <VisuallyHidden asChild>
            <DrawerTitle>후기 등록하기</DrawerTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DrawerDescription>
              레시피에 대한 맛, 난이도, 경험 등을 평가하고 의견을 남겨주세요.
            </DrawerDescription>
          </VisuallyHidden>
          <div className="flex flex-col overflow-hidden">
            <div className="px-4 pb-6">
              {/* 헤더 - 상단에 고정 */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5"
                >
                  <CloseIcon size={24} />
                </button>
              </div>

              {/* 레시피 정보 - 데이터가 로드된 후에만 표시 */}
              {reviewData && <ReviewRecipeInfo reviewData={reviewData} />}
            </div>
            {reviewData && (
              <>
                <div className="mb-6 h-0 border-t border-dashed border-gray-300" />
                {/* 스크롤 가능한 영역 - 선택 항목 및 의견 작성 */}
                <div className="overflow-y-auto px-4">
                  {/* 감정 선택 섹션 */}
                  {emotionSections.map(({ options, title, type, value }) => (
                    <EmotionSection
                      key={type}
                      title={title}
                      options={options}
                      selectedValue={value?.code ?? null}
                      onSelect={value => handleEmotionSelect(type, value)}
                      uiTextMapping={UI_TEXT_MAPPING}
                    />
                  ))}

                  {/* 코멘트 입력 */}
                  <div className="textarea-container mb-[13px]">
                    <p className="text-18sb mb-2 text-gray-900">
                      기타 의견이 있어요!
                    </p>
                    <textarea
                      {...contentRegister}
                      ref={handleTextareaRef}
                      placeholder="내용을 입력해 주세요"
                      className="text-17 w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-[#68982d] focus:outline-none"
                      maxLength={TEXT_AREA_MAX_LENGTH}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 그라데이션 - 버튼 바로 위 */}
            <div className="review-bottom-sheet-gradient" />

            {/* 제출 버튼 - 하단 고정 - 데이터가 로드된 후에만 표시 */}
            {reviewData && (
              <div className="px-4 pt-4 pb-4">
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="px-8 py-[15px]"
                  size="full"
                >
                  후기 등록하기
                </Button>
              </div>
            )}
          </div>
        </form>
        <ReviewCompleteModal
          open={isCompleteModalOpen}
          onOpenChange={setIsCompleteModalOpen}
          onConfirm={onClose}
        />
      </DrawerContent>
    </Drawer>
  );
}

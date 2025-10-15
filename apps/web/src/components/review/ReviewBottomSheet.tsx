'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Image from 'next/image';

import type {
  EmotionRating,
  ReviewBottomSheetProps,
  ReviewFormData,
} from '@/types/review.types';

import { Button } from '../common/Button';
import { Drawer, DrawerClose, DrawerContent } from '../ui/drawer';
import { Textarea } from '../ui/textarea';
import { EmotionSection } from './EmotionSection';

const EMOTION_OPTIONS = {
  difficulty: [
    { label: '쉬워요', value: 'easy' },
    { label: '적당해요', value: 'medium' },
    { label: '힘들어요', value: 'hard' },
  ],
  experience: [
    { label: '간단해요', value: 'easy' },
    { label: '적당해요', value: 'medium' },
    { label: '어려워요', value: 'hard' },
  ],
  taste: [
    { label: '맛있어요', value: 'good' },
    { label: '그저그래요', value: 'neutral' },
    { label: '별로예요', value: 'bad' },
  ],
};

export function ReviewBottomSheet({
  isOpen,
  onClose,
  onSubmit,
  reviewData,
}: ReviewBottomSheetProps) {
  const { handleSubmit, register, setValue, watch } = useForm<ReviewFormData>({
    defaultValues: {
      comment: '',
      emotions: {
        difficulty: null,
        experience: null,
        taste: null,
      },
    },
    mode: 'onChange',
  });

  const watchedEmotions = watch('emotions');

  const handleEmotionSelect = (type: keyof EmotionRating, value: string) => {
    setValue(`emotions.${type}`, value as EmotionRating[keyof EmotionRating], {
      shouldValidate: true,
    });
  };

  const onFormSubmit = (data: ReviewFormData) => {
    onSubmit(data);
  };

  const isFormValid =
    watchedEmotions.taste &&
    watchedEmotions.difficulty &&
    watchedEmotions.experience;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="mx-auto w-full max-w-[430px]">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="overflow-y-auto px-4 pb-6">
            {/* 헤더 - 상단에 고정 */}
            <div className="sticky top-0 z-10 -mx-4 flex justify-end bg-white px-4 py-3">
              <DrawerClose
                type="button"
                className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
                <span className="sr-only">닫기</span>
              </DrawerClose>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="space-y-6">
              {/* 레시피 정보 */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                  {reviewData.recipeImage ? (
                    <Image
                      src={reviewData.recipeImage}
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
                    {reviewData.completionCount}번째 레시피 해먹기 완료!
                  </p>
                  <h2 className="text-20 truncate text-gray-900">
                    {reviewData.recipeName}
                  </h2>
                </div>
              </div>

              {/* 감정 선택 섹션 */}
              <div className="">
                <EmotionSection
                  title="요리의 맛은 어땠나요?"
                  options={EMOTION_OPTIONS.taste}
                  selectedValue={watchedEmotions.taste}
                  onSelect={value => handleEmotionSelect('taste', value)}
                />

                <EmotionSection
                  title="요리를 시작하기가 어땠나요?"
                  options={EMOTION_OPTIONS.difficulty}
                  selectedValue={watchedEmotions.difficulty}
                  onSelect={value => handleEmotionSelect('difficulty', value)}
                />

                <EmotionSection
                  title="직접 요리해보니 어땠나요?"
                  options={EMOTION_OPTIONS.experience}
                  selectedValue={watchedEmotions.experience}
                  onSelect={value => handleEmotionSelect('experience', value)}
                />

                {/* 코멘트 입력 */}
                <div className="mb-[13px]">
                  <p className="text-18sb mb-2 text-gray-900">
                    기타 의견이 있어요!
                  </p>
                  <Textarea
                    {...register('comment')}
                    placeholder="내용을 입력해 주세요"
                    className="min-h-[100px] w-full"
                    maxLength={200}
                  />
                </div>
              </div>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                disabled={!isFormValid}
                className="py-4"
                size="full"
              >
                <p className="text-17sb">후기 등록하기</p>
              </Button>
            </div>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

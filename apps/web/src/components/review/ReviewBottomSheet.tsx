'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

import type {
  EmotionRating,
  ReviewBottomSheetProps,
} from '@/types/review.types';

import { Button } from '../common/Button';
import { EmotionSection } from './EmotionSection';

const EMOTION_OPTIONS = {
  cooking: [
    { label: '간단해요', value: 'easy' },
    { label: '적당해요', value: 'medium' },
    { label: '어려워요', value: 'hard' },
  ],
  difficulty: [
    { label: '쉬워요', value: 'easy' },
    { label: '적당해요', value: 'medium' },
    { label: '힘들어요', value: 'hard' },
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
  const [comment, setComment] = useState('');
  const [emotions, setEmotions] = useState<EmotionRating>({
    cooking: null,
    difficulty: null,
    taste: null,
  });

  const handleEmotionSelect = (type: keyof EmotionRating, value: string) => {
    setEmotions(prev => ({
      ...prev,
      [type]: value as EmotionRating[keyof EmotionRating],
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      comment,
      emotions,
    });
  };

  const isFormValid = emotions.taste && emotions.difficulty && emotions.cooking;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={e => {
          if (e.key === 'Escape') onClose();
        }}
        role="button"
        tabIndex={0}
      />

      {/* Bottom Sheet */}
      <div className="relative mx-auto flex max-h-[90vh] w-full max-w-[390px] flex-col rounded-t-2xl bg-white shadow-lg">
        {/* Header - 고정 */}
        <div className="flex flex-shrink-0 items-center justify-between p-6 pb-4">
          <div className="w-6" /> {/* Spacer */}
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
            aria-label="닫기"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-gray-100">
                {reviewData.recipeImage ? (
                  <Image
                    src={reviewData.recipeImage}
                    alt={reviewData.recipeName}
                    width={72}
                    height={72}
                    className="h-full w-full rounded-[18px] object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <p className="mb-1 text-[15px] text-gray-500">
                  {reviewData.completionCount}번째 레시피 해먹기 완료!
                </p>
                <h2 className="text-[20px] font-bold text-gray-900">
                  {reviewData.recipeName}
                </h2>
              </div>
            </div>

            {/* Emotion Sections */}
            <div className="space-y-8">
              <EmotionSection
                title="요리의 맛은 어땠나요?"
                options={EMOTION_OPTIONS.taste}
                selectedValue={emotions.taste}
                onSelect={value => handleEmotionSelect('taste', value)}
              />

              <EmotionSection
                title="요리를 시작하기가 어땠나요?"
                options={EMOTION_OPTIONS.difficulty}
                selectedValue={emotions.difficulty}
                onSelect={value => handleEmotionSelect('difficulty', value)}
              />

              <EmotionSection
                title="직접 요리해보니 어땠나요?"
                options={EMOTION_OPTIONS.cooking}
                selectedValue={emotions.cooking}
                onSelect={value => handleEmotionSelect('cooking', value)}
              />

              {/* Comment Section */}
              <div>
                <p className="text-18sb mb-2">기타 의견이 있어요!</p>
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="내용을 입력해 주세요"
                    className="h-[100px] w-full rounded-xl border border-gray-300 p-4 placeholder:text-gray-600"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full"
                variant={isFormValid ? 'default' : 'secondary'}
              >
                후기 제출하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

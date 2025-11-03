'use client';

import '@/components/EmotionState/styles.css';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import RecipeTags from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeTags';
import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';
import { useMoodStore } from '@/stores/moodStore';
import { getEmotionGradient } from '@/utils/emotionGradient';

import ExploreCompleteImage from '../../../public/explore.png';

export function ExploreComplete() {
  const mood = useMoodStore(state => state.mood);
  const userSelectedMood = mood ?? 'neutral';

  const router = useRouter();

  const handleGoToRecipeRecommend = () => {
    router.push('/recipeRecommend');
  };

  return (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center ${getEmotionGradient(userSelectedMood)}`}
    >
      <RecipeTags />
      <h2 className="text-22sb text-center text-gray-900">
        레시피 탐험이 끝났어요!
        <span className="text-24 ml-[2px]">&#x1F50D;</span>
      </h2>
      <Image
        src={ExploreCompleteImage}
        alt="Explore Complete"
        width={265}
        height={271}
        className="mt-[22.5px]"
      />
      <section className="mt-[34px]">
        <h3 className="text-22sb text-center text-gray-900">
          요리할 힘 살짝만 올려서
          <br />
          새로운 요리를 추천해 드릴게요
        </h3>
      </section>
      <div className="mt-[30px]">
        <Button onClick={handleGoToRecipeRecommend}>
          <CookIcon size={18} color="#ffffff" />
          다시 선택하러 가기
        </Button>
      </div>
    </div>
  );
}

'use client';

import '@/components/EmotionState/styles.css';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import RecipeHeader from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeHeader';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { CookIcon } from '@/components/Icons';
import { useMoodStore } from '@/stores/moodStore';
import { getEmotionGradient } from '@/utils/emotionGradient';

import ExploreComplete from '../../../../public/explore.png';

export default function ExploreCompletePage() {
  const mood = useMoodStore(state => state.mood);
  const userSelectedMood = mood ?? 'neutral';

  const router = useRouter();

  return (
    <>
      <RecipeHeader onRefresh={() => {}} />
      <Header.Spacer />
      <div
        className={`flex h-screen w-screen flex-col items-center justify-center ${getEmotionGradient(userSelectedMood)}`}
      >
        <h2 className="text-22sb text-center text-gray-900">
          재료 조합 탐험 완료!
          <span className="text-24 ml-[2px]">&#x1F50D;</span>
        </h2>
        <Image
          src={ExploreComplete}
          alt="Explore Complete"
          width={265}
          height={271}
          className="mt-[22.5px]"
        />
        <section className="mt-[34px]">
          <h3 className="text-22sb text-center text-gray-900">
            새로운 조합을 찾아 레시피를
            <br />더 추천받아 보세요
          </h3>
        </section>
        <div className="mt-[30px]">
          <Button onClick={() => router.push('/recipeRecommend')}>
            <CookIcon size={18} color="#ffffff" />
            다시 선택하러 가기
          </Button>
        </div>
      </div>
    </>
  );
}

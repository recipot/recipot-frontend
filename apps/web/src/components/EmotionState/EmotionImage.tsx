import Image from 'next/image';

import { cn } from '@/lib/utils';

import TiredBird from '../../../public/emotion/img-bird-bad.png';
import DefaultBird from '../../../public/emotion/img-bird-default.png';
import HappyBird from '../../../public/emotion/img-bird-good.png';
import NormalBird from '../../../public/emotion/img-bird-neutral.png';

import type { MoodType } from './EmotionState';

export default function EmotionImage({ mood }: { mood: MoodType }) {
  const getEmotionImage = (mood: MoodType) => {
    switch (mood) {
      case 'bad':
        return TiredBird;
      case 'good':
        return HappyBird;
      case 'neutral':
        return NormalBird;
      default:
        return DefaultBird;
    }
  };

  const getMessage = (mood: MoodType) => {
    switch (mood) {
      case 'bad':
        return '너도 힘들구나... 그맘알지😣\n재료만 고르면 내가 알아서 해볼게!';
      case 'neutral':
        return '그 느낌 알지... 뭔가 애매한 날...😑\n편하게 재료만 골라봐~';
      case 'good':
        return '나도 오늘 컨디션 최고야!☺️\n재료만 알려줘! 같이 요리해보자!';
      default:
        return '지금 너의 상태가 어떤지 알려줄래?\n내가 딱 맞는 요리를 찾아줄게';
    }
  };

  const getMessageStyles = (mood: MoodType) => {
    switch (mood) {
      case 'bad':
        return {
          arrow: 'after:border-t-[hsl(var(--feel-back-tired))]',
          bg: 'bg-feel-back-tired',
          text: 'text-feel-tired-text',
        };
      case 'neutral':
        return {
          arrow: 'after:border-t-[hsl(var(--feel-back-soso))]',
          bg: 'bg-feel-back-soso',
          text: 'text-feel-soso-text',
        };
      case 'good':
        return {
          arrow: 'after:border-t-[hsl(var(--feel-back-free))]',
          bg: 'bg-feel-back-free',
          text: 'text-feel-free-text',
        };
      default:
        return {
          arrow: 'after:border-t-[hsl(var(--feel-back-default))]',
          bg: 'bg-feel-back-default',
          text: 'text-primary',
        };
    }
  };
  const styles = getMessageStyles(mood);

  return (
    <>
      <div
        className={cn(
          'relative rounded-[80px] px-6 py-4',
          "after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[10px] after:border-transparent after:content-['']",
          styles.bg,
          styles.arrow
        )}
      >
        <p
          className={cn('text-17 text-center whitespace-pre-line', styles.text)}
        >
          {getMessage(mood)}
        </p>
      </div>
      <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden">
        {/* 캐릭터 - 젓가락 위에 올라감 */}
        <div className="relative z-10 before:absolute before:bottom-[-5px] before:-left-4 before:z-[-1] before:h-[74px] before:w-[320px] before:bg-[url('/emotion/img-chopsticks.png')] before:bg-contain before:bg-no-repeat before:content-['']">
          <Image
            width={180}
            height={180}
            src={getEmotionImage(mood)}
            alt="emotion"
            quality={100}
          />
        </div>
      </div>
    </>
  );
}

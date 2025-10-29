import { useAuth } from '@recipot/contexts';
import Image from 'next/image';

import { useCompletedRecipesCache } from '@/hooks';
import { cn } from '@/lib/utils';

import TiredBird from '../../../public/emotion/img-bird-bad.png';
import DefaultBird from '../../../public/emotion/img-bird-default.png';
import HappyBird from '../../../public/emotion/img-bird-good.png';
// Level 1 이미지
import LevelBird1Bad from '../../../public/emotion/img-bird-lv1-bad.png';
import LevelBird1Default from '../../../public/emotion/img-bird-lv1-default.png';
import LevelBird1Good from '../../../public/emotion/img-bird-lv1-good.png';
import LevelBird1Neutral from '../../../public/emotion/img-bird-lv1-neutral.png';
// Level 2 이미지
import LevelBird2Bad from '../../../public/emotion/img-bird-lv2-bad.png';
import LevelBird2Default from '../../../public/emotion/img-bird-lv2-default.png';
import LevelBird2Good from '../../../public/emotion/img-bird-lv2-good.png';
import LevelBird2Neutral from '../../../public/emotion/img-bird-lv2-neutral.png';
// Level 3 이미지
import LevelBird3Bad from '../../../public/emotion/img-bird-lv3-bad.png';
import LevelBird3Default from '../../../public/emotion/img-bird-lv3-default.png';
import LevelBird3Good from '../../../public/emotion/img-bird-lv3-good.png';
import LevelBird3Neutral from '../../../public/emotion/img-bird-lv3-neutral.png';
import NormalBird from '../../../public/emotion/img-bird-neutral.png';

import type { MoodType } from './EmotionState';

export default function EmotionImage({ mood }: { mood: MoodType }) {
  const { user } = useAuth();
  const { completedRecipesCount } = useCompletedRecipesCache();
  const nickname = user?.nickname ?? '당신';
  // 완료한 레시피 개수에 따른 레벨 계산
  const getLevel = (count: number) => {
    if (count >= 16) return 3;
    if (count >= 7) return 3;
    if (count >= 3) return 2;
    if (count >= 1) return 1;
    return 0;
  };

  const level = getLevel(completedRecipesCount);

  const getEmotionImage = (mood: MoodType) => {
    // 레벨이 있을 때는 레벨별 이미지 사용
    if (level > 0) {
      // Level 1
      if (level === 1) {
        switch (mood) {
          case 'bad':
            return LevelBird1Bad;
          case 'neutral':
            return LevelBird1Neutral;
          case 'good':
            return LevelBird1Good;
          default:
            return LevelBird1Default;
        }
      }
      // Level 2
      if (level === 2) {
        switch (mood) {
          case 'bad':
            return LevelBird2Bad;
          case 'neutral':
            return LevelBird2Neutral;
          case 'good':
            return LevelBird2Good;
          default:
            return LevelBird2Default;
        }
      }
      // Level 3
      if (level === 3) {
        switch (mood) {
          case 'bad':
            return LevelBird3Bad;
          case 'neutral':
            return LevelBird3Neutral;
          case 'good':
            return LevelBird3Good;
          default:
            return LevelBird3Default;
        }
      }
    }

    // 레벨이 없을 때 기본 이미지 사용
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

  const renderMessage = (mood: MoodType) => {
    // mood가 default일 때만 레벨별 메시지 사용
    if (mood === 'default' && completedRecipesCount > 0) {
      let firstLine = '';
      let secondLine = '';

      if (completedRecipesCount >= 16) {
        firstLine = '어멋! 왤케 건강해졌어???';
      } else if (completedRecipesCount >= 7) {
        firstLine = '와..넌..정말 대단하고.멋지고.존경해.';
      } else if (completedRecipesCount >= 3) {
        firstLine = '와-! 오늘도 해냈다! 잘했어!';
      } else if (completedRecipesCount >= 1) {
        secondLine = '귀찮음을 이겨버렸어! 완전 최고!';
      }

      if (completedRecipesCount >= 3) {
        return (
          <>
            {nickname}님, 지금까지{' '}
            <span className="font-bold">{completedRecipesCount}</span>번
            해먹었네요!
            {'\n'}
            {firstLine}
          </>
        );
      } else {
        return (
          <>
            {nickname}님, 드디어{' '}
            <span className="font-bold">{completedRecipesCount}</span>번
            해먹었네요!
            {'\n'}
            {secondLine}
          </>
        );
      }
    }

    // mood 선택 시 기존 메시지 사용
    let message = '';
    switch (mood) {
      case 'bad':
        message =
          '너도 힘들구나... 그맘알지😣\n재료만 고르면 내가 알아서 해볼게!';
        break;
      case 'neutral':
        message = '그 느낌 알지... 뭔가 애매한 날...😑\n편하게 재료만 골라봐~';
        break;
      case 'good':
        message = '나도 오늘 컨디션 최고야!☺️\n재료만 알려줘! 같이 요리해보자!';
        break;
      default:
        message =
          '지금 너의 상태가 어떤지 알려줄래?\n내가 딱 맞는 요리를 찾아줄게';
    }

    return message;
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
          {renderMessage(mood)}
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

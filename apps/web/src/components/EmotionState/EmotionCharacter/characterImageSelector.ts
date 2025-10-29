import TiredBird from '../../../../public/emotion/img-bird-bad.png';
import DefaultBird from '../../../../public/emotion/img-bird-default.png';
import HappyBird from '../../../../public/emotion/img-bird-good.png';
// Level 1 이미지
import LevelBird1Bad from '../../../../public/emotion/img-bird-lv1-bad.png';
import LevelBird1Default from '../../../../public/emotion/img-bird-lv1-default.png';
import LevelBird1Good from '../../../../public/emotion/img-bird-lv1-good.png';
import LevelBird1Neutral from '../../../../public/emotion/img-bird-lv1-neutral.png';
// Level 2 이미지
import LevelBird2Bad from '../../../../public/emotion/img-bird-lv2-bad.png';
import LevelBird2Default from '../../../../public/emotion/img-bird-lv2-default.png';
import LevelBird2Good from '../../../../public/emotion/img-bird-lv2-good.png';
import LevelBird2Neutral from '../../../../public/emotion/img-bird-lv2-neutral.png';
// Level 3 이미지
import LevelBird3Bad from '../../../../public/emotion/img-bird-lv3-bad.png';
import LevelBird3Default from '../../../../public/emotion/img-bird-lv3-default.png';
import LevelBird3Good from '../../../../public/emotion/img-bird-lv3-good.png';
import LevelBird3Neutral from '../../../../public/emotion/img-bird-lv3-neutral.png';
import NormalBird from '../../../../public/emotion/img-bird-neutral.png';

import type { MoodType } from '../EmotionState';
import type { StaticImageData } from 'next/image';

/**
 * 완료한 레시피 개수에 따른 레벨 계산
 */
export const calculateLevel = (completedRecipesCount: number): number => {
  if (completedRecipesCount >= 16) return 3;
  if (completedRecipesCount >= 7) return 3;
  if (completedRecipesCount >= 3) return 2;
  if (completedRecipesCount >= 1) return 1;
  return 0;
};

/**
 * 레벨별 이미지 매핑
 */
const LEVEL_IMAGES = {
  1: {
    bad: LevelBird1Bad,
    default: LevelBird1Default,
    good: LevelBird1Good,
    neutral: LevelBird1Neutral,
  },
  2: {
    bad: LevelBird2Bad,
    default: LevelBird2Default,
    good: LevelBird2Good,
    neutral: LevelBird2Neutral,
  },
  3: {
    bad: LevelBird3Bad,
    default: LevelBird3Default,
    good: LevelBird3Good,
    neutral: LevelBird3Neutral,
  },
} as const;

/**
 * 기본 이미지 매핑 (레벨 0)
 */
const DEFAULT_IMAGES = {
  bad: TiredBird,
  default: DefaultBird,
  good: HappyBird,
  neutral: NormalBird,
} as const;

/**
 * mood와 level에 따른 캐릭터 이미지 선택
 */
export const getCharacterImage = (
  mood: MoodType,
  level: number
): StaticImageData => {
  // 레벨이 있을 때는 레벨별 이미지 사용
  if (level > 0 && level <= 3) {
    /* eslint-disable security/detect-object-injection */
    const levelImages = LEVEL_IMAGES[level as 1 | 2 | 3];
    return levelImages[mood] || levelImages.default;
    /* eslint-enable security/detect-object-injection */
  }

  // 레벨이 없을 때 기본 이미지 사용
  /* eslint-disable-next-line security/detect-object-injection */
  return DEFAULT_IMAGES[mood] || DEFAULT_IMAGES.default;
};

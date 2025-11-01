import LiquidImageFull from '../../../public/recipe/SPOON_FULL_liquid.jpg';
import PowerImageFull from '../../../public/recipe/SPOON_FULL_powder.jpg';
import SauceImageFull from '../../../public/recipe/SPOON_FULL_sauce.jpg';
import PowerImageFull2 from '../../../public/recipe/SPOON_FULL2_powder.jpg';
import SauceImageFull2 from '../../../public/recipe/SPOON_FULL2_sauce.jpg';
import LiquidImageHalf from '../../../public/recipe/SPOON_HALF_liquid.jpg';
import PowerImageHalf from '../../../public/recipe/SPOON_HALF_powder.jpg';
import SauceImageHalf from '../../../public/recipe/SPOON_HALF_sauce.jpg';
import LiquidImageThird from '../../../public/recipe/SPOON_THIRD_liquid.jpg';
import PowerImageThird from '../../../public/recipe/SPOON_THIRD_powder.jpg';
import SauceImageThird from '../../../public/recipe/SPOON_THIRD_sauce.jpg';

import type { MeasurementData } from './types';

// 계량 가이드 정적 데이터
export const MEASUREMENT_GUIDE_DATA: MeasurementData = {
  가루류: [
    {
      description: '한가득 수북히',
      imageUrl: PowerImageFull.src,
      standard: '1큰술',
    },
    {
      description: '반만 수북히',
      imageUrl: PowerImageHalf.src,
      standard: '1/2큰술',
    },
    {
      description: '한가득 수북히	볼록하게',
      imageUrl: PowerImageFull2.src,
      standard: '2,3,4...큰술',
    },
    {
      description: '1/3만 수북히',
      imageUrl: PowerImageThird.src,
      standard: '1/3큰술',
    },
  ],
  액체류: [
    {
      description: '넘치기 직전까지',
      imageUrl: LiquidImageFull.src,
      standard: '2,3,4...큰술',
    },
    {
      description: '넘치기 직전까지',
      imageUrl: LiquidImageFull.src,
      standard: '1큰술',
    },
    {
      description: '가장자리만 남기고',
      imageUrl: LiquidImageHalf.src,
      standard: '1/2큰술',
    },
    {
      description: '1/3정도로',
      imageUrl: LiquidImageThird.src,
      standard: '1/3큰술',
    },
  ],
  '장,젓갈류': [
    {
      description: '한가득 볼록히',
      imageUrl: SauceImageFull.src,
      standard: '2,3,4...큰술',
    },
    {
      description: '한가득 볼록히',
      imageUrl: SauceImageFull2.src,
      standard: '1큰술',
    },
    {
      description: '반만 볼록하게',
      imageUrl: SauceImageHalf.src,
      standard: '1/2큰술',
    },
    {
      description: '1/3만 볼록하게',
      imageUrl: SauceImageThird.src,
      standard: '1/3큰술',
    },
  ],
};

// 계량 가이드 카테고리 목록 (탭 제목)
export const MEASUREMENT_GUIDE_CATEGORIES = Object.keys(MEASUREMENT_GUIDE_DATA);

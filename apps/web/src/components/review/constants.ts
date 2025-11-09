type EmotionSectionType = 'taste' | 'difficulty' | 'experience';

interface EmotionSectionConfig {
  type: EmotionSectionType;
  title: string;
}

// UI용 매핑 객체 - 이미지 디자인에 맞는 텍스트로 변환
export const UI_TEXT_MAPPING: Record<string, string> = {
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

// 감정 섹션 설정 상수
export const EMOTION_SECTIONS: EmotionSectionConfig[] = [
  { title: '요리의 맛은 어땠나요?', type: 'taste' },
  { title: '요리를 시작하기가 어땠나요?', type: 'difficulty' },
  { title: '직접 요리해보니 어땠나요?', type: 'experience' },
];

export type EmotionSectionType = 'taste' | 'difficulty' | 'experience';

// 타입 안전한 매핑: EmotionType -> FormFieldKey
export const EMOTION_TO_FORM_FIELD_MAP = {
  difficulty: 'difficultyOption',
  experience: 'experienceOption',
  taste: 'tasteOption',
} as const satisfies Record<
  EmotionSectionType,
  'tasteOption' | 'difficultyOption' | 'experienceOption'
>;

// 타입 안전한 매핑: EmotionType -> ReviewData의 옵션 필드 키
export const EMOTION_TO_REVIEW_DATA_OPTIONS_MAP = {
  difficulty: 'difficultyOptions',
  experience: 'experienceOptions',
  taste: 'tasteOptions',
} as const satisfies Record<
  EmotionSectionType,
  'tasteOptions' | 'difficultyOptions' | 'experienceOptions'
>;

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

// 감정 관련 공통 타입 정의
export type MoodType = 'bad' | 'neutral' | 'good';
export type MoodState = 'default' | 'selected' | 'disabled';
export type EmotionColor = 'blue' | 'yellow' | 'red';

// 감정별 라벨 매핑
export const MOOD_LABELS: Record<MoodType, string> = {
  bad: '힘들어',
  good: '충분해',
  neutral: '그럭저럭',
} as const;

// 감정별 색상 매핑
export const MOOD_COLORS: Record<MoodType, EmotionColor> = {
  bad: 'blue',
  good: 'red',
  neutral: 'yellow',
} as const;

// 색상별 헥스 코드
export const COLOR_HEX: Record<
  EmotionColor,
  {
    primary: string;
    background: string;
    border: string;
    text: string;
  }
> = {
  blue: {
    background: '#d4e2ff',
    border: '#4164ae',
    primary: '#4164ae',
    text: '#4164ae',
  },
  red: {
    background: '#ffe0e1',
    border: '#df6567',
    primary: '#df6567',
    text: '#df6567',
  },
  yellow: {
    background: '#fdfab0',
    border: '#ad7e06',
    primary: '#ad7e06',
    text: '#ad7e06',
  },
} as const;

// 기본 상태 색상
export const DEFAULT_COLORS = {
  background: '#f8f9fa',
  border: '#e9ecef',
  icon: '#adb5bd',
  text: '#6c757d',
} as const;

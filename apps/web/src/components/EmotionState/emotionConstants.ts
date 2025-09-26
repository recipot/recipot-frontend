/**
 * 감정 상태 관련 상수 정의
 */

// ============================================================================
// 감정 옵션 상수
// ============================================================================

// TODO : 백엔드와 논의 필요
export const EMOTION_OPTIONS = {
  mood: [
    { color: 'blue' as const, label: '힘들어', mood: 'bad' as const },
    { color: 'yellow' as const, label: '그럭저럭', mood: 'neutral' as const },
    { color: 'red' as const, label: '충분해', mood: 'good' as const },
  ],
  review: [
    { color: 'blue' as const, feeling: 'bad' as const, label: '별로예요' },
    {
      color: 'yellow' as const,
      feeling: 'soso' as const,
      label: '그저 그래요',
    },
    { color: 'red' as const, feeling: 'good' as const, label: '또 해먹을래요' },
  ],
} as const;

// ============================================================================
// 애니메이션 설정
// ============================================================================

export const EMOTION_ANIMATION_VARIANTS = {
  moodCircle: {
    initial: { borderRadius: 100, scale: 1 },
    selected: {
      borderRadius: 126,
    },
    unselected: {
      borderRadius: 100,
      scale: 1,
    },
  },
} as const;

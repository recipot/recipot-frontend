import { useCallback, useEffect, useRef, useState } from 'react';

import type { MoodType } from '@/components/EmotionState';

/**
 * 기분 선택 플로우 상태
 */
type FlowState =
  | 'idle' // 초기 상태 (아무것도 선택 안 함)
  | 'mood_selected' // 기분 선택됨 (타이핑 진행 중)
  | 'waiting_transition' // 타이핑 완료, 전환 대기 중
  | 'showing_ingredients'; // 재료 검색 화면 표시 중

interface UseMoodSelectionFlowReturn {
  mood: MoodType | null;
  flowState: FlowState;
  showIngredientsSearch: boolean;
  handleMoodSelect: (selectedMood: MoodType) => void;
  handleTypingComplete: () => void;
  handleBack: () => void;
}

const TRANSITION_DELAY = 2300; // ms

/**
 * 기분 선택부터 재료 검색까지의 플로우를 관리하는 훅
 *
 * 상태 전환 플로우:
 * idle → mood_selected (사용자가 기분 선택)
 *   → waiting_transition (타이핑 완료)
 *   → showing_ingredients (2.3초 후)
 *   → idle (뒤로가기 - mood는 유지, 타이핑 재시작 방지)
 *
 * @note 뒤로가기 후 idle 상태에서 mood가 유지되므로
 *       사용자가 다시 기분을 선택하면 정상적으로 플로우가 재시작됩니다.
 */
export function useMoodSelectionFlow(): UseMoodSelectionFlowReturn {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 정리 헬퍼
  const clearTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  // 기분 선택 핸들러
  const handleMoodSelect = useCallback(
    (selectedMood: MoodType) => {
      // 기존 타이머 취소
      clearTimer();

      const isSameMood = mood === selectedMood;
      const newMood = isSameMood ? null : selectedMood;

      setMood(newMood);

      if (!newMood || newMood === 'default') {
        // 기분 선택 해제 또는 default 선택 시 초기 상태로
        setFlowState('idle');
      } else {
        // bad, neutral, good 선택 시
        setFlowState('mood_selected');
      }
    },
    [mood, clearTimer]
  );

  // 타이핑 완료 핸들러
  const handleTypingComplete = useCallback(() => {
    // mood_selected 상태일 때만 전환 시작
    if (flowState !== 'mood_selected') return;

    // 이미 타이머가 실행 중이면 무시 (중복 호출 방지)
    if (transitionTimerRef.current) return;

    // waiting_transition 상태로 전환
    setFlowState('waiting_transition');

    // TRANSITION_DELAY 후 재료 검색 화면으로 전환
    transitionTimerRef.current = setTimeout(() => {
      setFlowState('showing_ingredients');
      transitionTimerRef.current = null;
    }, TRANSITION_DELAY);
  }, [flowState]);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    clearTimer();
    // 재료 검색에서 뒤로가기 시 idle 상태로 (mood는 유지)
    // 타이핑 애니메이션 재시작을 방지
    setFlowState('idle');
  }, [clearTimer]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    flowState,
    handleBack,
    handleMoodSelect,
    handleTypingComplete,
    mood,
    showIngredientsSearch: flowState === 'showing_ingredients',
  };
}

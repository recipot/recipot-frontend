'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/common/Button';
import EmotionState, { type MoodType } from '@/components/EmotionState';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { onboardingStorage } from '@/utils/onboardingStorage';

export default function CookStateStep() {
  const goToNextStep = useOnboardingStore(state => state.goToNextStep);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );
  const setStepData = useOnboardingStore(state => state.setStepData);

  // 저장된 데이터 불러오기
  const stepData = useOnboardingStore(state => state.stepData[2]);
  const isRefreshed = useOnboardingStore(state => state.isRefreshed);
  const clearRefreshFlag = useOnboardingStore(state => state.clearRefreshFlag);
  const savedMood = stepData?.mood ?? null;

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(savedMood);

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed && stepData && Object.keys(stepData).length === 0) {
      setSelectedMood(null);
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [stepData, isRefreshed, clearRefreshFlag]);

  // 로딩 상태 관리 (기존 mutation 대신)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodChange = (mood: MoodType | null) => {
    setSelectedMood(mood);
  };

  const handleNext = async () => {
    if (!selectedMood) return;

    try {
      setIsSubmitting(true);

      // localStorage에 기분 상태 저장
      onboardingStorage.saveStepData(2, {
        mood: selectedMood,
      });

      // 스토어 업데이트 (UI 상태 관리용)
      const cookStateData = {
        mood: selectedMood,
      };
      setStepData(2, cookStateData);
      markStepCompleted(2);

      console.info('✅ Step 2 완료: 기분 상태 저장됨', { mood: selectedMood });

      // 다음 단계로 이동
      goToNextStep();
    } catch (error) {
      console.error('❌ 기분 상태 저장 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 left-0 -z-10 h-screen min-h-[500px]">
        <EmotionState
          key={selectedMood ?? 'null'} // selectedMood가 변경되면 컴포넌트 리마운트
          onMoodChange={handleMoodChange}
          initialMood={selectedMood}
          className="h-full"
        />
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button
          onClick={handleNext}
          disabled={selectedMood === null || isSubmitting}
        >
          {isSubmitting ? '저장 중...' : '여유에 맞는 요리 추천받기'}
        </Button>
      </div>
    </>
  );
}

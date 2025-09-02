import { useState } from 'react';

import type { ReviewFeeling } from '@/components/common/Modal/recipe/ReviewBottomSheet/types';

export function useReviewForm(timesCooked: number, onReviewSubmit: () => void) {
  const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
  const [pros, setPros] = useState<string[]>([]);

  const togglePro = (text: string) => {
    setPros(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const handleFeelingClick = (selectedFeeling: ReviewFeeling) => {
    setFeeling(prevFeeling =>
      prevFeeling === selectedFeeling ? null : selectedFeeling
    );
  };

  const canSubmit = !!feeling && (feeling !== 'good' || pros.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 서버에 제출할 데이터 구조
    const reviewData = {
      feeling,
      pros,
      timesCooked,
      // 기타 필요한 데이터 추가
    };

    console.log(reviewData, 'reviewData');

    onReviewSubmit(); // 부모 컴포넌트에 제출 완료 알림
  };

  return {
    canSubmit,
    feeling,
    handleFeelingClick,
    handleSubmit,
    pros,
    togglePro,
  };
}

import { useMutation } from '@tanstack/react-query';

import type { MoodType } from '@/components/EmotionState';

interface SubmitMoodResponse {
  message: string;
  success: boolean;
  data?: { mood: MoodType };
}

const submitMood = async (mood: MoodType): Promise<SubmitMoodResponse> => {
  const response = await fetch('/api/user/mood', {
    body: JSON.stringify({ mood }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('기분 상태 전송에 실패했습니다.');
  }

  return response.json();
};

export const useSubmitMood = () => {
  return useMutation({
    mutationFn: submitMood,
    onError: error => {
      console.error('기분 상태 전송 실패:', error);
    },
    onSuccess: data => {
      console.info('기분 상태 전송 성공:', data);
    },
  });
};

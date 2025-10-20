import { foodAPI } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

export const useSubmitSelectedFoods = () => {
  return useMutation({
    mutationFn: foodAPI.submitSelectedFoods,
    onError: error => {
      console.error('선택된 재료 전송 실패:', error);
      // 에러 시 추가 로직 (예: 에러 토스트 메시지)
    },
    onSuccess: data => {
      console.info('선택된 재료 전송 성공:', data);
      // 성공 시 추가 로직 (예: 토스트 메시지, 페이지 이동 등)
    },
  });
};

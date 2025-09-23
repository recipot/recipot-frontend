import { http, HttpResponse } from 'msw';

import type { MoodType } from '@/components/EmotionState';

export const moodHandlers = [
  // 기분 상태 전송
  http.post('/api/user/mood', async ({ request }) => {
    try {
      const body = (await request.json()) as { mood: MoodType };
      const { mood } = body;

      // 기분 상태 유효성 검사
      if (!mood || !['bad', 'neutral', 'good'].includes(mood)) {
        return HttpResponse.json(
          {
            message: '유효하지 않은 기분 상태입니다.',
            success: false,
          },
          { status: 400 }
        );
      }

      // TODO: 실제 서버 로직 구현
      // 예: 데이터베이스에 저장, 다른 서비스와 연동 등
      console.info('사용자 기분 상태 저장:', { mood });

      return HttpResponse.json({
        data: { mood },
        message: '기분 상태가 성공적으로 저장되었습니다.',
        success: true,
      });
    } catch (error) {
      console.error('기분 상태 저장 오류:', error);
      return HttpResponse.json(
        {
          message: '서버 오류가 발생했습니다.',
          success: false,
        },
        { status: 500 }
      );
    }
  }),
];

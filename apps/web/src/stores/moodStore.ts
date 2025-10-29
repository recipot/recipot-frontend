'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { MoodType } from '@/components/EmotionState';

/**
 * 기분/컨디션 스토어 상태
 */
interface MoodState {
  /** 현재 선택된 기분 */
  mood: MoodType | null;
  /** 현재 사용자 ID (세션 추적용) */
  userId: string | null;
}

/**
 * 기분/컨디션 스토어 액션
 */
interface MoodActions {
  /** 기분 설정 */
  setMood: (mood: MoodType | null) => void;
  /** 기분 초기화 */
  clearMood: () => void;
  /** 사용자 세션 검증 및 필요시 초기화 */
  validateUserSession: (currentUserId: string | null) => void;
}

/** 초기 상태 */
const initialState: MoodState = {
  mood: null,
  userId: null,
};

/**
 * 기분/컨디션 관리를 위한 Zustand 스토어
 *
 * 기능:
 * - 사용자의 현재 기분/컨디션 관리
 * - 온보딩 및 다른 페이지에서 재사용 가능
 * - localStorage에 자동 저장 (persist)
 * - 사용자 세션 변경 시 자동 초기화
 */
export const useMoodStore = create<MoodState & MoodActions>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        ...initialState,

        // 액션들
        setMood: (mood: MoodType | null) => {
          set({ mood }, false, 'setMood');
        },

        clearMood: () => {
          set({ mood: null }, false, 'clearMood');
        },

        validateUserSession: (currentUserId: string | null) => {
          const { userId } = get();

          if (!currentUserId) {
            set({ ...initialState, userId: null }, false, 'resetSession');
            return;
          }

          if (userId !== currentUserId) {
            console.info('🔄 사용자 세션 변경 감지, 기분 데이터 초기화');
            set({ ...initialState, userId: currentUserId }, false, 'resetSession');
          }
        },
      }),
      {
        name: 'mood-storage',
      }
    ),
    {
      name: 'mood-store',
    }
  )
);

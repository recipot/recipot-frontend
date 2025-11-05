'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { MoodType } from '@/components/EmotionState';

export const MOOD_EXPIRY_DURATION_MS = 30 * 60 * 1000;

/**
 * 기분/컨디션 스토어 상태
 */
interface MoodState {
  /** 현재 선택된 기분 */
  mood: MoodType | null;
  /** 현재 사용자 ID (세션 추적용) */
  userId: string | null;
  /** 기분 선택 만료 시각 (epoch ms) */
  expiresAt: number | null;
  /** 레시피 추천 결과 페이지 진입 여부 */
  isRecommendationReady: boolean;
}

/**
 * 기분/컨디션 스토어 액션
 */
interface MoodActions {
  /** 온보딩 등에서 사용하는 기본 기분 설정 */
  setMood: (mood: MoodType | null) => void;
  /** 메인 페이지 전용 만료시간 포함 기분 설정 */
  setMoodWithExpiry: (mood: MoodType | null, durationMs?: number) => void;
  /** 만료 시간 연장 */
  refreshExpiry: (durationMs?: number) => void;
  /** 추천 결과 진입 상태 갱신 */
  markRecommendationReady: (isReady: boolean) => void;
  /** 기분 초기화 */
  clearMood: () => void;
  /** 기분 만료 여부 */
  hasExpired: () => boolean;
  /** 만료 시 초기화 수행 */
  ensureMoodValidity: () => boolean;
  /** 사용자 세션 검증 및 필요시 초기화 */
  validateUserSession: (currentUserId: string | null) => void;
}

/** 초기 상태 */
const initialState: MoodState = {
  expiresAt: null,
  isRecommendationReady: false,
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
 * - 메인 페이지에서 30분 만료 로직 관리
 */
export const useMoodStore = create<MoodState & MoodActions>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        ...initialState,

        // 액션들
        clearMood: () => {
          set(
            {
              expiresAt: null,
              isRecommendationReady: false,
              mood: null,
            },
            false,
            'clearMood'
          );
        },

        ensureMoodValidity: () => {
          const state = get();

          if (!state.mood) {
            // mood가 비어있으면 만료 상태로 보지 않음
            return true;
          }

          if (!state.expiresAt) {
            // 만료 시간이 없다면 아직 만료 설정이 되지 않은 상태
            return true;
          }

          if (state.expiresAt > Date.now()) {
            return true;
          }

          console.info('⏰ 기분 선택 만료 감지, 상태 초기화');
          set(
            {
              expiresAt: null,
              isRecommendationReady: false,
              mood: null,
            },
            false,
            'expireMood'
          );
          return false;
        },

        hasExpired: () => {
          const { expiresAt } = get();
          if (expiresAt == null) {
            return false;
          }
          return expiresAt <= Date.now();
        },

        markRecommendationReady: (isReady: boolean) => {
          set(
            { isRecommendationReady: isReady },
            false,
            'markRecommendationReady'
          );
        },

        refreshExpiry: (durationMs = MOOD_EXPIRY_DURATION_MS) => {
          const state = get();
          if (!state.mood) {
            return;
          }

          const nextExpiry = Date.now() + durationMs;
          set({ expiresAt: nextExpiry }, false, 'refreshExpiry');
        },

        setMood: (mood: MoodType | null) => {
          const normalizedMood = mood && mood !== 'default' ? mood : null;
          set(
            {
              expiresAt: null,
              isRecommendationReady: false,
              mood: normalizedMood,
            },
            false,
            'setMood'
          );
        },

        setMoodWithExpiry: (
          mood: MoodType | null,
          durationMs = MOOD_EXPIRY_DURATION_MS
        ) => {
          const normalizedMood = mood && mood !== 'default' ? mood : null;

          if (!normalizedMood) {
            set(
              {
                expiresAt: null,
                isRecommendationReady: false,
                mood: null,
              },
              false,
              'setMoodWithExpiry-clear'
            );
            return;
          }

          const nextExpiry = Date.now() + durationMs;

          set(
            {
              expiresAt: nextExpiry,
              isRecommendationReady: false,
              mood: normalizedMood,
            },
            false,
            'setMoodWithExpiry'
          );
        },

        validateUserSession: (currentUserId: string | null) => {
          const { userId } = get();

          if (!currentUserId) {
            set({ ...initialState, userId: null }, false, 'resetSession');
            return;
          }

          if (userId !== currentUserId) {
            console.info('🔄 사용자 세션 변경 감지, 기분 데이터 초기화');
            set(
              { ...initialState, userId: currentUserId },
              false,
              'resetSession'
            );
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

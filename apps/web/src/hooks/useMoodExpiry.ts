'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  MOOD_EXPIRY_DURATION_MS,
  useMoodStore,
} from '@/stores/moodStore';

interface UseMoodExpiryOptions {
  /** 만료 시 호출되는 콜백 */
  onExpire?: () => void;
  /** 사용자 활동에 따라 만료 시간을 자동 연장할지 여부 */
  autoRefresh?: boolean;
  /** 연속 활동 시 만료 연장 최소 간격 */
  refreshThrottleMs?: number;
}

const DEFAULT_ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  'keydown',
  'mousemove',
  'pointerdown',
  'touchstart',
];

const DEFAULT_REFRESH_THROTTLE_MS = 60 * 1000;

export function useMoodExpiry({
  autoRefresh = false,
  onExpire,
  refreshThrottleMs = DEFAULT_REFRESH_THROTTLE_MS,
}: UseMoodExpiryOptions = {}) {
  const mood = useMoodStore(state => state.mood);
  const expiresAt = useMoodStore(state => state.expiresAt);
  const ensureMoodValidity = useMoodStore(state => state.ensureMoodValidity);
  const refreshExpiry = useMoodStore(state => state.refreshExpiry);
  const hasExpired = useMoodStore(state => state.hasExpired);

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const triggerExpire = useCallback(() => {
    const isStillValid = ensureMoodValidity();
    if (!isStillValid) {
      onExpireRef.current?.();
    }
  }, [ensureMoodValidity]);

  // 초기 렌더 시 만료 여부 확인
  useEffect(() => {
    if (!mood) {
      return;
    }

    if (!ensureMoodValidity()) {
      onExpireRef.current?.();
    }
  }, [ensureMoodValidity, mood]);

  // 만료 타이머 등록
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!mood || !expiresAt) {
      return;
    }

    const now = Date.now();
    const remainingMs = expiresAt - now;

    if (remainingMs <= 0) {
      triggerExpire();
      return;
    }

    const timerId = window.setTimeout(() => {
      triggerExpire();
    }, remainingMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [expiresAt, mood, triggerExpire]);

  // 사용자 활동 감지 시 만료 시간 연장
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (!mood) {
      return;
    }

    let lastRefreshed = 0;

    const maybeRefresh = () => {
      const now = Date.now();
      if (now - lastRefreshed < refreshThrottleMs) {
        return;
      }

      lastRefreshed = now;
      refreshExpiry(MOOD_EXPIRY_DURATION_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        maybeRefresh();
      }
    };

    DEFAULT_ACTIVITY_EVENTS.forEach(eventName => {
      window.addEventListener(eventName, maybeRefresh, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      DEFAULT_ACTIVITY_EVENTS.forEach(eventName => {
        window.removeEventListener(eventName, maybeRefresh);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoRefresh, mood, refreshExpiry, refreshThrottleMs]);

  const remainingMs = useMemo(() => {
    if (!expiresAt) {
      return null;
    }

    return Math.max(0, expiresAt - Date.now());
  }, [expiresAt]);

  const isExpired = mood ? hasExpired() : false;

  return {
    expiresAt,
    isExpired,
    mood,
    remainingMs,
  };
}

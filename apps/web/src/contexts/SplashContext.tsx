'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

const SPLASH_COMPLETED_KEY = 'splash_completed';

interface SplashContextValue {
  isCompleted: boolean;
  markAsCompleted: () => void;
}

const SplashContext = createContext<SplashContextValue | null>(null);

export function useSplash() {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error('useSplash must be used within SplashProvider');
  }
  return context;
}

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  // 클라이언트 사이드에서만 localStorage 확인 (SSR 환경 방지)
  const getInitialCompletedState = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    const savedState = localStorage.getItem(SPLASH_COMPLETED_KEY);
    return savedState === 'true';
  };

  const [isCompleted, setIsCompleted] = useState(getInitialCompletedState);

  const markAsCompleted = useCallback(() => {
    setIsCompleted(true);
    localStorage.setItem(SPLASH_COMPLETED_KEY, 'true');
  }, []);

  const value = useMemo(
    () => ({ isCompleted, markAsCompleted }),
    [isCompleted, markAsCompleted]
  );

  return (
    <SplashContext.Provider value={value}>{children}</SplashContext.Provider>
  );
}

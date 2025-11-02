'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedState = window.localStorage.getItem(SPLASH_COMPLETED_KEY);
    if (savedState === 'true') {
      setIsCompleted(true);
    }
  }, []);

  const markAsCompleted = useCallback(() => {
    setIsCompleted(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SPLASH_COMPLETED_KEY, 'true');
    }
  }, []);

  const value = useMemo(
    () => ({ isCompleted, markAsCompleted }),
    [isCompleted, markAsCompleted]
  );

  return (
    <SplashContext.Provider value={value}>{children}</SplashContext.Provider>
  );
}

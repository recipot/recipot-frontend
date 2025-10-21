'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

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

  const markAsCompleted = useCallback(() => {
    setIsCompleted(true);
  }, []);

  const value = useMemo(
    () => ({ isCompleted, markAsCompleted }),
    [isCompleted, markAsCompleted]
  );

  return (
    <SplashContext.Provider value={value}>{children}</SplashContext.Provider>
  );
}

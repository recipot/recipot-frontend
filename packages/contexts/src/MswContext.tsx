import { createContext, useContext, type ReactNode } from 'react';

interface MswContextType {
  mswReady: boolean;
}

const MswContext = createContext<MswContextType | undefined>(undefined);

export function MswProvider({
  children,
  mswReady,
}: {
  children: ReactNode;
  mswReady: boolean;
}) {
  return (
    <MswContext.Provider value={{ mswReady }}>{children}</MswContext.Provider>
  );
}

export const useMsw = (): MswContextType => {
  const context = useContext(MswContext);
  if (context === undefined) {
    throw new Error('useMsw는 MswProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};

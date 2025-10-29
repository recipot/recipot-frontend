'use client';

import { type ReactNode, useEffect } from 'react';
import { useAuth } from '@recipot/contexts';

import type { QueryClient } from '@tanstack/react-query';

interface MockDataSetterProps {
  children: ReactNode;
  nickname: string;
  completedRecipesCount: number;
  queryClient: QueryClient;
}

/**
 * Mock 데이터 설정 컴포넌트
 * 테스트를 위해 유저 정보와 완료한 레시피 데이터를 설정합니다.
 */
export function MockDataSetter({
  children,
  completedRecipesCount,
  nickname,
  queryClient,
}: MockDataSetterProps) {
  const { setUser } = useAuth();

  // 유저 정보 설정
  useEffect(() => {
    const mockUser = {
      email: 'test@example.com',
      id: 1,
      isFirstEntry: false,
      nickname,
      platform: 'google' as const,
      profileImageUrl: 'https://via.placeholder.com/150',
      recipeCompleteCount: completedRecipesCount,
      role: 'general' as const,
    };
    setUser(mockUser);
  }, [nickname, setUser, completedRecipesCount]);

  // 완료한 레시피 데이터 설정
  useEffect(() => {
    if (completedRecipesCount >= 0) {
      const data = {
        items: Array.from({ length: completedRecipesCount }, (_, i) => ({
          completedAt: new Date().toISOString(),
          id: i + 1,
          recipeId: i + 1,
          title: `레시피 ${i + 1}`,
        })),
        total: completedRecipesCount,
      };

      queryClient.setQueryData(
        ['mypage', 'completed-recipes', { limit: 10, page: 1 }],
        data
      );

      console.info('✅ Mock 데이터 설정 완료:', {
        completedRecipesCount,
        nickname,
      });
    }
  }, [completedRecipesCount, queryClient, nickname]);

  return children;
}

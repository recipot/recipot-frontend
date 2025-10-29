'use client';

import { useMemo, useState } from 'react';
import { AuthProvider, MswProvider } from '@recipot/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

import { Header } from '@/components/common/Header';
import {
  EmotionBackground,
  EmotionCharacter,
  EmotionSelector,
  type MoodType,
} from '@/components/EmotionState';
import UserIcon from '@/components/Icons/UserIcon';

import { onboardingStyles } from '../onboarding/_utils/onboardingStyles';
import { MockDataSetter } from './MockDataSetter';

/**
 * 캐릭터 레벨 테스트 페이지
 * 레벨별 캐릭터의 성장 과정을 확인할 수 있습니다.
 */
export default function CharacterTestPage() {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [nickname, setNickname] = useState('테스트유저');

  // 레벨이 변경될 때마다 새로운 QueryClient 생성

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: Infinity,
          },
        },
      }),
    [level]
  );

  // 레벨에 따른 완료 레시피 수 매핑
  const getLevelRecipeCount = (lvl: 0 | 1 | 2 | 3): number => {
    switch (lvl) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 3;
      case 3:
        return 7;
      default:
        return 0;
    }
  };

  const handleMoodSelect = (selectedMood: MoodType) => {
    setMood(mood === selectedMood ? null : selectedMood);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MswProvider mswReady>
        <AuthProvider>
          <MockDataSetter
            key={`mock-data-${level}-${getLevelRecipeCount(level)}`}
            nickname={nickname}
            completedRecipesCount={getLevelRecipeCount(level)}
            queryClient={queryClient}
          >
            <div className="relative h-screen w-full overflow-hidden">
              {/* 레벨 컨트롤 패널 */}
              <div className="absolute top-20 left-4 z-50 w-80 space-y-4 rounded-lg bg-white p-4 shadow-xl">
                {/* 레벨 선택 버튼 그리드 */}
                <div>
                  <div className="mb-3 text-sm font-bold text-gray-900">
                    캐릭터 레벨 선택
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setLevel(lvl as 0 | 1 | 2 | 3)}
                        className={`rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                          level === lvl
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        LV {lvl}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {level === 0 && '• 완료 레시피 0개 (초보 요리사)'}
                    {level === 1 && '• 완료 레시피 1~2개 (입문 요리사)'}
                    {level === 2 && '• 완료 레시피 3~6개 (중급 요리사)'}
                    {level === 3 && '• 완료 레시피 7개 이상 (베테랑 요리사)'}
                  </div>
                </div>

                {/* 닉네임 입력 */}
                <div>
                  <label
                    htmlFor="nickname-input"
                    className="mb-2 block text-sm font-bold text-gray-900"
                  >
                    유저 닉네임
                  </label>
                  <input
                    id="nickname-input"
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="닉네임 입력"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* 현재 상태 표시 */}
                <div className="space-y-2 rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">
                      현재 레벨:
                    </span>
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                      LV {level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">
                      완료 레시피:
                    </span>
                    <span className="text-gray-900">
                      {getLevelRecipeCount(level)}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">
                      선택된 기분:
                    </span>
                    <span className="text-gray-900">
                      {mood === null
                        ? '없음'
                        : mood === 'default'
                          ? '기본'
                          : mood === 'good'
                            ? '좋음 😊'
                            : mood === 'neutral'
                              ? '보통 😐'
                              : '힘듦 😣'}
                    </span>
                  </div>
                </div>

                {/* 설명 */}
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <p className="text-xs text-blue-900">
                    💡 <strong>사용 방법:</strong>
                    <br />
                    1. 레벨을 선택하세요
                    <br />
                    2. 아래 감정 버튼을 클릭하세요
                    <br />
                    3. 캐릭터와 메시지 변화를 확인하세요
                  </p>
                </div>
              </div>

              {/* 메인 화면 - 기분 선택 */}
              <div className="relative h-full w-full">
                {/* 고정 헤더 */}
                <div className="absolute top-0 right-0 left-0 z-10">
                  <Header className="px-5">
                    <Link href="/">
                      <Image
                        src="/logo.png"
                        alt="한끼부터"
                        width={80}
                        height={30}
                        priority
                        className="object-contain"
                      />
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/"
                        className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                      >
                        홈으로
                      </Link>
                      <Link
                        href="/mypage"
                        className="cursor-pointer"
                        aria-label="마이페이지"
                      >
                        <UserIcon size={24} color="#212529" />
                      </Link>
                    </div>
                  </Header>
                </div>

                {/* 배경 - 전체 화면 */}
                <EmotionBackground
                  mood={mood}
                  className="fixed inset-0 -z-10"
                />

                {/* 본문 컨텐츠 - 헤더 영역 포함 */}
                <div className="flex h-full w-full flex-col pt-14">
                  {/* Title */}
                  <div className={onboardingStyles.stepHeader.wrapper}>
                    <h2 className={onboardingStyles.stepHeader.title}>
                      요리할 여유가 얼마나있나요?
                    </h2>
                    <p className={onboardingStyles.stepHeader.description}>
                      상태와 재료 딱 두가지만 알려주세요!
                    </p>
                  </div>

                  {/* 기분 선택 버튼 영역 */}
                  <EmotionSelector
                    selectedMood={mood}
                    onMoodSelect={handleMoodSelect}
                  />

                  {/* 캐릭터 영역 */}
                  <div className="flex flex-1 items-center justify-center">
                    <EmotionCharacter
                      key={`character-${level}-${getLevelRecipeCount(level)}`}
                      mood={mood ?? 'default'}
                      completedRecipesCount={getLevelRecipeCount(level)}
                      onTypingComplete={() => {
                        // 타이핑 완료 핸들러
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 하단 레벨 정보 표시 */}
              <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-black/80 px-4 py-2 text-white backdrop-blur-sm">
                <p className="text-sm font-bold">
                  Level {level} • {getLevelRecipeCount(level)}개 완료
                </p>
              </div>
            </div>
          </MockDataSetter>
        </AuthProvider>
      </MswProvider>
    </QueryClientProvider>
  );
}

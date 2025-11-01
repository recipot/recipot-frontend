'use client';

import { useEffect, useState } from 'react';
import { condition } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { LoadingPage } from '@/components/common/Loading';
import { Toast } from '@/components/common/Toast/Toast';
import {
  EmotionBackground,
  EmotionCharacter,
  EmotionSelector,
} from '@/components/EmotionState';
import UserIcon from '@/components/Icons/UserIcon';
import { IngredientsSearch } from '@/components/IngredientsSearch';
import { ReviewRemindBottomSheet } from '@/components/review/ReviewRemindBottomSheet';
import { useSplash } from '@/contexts/SplashContext';
import { useCompletedRecipes } from '@/hooks/useCompletedRecipes';
import { useToast } from '@/hooks/useToast';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { useMoodSelectionFlow } from './(main)/_hooks/useMoodSelectionFlow';
import { moodToConditionId } from './onboarding/_utils/conditionMapper';
import { onboardingStyles } from './onboarding/_utils/onboardingStyles';

const MIN_SELECTED_FOODS = 2;

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const { isCompleted } = useSplash();
  const { selectedFoodIds } = useSelectedFoodsStore();
  const {
    isVisible: isToastVisible,
    message: toastMessage,
    showToast,
  } = useToast();

  // 기분 선택 플로우 관리
  const {
    flowState,
    handleBack,
    handleMoodSelect,
    handleTypingComplete,
    mood,
    showIngredientsSearch,
  } = useMoodSelectionFlow();

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 완료한 레시피 수 조회 (로그인 상태일 때만)
  // 이 데이터는 EmotionCharacter에서 캐시를 통해 사용됨
  useCompletedRecipes({ limit: 10, page: 1 });

  useEffect(() => {
    // 로딩 중에는 체크하지 않음
    if (loading) {
      return;
    }

    // 1. 비로그인 사용자 → 로그인 페이지로 이동
    if (!user) {
      router.push('/signin');
      return;
    }

    // 2. 로그인 + 온보딩 미완료 → 온보딩 페이지로 이동
    if (user.isFirstEntry) {
      router.push('/onboarding');
    }
  }, [loading, user, router]);

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);

      if (!mood) {
        showToast('기분을 먼저 선택해주세요');
        return;
      }

      console.info('🚀 재료 선택 완료:', {
        flowState,
        mood,
        selectedFoods: selectedFoodIds,
      });

      // 컨디션 저장
      const conditionId = moodToConditionId(mood);

      await condition.saveDailyCondition({
        conditionId,
        isRecommendationStarted: true,
      });

      console.info('✅ 재료 선택 및 컨디션 저장 완료');

      // 레시피 추천 페이지로 이동
      router.push('/recipeRecommend');
    } catch (error) {
      console.error('❌ 재료 선택 완료 실패:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다';
      showToast(`재료 선택 완료 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectionChange = (count: number) => {
    setSelectedCount(count);
  };

  // 로딩 중일 때 표시할 화면
  if (loading) {
    return <LoadingPage />;
  }

  // 비로그인 또는 온보딩 미완료인 경우 빈 화면 표시 (리다이렉트 진행 중)
  if (!user || user.isFirstEntry) {
    return null;
  }

  // 정상적으로 로그인하고 온보딩 완료한 사용자만 표시
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Toast 알림 */}
      <Toast isVisible={isToastVisible} message={toastMessage} />

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
            <Link
              href="/mypage"
              className="cursor-pointer"
              aria-label="마이페이지"
            >
              <UserIcon size={24} color="#212529" />
            </Link>
          </Header>
        </div>

        {/* 배경 - 전체 화면 */}
        <EmotionBackground mood={mood} className="fixed inset-0 -z-10" />

        {/* 본문 컨텐츠 - 헤더 영역 포함 */}
        <div className="flex h-full w-full flex-col pt-14">
          {/* Title */}
          <div className={onboardingStyles.stepHeader.wrapper}>
            <h2 className={onboardingStyles.stepHeader.title}>
              지금 요리에 에너지를 <br />
              얼마나 쓰고 싶으신가요?
            </h2>
            <p className={onboardingStyles.stepHeader.description}>
              에너지에 딱 맞는 요리를 찾아드릴게요
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
              mood={mood ?? 'default'}
              onTypingComplete={handleTypingComplete}
            />
          </div>
        </div>

        {isCompleted && <ReviewRemindBottomSheet />}
      </div>

      {/* 재료 검색 화면 - 슬라이드 애니메이션 */}
      <AnimatePresence>
        {showIngredientsSearch && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ damping: 30, stiffness: 300, type: 'spring' }}
            className="absolute top-0 left-0 z-50 h-full w-full bg-white"
          >
            <div className="relative h-screen w-full">
              {/* 고정 헤더 */}
              <div className="absolute top-0 right-0 left-0 z-10">
                <Header>
                  <Header.Back onClick={handleBack} />
                  <Link
                    href="/mypage"
                    className="cursor-pointer"
                    aria-label="마이페이지"
                  >
                    <UserIcon size={24} color="#212529" />
                  </Link>
                </Header>
              </div>

              {/* 본문 컨텐츠 */}
              <div className="h-full w-full pt-14">
                <div className={onboardingStyles.stepHeader.wrapper}>
                  <h2 className={onboardingStyles.stepHeader.title}>
                    냉장고에는 어떤 재료를 <br />
                    가지고 계신가요?
                  </h2>
                  <p className={onboardingStyles.stepHeader.description}>
                    두가지만 골라도 요리를 추천해드릴게요
                  </p>
                </div>

                <IngredientsSearch
                  variant="main"
                  onSelectionChange={handleSelectionChange}
                />

                <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
                  <Button
                    onClick={handleComplete}
                    disabled={
                      selectedCount < MIN_SELECTED_FOODS || isSubmitting
                    }
                  >
                    {isSubmitting ? '제출 중...' : '레시피 추천받을게요'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

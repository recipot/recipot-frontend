import { useEffect, useRef, useState } from 'react';
import { recipe } from '@recipot/api';
import { useRouter } from 'next/navigation';

import { handleAuthError } from '@/utils/errorHandler';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// localStorage 키 상수
const TUTORIAL_CLOSED_KEY = 'recipe-recommend-tutorial-closed';
const BETA_NOTICE_CLOSED_KEY = 'recipe-recommend-beta-notice-closed';

interface UseTutorialParams {
  router: AppRouterInstance;
  hasRecipesAvailable: boolean;
  enabled?: boolean;
}

interface UseTutorialReturn {
  showTutorial: boolean;
  showBetaNotice: boolean;
  closeTutorial: () => void;
  closeBetaNotice: () => void;
  handleBetaNoticeOpenChange: (open: boolean) => void;
}

const getTutorialClosedState = (): boolean => {
  return localStorage.getItem(TUTORIAL_CLOSED_KEY) !== null;
};

const getBetaNoticeClosedState = (): boolean => {
  return localStorage.getItem(BETA_NOTICE_CLOSED_KEY) !== null;
};

const shouldShowBetaNotice = (
  isFirstEntry: boolean,
  betaNoticeClosed: boolean
): boolean => {
  return isFirstEntry && !betaNoticeClosed;
};

const shouldShowTutorial = (
  isFirstEntry: boolean,
  tutorialClosed: boolean,
  hasRecipesAvailable: boolean
): boolean => {
  return isFirstEntry && !tutorialClosed && hasRecipesAvailable;
};

/**
 * 튜토리얼 및 베타 안내 상태 관리 훅
 */
export const useTutorial = ({
  enabled = true,
  hasRecipesAvailable,
}: UseTutorialParams): UseTutorialReturn => {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showBetaNotice, setShowBetaNotice] = useState(false);
  const [shouldOpenTutorialAfterModal, setShouldOpenTutorialAfterModal] =
    useState(false);
  const isFirstEntryRef = useRef<boolean | null>(null);
  const hasFetchedProfileRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const updateTutorialDisplay = (isFirstEntry: boolean) => {
      const tutorialClosed = getTutorialClosedState();
      const betaNoticeClosed = getBetaNoticeClosedState();

      if (shouldShowBetaNotice(isFirstEntry, betaNoticeClosed)) {
        setShowBetaNotice(true);
        setShouldOpenTutorialAfterModal(
          shouldShowTutorial(isFirstEntry, tutorialClosed, hasRecipesAvailable)
        );
        return;
      }

      if (
        shouldShowTutorial(isFirstEntry, tutorialClosed, hasRecipesAvailable)
      ) {
        setShowTutorial(true);
      } else {
        setShowTutorial(false);
      }
    };

    // 프로필 조회는 한 번만 실행
    if (!hasFetchedProfileRef.current) {
      const fetchProfile = async () => {
        try {
          const userInfo = await recipe.getMyProfile();
          isFirstEntryRef.current = userInfo.isFirstEntry;
          hasFetchedProfileRef.current = true;
          updateTutorialDisplay(userInfo.isFirstEntry);
        } catch (error) {
          console.error('프로필 조회 실패:', error);
          if (handleAuthError(error, router)) {
            return;
          }
        }
      };
      fetchProfile();
      return;
    }

    // 프로필은 이미 조회했으므로 표시 여부만 업데이트
    if (isFirstEntryRef.current !== null) {
      updateTutorialDisplay(isFirstEntryRef.current);
    }
  }, [enabled, router, hasRecipesAvailable]);

  const closeTutorial = () => {
    // localStorage에 튜토리얼 닫음 플래그 저장
    localStorage.setItem(TUTORIAL_CLOSED_KEY, 'true');
    setShowTutorial(false);
  };

  const closeBetaNotice = () => {
    localStorage.setItem(BETA_NOTICE_CLOSED_KEY, 'true');
    setShowBetaNotice(false);

    if (shouldOpenTutorialAfterModal) {
      setShowTutorial(true);
      setShouldOpenTutorialAfterModal(false);
    }
  };

  const handleBetaNoticeOpenChange = (open: boolean) => {
    if (!open) {
      closeBetaNotice();
    } else {
      setShowBetaNotice(true);
    }
  };

  return {
    closeBetaNotice,
    closeTutorial,
    handleBetaNoticeOpenChange,
    showBetaNotice,
    showTutorial,
  };
};

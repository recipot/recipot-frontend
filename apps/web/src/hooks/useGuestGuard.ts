import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

/**
 * 게스트 사용자의 회원 전용 기능 접근을 제어하는 훅
 *
 * @example
 * // 네비게이션 가드
 * const { guardNavigation } = useGuestGuard();
 * <Link onClick={guardNavigation}>회원 전용 페이지</Link>
 *
 * @example
 * // 액션 가드
 * const { guardAction } = useGuestGuard();
 * const handleClick = () => guardAction(() => doSomething());
 */
export function useGuestGuard() {
  const isLoggedIn = useIsLoggedIn();
  const openLoginModal = useLoginModalStore(state => state.openModal);

  const isGuest = !isLoggedIn;

  /**
   * 네비게이션 이벤트 가드
   * 게스트일 경우 이동을 막고 로그인 모달 표시
   */
  const guardNavigation = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault();
      openLoginModal();
    }
  };

  /**
   * 액션 가드
   * 게스트일 경우 로그인 모달 표시, 로그인 상태면 콜백 실행
   */
  const guardAction = (callback: () => void) => {
    if (isGuest) {
      openLoginModal();
      return;
    }
    callback();
  };

  return { guardAction, guardNavigation, isGuest };
}

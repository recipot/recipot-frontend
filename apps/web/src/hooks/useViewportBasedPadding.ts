import { useEffect, useState } from 'react';

interface UseViewportBasedPaddingOptions {
  /**
   * 뷰포트 높이 대비 비율 (기본값: 0.8 = 80%)
   */
  ratio?: number;
  /**
   * 최소 padding 값 (기본값: 400px)
   */
  minPadding?: number;
  /**
   * 초기 padding 값 (기본값: 500px)
   */
  initialPadding?: number;
}

/**
 * 브라우저 높이(뷰포트)에 따라 동적으로 하단 여백(padding-bottom)을 계산하는 훅
 *
 * @example
 * ```tsx
 * const bottomPadding = useViewportBasedPadding({
 *   ratio: 0.8,
 *   minPadding: 400,
 * });
 *
 * <div style={{ paddingBottom: `${bottomPadding}px` }}>
 *   {children}
 * </div>
 * ```
 */
export function useViewportBasedPadding(
  options: UseViewportBasedPaddingOptions = {}
) {
  const {
    ratio = 0.8,
    minPadding = 400,
    initialPadding = 500,
  } = options;

  const [bottomPadding, setBottomPadding] = useState(initialPadding);

  useEffect(() => {
    const calculateBottomPadding = () => {
      if (typeof window === 'undefined') return;

      // 뷰포트 높이를 기준으로 계산
      const viewportHeight = window.innerHeight;
      // 비율을 곱하고 최소값 보장
      const padding = Math.max(viewportHeight * ratio, minPadding);
      setBottomPadding(padding);
    };

    // 초기 계산
    calculateBottomPadding();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', calculateBottomPadding);

    return () => {
      window.removeEventListener('resize', calculateBottomPadding);
    };
  }, [ratio, minPadding]);

  return bottomPadding;
}


'use client';

import { useEffect, useState } from 'react';

interface IntersectionScrollSpyOptions {
  rootRef: React.RefObject<HTMLElement>;
  sectionRefs: React.RefObject<HTMLElement>[];
  initialState?: string | null;
}

export const useIntersectionScrollSpy = ({
  initialState = null,
  rootRef,
  sectionRefs,
}: IntersectionScrollSpyOptions) => {
  const [activeSection, setActiveSection] = useState(initialState);

  useEffect(() => {
    if (!rootRef.current || sectionRefs.length === 0) return;

    const rootElement = rootRef.current;
    const rootHeight = rootElement.offsetHeight;

    // 스크롤 이벤트 기반 접근 방식 - 더 정확한 섹션 감지
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      // 각 섹션의 위치와 높이를 정확히 계산
      const sections = sectionRefs
        .map(ref => {
          if (!ref.current) return null;

          const rect = ref.current.getBoundingClientRect();
          const sectionId = ref.current.getAttribute('data-section');

          return {
            id: sectionId,
            top: rect.top + scrollTop,
            bottom: rect.bottom + scrollTop,
            height: rect.height,
            center: rect.top + rect.height / 2,
            distanceFromViewportTop: rect.top,
            element: ref.current,
          };
        })
        .filter(section => section !== null);

      // 현재 뷰포트에서 가장 적절한 섹션 찾기
      let bestSection = null;
      let bestScore = -Infinity;

      sections.forEach(section => {
        if (!section || !section.id) return;

        const { top, bottom, height, center, distanceFromViewportTop } =
          section;
        const id = section.id;

        // 탭 컨테이너 아래의 뷰포트 영역 계산
        const viewportTop = rootHeight + 20; // 탭 높이 + 여유공간
        const viewportBottom = viewportHeight;
        const viewportCenter = viewportTop + (viewportBottom - viewportTop) / 2;

        // 섹션이 뷰포트에 얼마나 보이는지 계산
        const visibleTop = Math.max(top, scrollTop + viewportTop);
        const visibleBottom = Math.min(bottom, scrollTop + viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / height;

        // 섹션 중심이 뷰포트 중심에 얼마나 가까운지 계산
        const centerDistance = Math.abs(center - (scrollTop + viewportCenter));
        const centerScore = Math.max(
          0,
          100 - (centerDistance / viewportHeight) * 100
        );

        // 섹션 상단이 뷰포트 상단에 얼마나 가까운지 계산
        const topDistance = Math.abs(distanceFromViewportTop - viewportTop);
        const topScore = Math.max(
          0,
          100 - (topDistance / viewportHeight) * 100
        );

        // 최종 점수 계산 (가시성 60%, 중심 거리 30%, 상단 거리 10%)
        const score = visibilityRatio * 60 + centerScore * 0.3 + topScore * 0.1;

        // 최소 가시성 임계값 (섹션이 최소 10% 이상 보여야 함)
        const minVisibilityThreshold = 0.1;

        // 디버깅을 위한 로그 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Section ${id}:`, {
            visibilityRatio: visibilityRatio.toFixed(2),
            centerScore: centerScore.toFixed(2),
            topScore: topScore.toFixed(2),
            totalScore: score.toFixed(2),
            height: height.toFixed(0),
            distanceFromViewportTop: distanceFromViewportTop.toFixed(0),
            meetsThreshold: visibilityRatio >= minVisibilityThreshold,
          });
        }

        // 최소 가시성 임계값을 만족하고 점수가 더 높은 경우에만 선택
        if (visibilityRatio >= minVisibilityThreshold && score > bestScore) {
          bestScore = score;
          bestSection = section;
        }
      });

      if (bestSection && (bestSection as any).id !== activeSection) {
        // 디버깅을 위한 로그 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.log(
            'Scroll Spy - Best section:',
            (bestSection as any).id,
            'Score:',
            bestScore.toFixed(2)
          );
        }

        setActiveSection((bestSection as any).id);
      }
    };

    // 초기 실행
    handleScroll();

    // 스크롤 이벤트 리스너 등록 (throttle 적용)
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [rootRef, sectionRefs, activeSection]);

  return { activeSection, setActiveSection };
};

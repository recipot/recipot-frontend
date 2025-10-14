'use client';

import { useEffect, useRef, useState } from 'react';

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!rootRef.current || sectionRefs.length === 0) return;

    const rootElement = rootRef.current;
    const rootHeight = rootElement.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const topMargin = rootHeight + 10;
    const bottomMargin = Math.min(50, viewportHeight * 0.05);

    const observerOptions = {
      root: null,
      rootMargin: `-${topMargin}px 0px -${bottomMargin}px 0px`,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    observerRef.current = new IntersectionObserver(entries => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isNearBottom = currentScrollY + windowHeight >= documentHeight - 50;

      if (isNearBottom) {
        const lastSection = sectionRefs[sectionRefs.length - 1];
        if (lastSection?.current) {
          const lastSectionId =
            lastSection.current.getAttribute('data-section');
          if (lastSectionId) {
            setActiveSection(prev =>
              prev !== lastSectionId ? lastSectionId : prev
            );
            return;
          }
        }
      }

      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      if (visibleEntries.length === 0) return;

      let bestEntry;
      if (isScrollingUp) {
        const validEntries = visibleEntries.filter(
          entry => entry.intersectionRatio >= 0.1
        );
        if (validEntries.length > 0) {
          bestEntry = validEntries.reduce((best, current) =>
            current.intersectionRatio > best.intersectionRatio ? current : best
          );
        }
      }

      bestEntry ??= visibleEntries.reduce((best, current) =>
        current.intersectionRatio > best.intersectionRatio ? current : best
      );

      const sectionId = (bestEntry.target as HTMLElement).getAttribute(
        'data-section'
      );

      if (sectionId) {
        setActiveSection(prev => {
          if (prev !== sectionId) {
            return sectionId;
          }
          return prev;
        });
      }
    }, observerOptions);

    sectionRefs.forEach(ref => {
      if (ref.current) {
        observerRef.current?.observe(ref.current);
      }
    });

    const handleResize = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [rootRef, sectionRefs]);

  return { activeSection, setActiveSection };
};

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
  const [rootHeight, setRootHeight] = useState(0);

  useEffect(() => {
    if (!rootRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (rootRef.current) {
          setRootHeight(rootRef.current.offsetHeight);
        }
      }, 150);
    };

    setRootHeight(rootRef.current.offsetHeight);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [rootRef]);

  useEffect(() => {
    if (rootHeight === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        rootMargin: `-${rootHeight}px 0px -70% 0px`,
        threshold: 0.1,
      }
    );

    sectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sectionRefs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [rootHeight, sectionRefs]);

  return { activeSection, setActiveSection };
};

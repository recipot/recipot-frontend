import { useState, useEffect, useRef } from 'react';

interface ScrollSpyOptions {
  /** GNB의 높이 등 화면 상단에서부터의 오프셋(px) */
  offset?: number;
}

/**
 * 페이지 스크롤에 따라 활성 섹션을 감지하고,
 * 해당 네비게이션 아이템을 자동으로 중앙에 위치시키는 훅
 * @param sectionIds - 감시할 섹션들의 ID 배열
 * @param options - offset 등 추가 옵션
 * @returns \{ activeSection, gnbRef \} - 활성 섹션 ID와 GNB 컨테이너에 부착할 ref
 */
export const useScrollSpy = (
  sectionIds: string[],
  options?: ScrollSpyOptions
) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const gnbRef = useRef<HTMLUListElement>(null);
  const offset = options?.offset ?? 80;

  useEffect(() => {
    const handleScroll = () => {
      let currentActiveSectionId: string | null = null;

      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

      if (isAtBottom) {
        currentActiveSectionId = sectionIds[sectionIds.length - 1];
      } else {
        for (const id of sectionIds) {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= offset) {
            currentActiveSectionId = id;
          }
        }
      }
      setActiveSection(currentActiveSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  useEffect(() => {
    if (!activeSection || !gnbRef.current) return;

    const activeElement = gnbRef.current.querySelector<HTMLLIElement>(
      `[data-section-id="${activeSection}"]`
    );

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeSection]);

  return { activeSection, gnbRef };
};

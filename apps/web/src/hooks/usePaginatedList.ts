import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePaginatedListOptions<T> {
  items: T[];
  itemsPerPage?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

interface UsePaginatedListReturn<T> {
  displayedItems: T[];
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  observerTargetRef: (node: HTMLElement | null) => void;
}

const DEFAULT_ITEMS_PER_PAGE = 20;

/**
 * 범용 페이지네이션 훅
 * 배열을 받아서 클라이언트 사이드에서 페이지네이션 처리
 * Intersection Observer를 사용한 무한스크롤 지원
 */
export function usePaginatedList<T>({
  items,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  scrollContainerRef,
}: UsePaginatedListOptions<T>): UsePaginatedListReturn<T> {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 무한 호출 방지를 위한 플래그들
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetElementRef = useRef<HTMLElement | null>(null);

  // items가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    const firstPageItems = items.slice(0, itemsPerPage);
    setDisplayedItems(firstPageItems);
    setCurrentPage(1);
    setHasMore(items.length > itemsPerPage);

    setIsLoadingMore(false);
    isLoadingRef.current = false;
  }, [items, itemsPerPage]);

  // 추가 데이터 로드 (클라이언트 사이드 페이지네이션)
  const loadMore = useCallback(() => {
    // 무한 호출 방지: 이미 로딩 중이거나 더 이상 데이터가 없으면 리턴
    if (isLoadingRef.current || !hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    isLoadingRef.current = true;

    try {
      // 다음 페이지 계산
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // 다음 페이지 데이터 추출
      const nextPageItems = items.slice(startIndex, endIndex);

      if (nextPageItems.length > 0) {
        // 표시할 아이템 목록에 추가
        setDisplayedItems(prev => [...prev, ...nextPageItems]);
        setCurrentPage(nextPage);

        // 더 표시할 데이터가 있는지 확인
        setHasMore(endIndex < items.length);
      } else {
        // 더 이상 데이터가 없음
        setHasMore(false);
      }
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [items, currentPage, hasMore, isLoadingMore, itemsPerPage]);

  // Intersection Observer 설정
  const observerTargetRef = useCallback(
    (node: HTMLElement | null) => {
      // 기존 observer 정리
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // 타겟 요소가 없거나 더 이상 데이터가 없으면 observer 생성하지 않음
      if (!node || !hasMore) {
        targetElementRef.current = null;
        return;
      }

      targetElementRef.current = node;

      // Intersection Observer 생성
      // root를 스크롤 컨테이너로 지정하여 테이블 내부 스크롤을 감지
      // scrollContainerRef가 준비되지 않았으면 기본 viewport 사용
      const createObserver = () => {
        observerRef.current = new IntersectionObserver(
          entries => {
            const [entry] = entries;

            // 타겟 요소가 뷰포트에 들어왔고, 로딩 중이 아니며, 더 이상 데이터가 있으면 로드
            if (
              entry.isIntersecting &&
              !isLoadingRef.current &&
              hasMore &&
              !isLoadingMore
            ) {
              loadMore();
            }
          },
          {
            // 스크롤 컨테이너를 root로 지정 (없으면 기본 viewport)
            root: scrollContainerRef?.current ?? null,
            // 뷰포트 하단 100px 전에 미리 로드
            rootMargin: '100px',
            threshold: 0.1,
          }
        );

        observerRef.current.observe(node);
      };

      // scrollContainerRef가 준비되지 않았으면 약간의 지연 후 재시도
      if (scrollContainerRef && !scrollContainerRef.current) {
        // 다음 틱에서 재시도
        setTimeout(() => {
          if (targetElementRef.current === node) {
            createObserver();
          }
        }, 0);
      } else {
        createObserver();
      }
    },
    [hasMore, isLoadingMore, loadMore, scrollContainerRef]
  );

  // 컴포넌트 언마운트 시 observer 정리
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMore,
    observerTargetRef,
  };
}

'use client';

import { AllergyProvider } from '../context/AllergyContext';

import type { ReactNode, RefObject } from 'react';

interface AllergyRootProps {
  children: ReactNode;
  formId: string;
  initialSelectedItems?: number[];
  scrollConfig?: {
    containerRef?: RefObject<HTMLElement>;
    navigationOffset?: number;
    scrollSpyOffset?: number;
    useWindowScroll?: boolean;
  };
}

/**
 * Allergy.Root
 * 알레르기 컴포넌트의 최상위 컨테이너
 * Context Provider로 모든 하위 컴포넌트에 상태와 로직 제공
 *
 * @param children - 자식 컴포넌트
 * @param formId - 폼 ID (외부 버튼과 연결용)
 * @param initialSelectedItems - 초기 선택된 항목 ID 배열
 * @param scrollConfig - 스크롤 설정
 *   - containerRef: 스크롤 컨테이너 ref (드로어용)
 *   - navigationOffset: 네비게이션 오프셋
 *   - scrollSpyOffset: ScrollSpy 오프셋
 *   - useWindowScroll: 윈도우 스크롤 사용 여부
 */
export default function AllergyRoot({
  children,
  formId,
  initialSelectedItems,
  scrollConfig,
}: AllergyRootProps) {
  return (
    <AllergyProvider
      formId={formId}
      initialSelectedItems={initialSelectedItems}
      scrollConfig={scrollConfig}
    >
      {children}
    </AllergyProvider>
  );
}

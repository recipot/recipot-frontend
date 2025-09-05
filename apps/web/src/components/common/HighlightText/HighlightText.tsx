import React from 'react';

import { findMatchIndex } from '@/utils/koreanSearch';

interface HighlightTextProps {
  /** 표시할 텍스트 */
  text: string;
  /** 하이라이트할 검색어 */
  searchQuery: string;
  /** 하이라이트 스타일 클래스명 */
  highlightClassName?: string;
  /** 텍스트 컨테이너 클래스명 */
  className?: string;
}

/**
 * 검색어와 매칭되는 부분을 하이라이트하는 컴포넌트
 */
export function HighlightText({
  className = '',
  highlightClassName = 'bg-yellow-200 font-semibold',
  searchQuery,
  text,
}: HighlightTextProps) {
  // 검색어가 없으면 원본 텍스트를 그대로 반환
  if (!searchQuery.trim()) {
    return <span className={className}>{text}</span>;
  }

  // 매칭되는 부분의 인덱스 찾기
  const matchIndex = findMatchIndex(text, searchQuery);

  // 매칭되는 부분이 없으면 원본 텍스트를 그대로 반환
  if (!matchIndex) {
    return <span className={className}>{text}</span>;
  }

  const { length, start } = matchIndex;
  const beforeMatch = text.substring(0, start);
  const matchText = text.substring(start, start + length);
  const afterMatch = text.substring(start + length);

  return (
    <span className={className}>
      {beforeMatch}
      <span className={highlightClassName}>{matchText}</span>
      {afterMatch}
    </span>
  );
}

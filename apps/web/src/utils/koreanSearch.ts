/**
 * 한글 검색을 위한 유틸리티 함수들
 */

// 한글 유니코드 범위 상수
const KOREAN_UNICODE = {
  // 완성된 한글의 유니코드 시작점
  BASE: 0xac00,
  // 초성의 개수
  CHOSUNG_COUNT: 19,
  // 중성의 개수
  JUNGSUNG_COUNT: 21,
  // 종성의 개수
  JONGSUNG_COUNT: 28,
};

// 초성 배열
const CHOSUNG_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

// 중성 배열
const JUNGSUNG_LIST = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];

// 종성 배열
const JONGSUNG_LIST = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

/**
 * 한글 문자를 자모음으로 분리하는 함수
 * @param char 분리할 한글 문자
 * @returns 초성, 중성, 종성이 포함된 객체
 */
export function separateKorean(char: string): {
  chosung: string;
  jungsung: string;
  jongsung: string;
} {
  const charCode = char.charCodeAt(0);

  // 완성된 한글이 아닌 경우
  if (
    charCode < KOREAN_UNICODE.BASE ||
    charCode > KOREAN_UNICODE.BASE + 11171
  ) {
    return { chosung: char, jongsung: '', jungsung: '' };
  }

  const code = charCode - KOREAN_UNICODE.BASE;

  const chosungIndex = Math.floor(
    code / (KOREAN_UNICODE.JUNGSUNG_COUNT * KOREAN_UNICODE.JONGSUNG_COUNT)
  );
  const jungsungIndex = Math.floor(
    (code % (KOREAN_UNICODE.JUNGSUNG_COUNT * KOREAN_UNICODE.JONGSUNG_COUNT)) /
      KOREAN_UNICODE.JONGSUNG_COUNT
  );
  const jongsungIndex = code % KOREAN_UNICODE.JONGSUNG_COUNT;

  return {
    chosung: CHOSUNG_LIST[chosungIndex] || '',
    jongsung: JONGSUNG_LIST[jongsungIndex] || '',
    jungsung: JUNGSUNG_LIST[jungsungIndex] || '',
  };
}

/**
 * 문자열의 초성만 추출하는 함수
 * @param text 초성을 추출할 문자열
 * @returns 초성 문자열
 */
export function getChosung(text: string): string {
  return text
    .split('')
    .map(char => {
      const { chosung } = separateKorean(char);
      return chosung;
    })
    .join('');
}

/**
 * 한글 검색 매칭 함수
 * @param target 검색 대상 문자열
 * @param query 검색어
 * @returns 매칭 여부
 */
export function matchKoreanSearch(target: string, query: string): boolean {
  if (!query) return true;
  if (!target) return false;

  const normalizedTarget = target.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  // 1. 완전 매칭 (일반 포함 검색)
  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  // 2. 검색어가 완성된 한글인지 확인
  const isCompleteKorean = query.split('').every(char => {
    const charCode = char.charCodeAt(0);
    return charCode >= 0xac00 && charCode <= 0xd7a3; // 완성된 한글 범위 (가-힣)
  });

  // 완성된 한글이면 부분 매칭 수행
  if (isCompleteKorean) {
    // 검색어가 한 글자인 경우, 초성과 중성이 같은 글자가 있는지 확인
    if (query.length === 1) {
      const queryParts = separateKorean(query);

      return target.split('').some(targetChar => {
        const targetParts = separateKorean(targetChar);

        // 검색어에 종성이 있는 경우: 정확히 일치하거나 검색어로 시작하는 경우만 매칭
        // 예: '당' 입력시 '당근'은 매칭되지만 '닭고기'는 매칭되지 않음
        if (queryParts.jongsung !== '') {
          return targetChar === query || targetChar.startsWith(query);
        }

        // 검색어에 종성이 없는 경우: 초성과 중성이 같으면 매칭 (종성은 무시)
        // 예: '가' 입력시 '감', '간', '갈' 등이 매칭됨
        return (
          queryParts.chosung === targetParts.chosung &&
          queryParts.jungsung === targetParts.jungsung
        );
      });
    }

    // 검색어가 여러 글자인 경우는 정확한 매칭만 (이미 위에서 처리됨)
    return false;
  }

  // 3. 자음만 입력된 경우에만 초성 매칭 수행
  const isOnlyChosung = query
    .split('')
    .every(char => CHOSUNG_LIST.includes(char));

  if (isOnlyChosung) {
    // 모든 자음이 순서대로 매칭되는지 확인
    return target.split('').some((_, startIndex) => {
      return query.split('').every((queryChar, queryIndex) => {
        if (startIndex + queryIndex >= target.length) return false;
        const targetChar = target.charAt(startIndex + queryIndex);
        const { chosung } = separateKorean(targetChar);
        return chosung === queryChar;
      });
    });
  }

  return false;
}

/**
 * 문자열에서 검색어와 매칭되는 부분의 인덱스를 찾는 함수
 * @param target 검색 대상 문자열
 * @param query 검색어
 * @returns 매칭되는 부분의 시작 인덱스와 길이 {length: number, start: number} 또는 null
 */
export function findMatchIndex(
  target: string,
  query: string
): { length: number; start: number } | null {
  if (!query || !target) return null;

  const normalizedTarget = target.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  // 1. 완전 매칭 우선 (일반 포함 검색)
  const exactIndex = normalizedTarget.indexOf(normalizedQuery);
  if (exactIndex !== -1) {
    return { length: query.length, start: exactIndex };
  }

  // 2. 완성된 한글 문자로만 구성된 검색어만 하이라이팅
  // 자음만 입력된 경우(예: 'ㄱ')는 하이라이팅하지 않음
  const isCompleteKorean = query.split('').every(char => {
    const charCode = char.charCodeAt(0);
    // 완성된 한글 범위 (가-힣) 또는 영문/숫자인지 확인
    return (
      (charCode >= 0xac00 && charCode <= 0xd7a3) || /[a-zA-Z0-9]/.test(char)
    );
  });

  if (!isCompleteKorean) {
    return null; // 자음/모음만 입력된 경우 하이라이팅하지 않음
  }

  return null;
}

/**
 * 검색어와의 매칭 정확도를 계산하는 함수
 * @param target 검색 대상 문자열
 * @param query 검색어
 * @returns 매칭 정확도 (숫자가 낮을수록 더 정확한 매칭)
 */
function getMatchPriority(target: string, query: string): number {
  if (!query || !target) return 999;

  const normalizedTarget = target.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  // 1. 완전 매칭 (가장 높은 우선순위)
  if (normalizedTarget.includes(normalizedQuery)) {
    // 정확히 일치하는 경우
    if (normalizedTarget === normalizedQuery) return 0;
    // 시작부분이 일치하는 경우
    if (normalizedTarget.startsWith(normalizedQuery)) return 1;
    // 포함되는 경우
    return 2;
  }

  // 2. 완성된 한글 부분 매칭
  const isCompleteKorean = query.split('').every(char => {
    const charCode = char.charCodeAt(0);
    return charCode >= 0xac00 && charCode <= 0xd7a3;
  });

  if (isCompleteKorean && query.length === 1) {
    const queryParts = separateKorean(query);

    // 첫 번째 글자가 정확히 매칭되는 경우
    if (target.length > 0) {
      const firstTargetParts = separateKorean(target[0]);
      if (
        queryParts.chosung === firstTargetParts.chosung &&
        queryParts.jungsung === firstTargetParts.jungsung
      ) {
        return 3; // 완성된 한글 부분 매칭
      }
    }
  }

  // 3. 자음 매칭
  const isOnlyChosung = query
    .split('')
    .every(char => CHOSUNG_LIST.includes(char));

  if (isOnlyChosung) {
    return 4; // 자음 매칭
  }

  return 999; // 매칭되지 않음
}

/**
 * 배열을 한글 검색으로 필터링하고 정확도순으로 정렬하는 함수
 * @param items 검색할 배열
 * @param query 검색어
 * @param getSearchText 각 아이템에서 검색할 텍스트를 추출하는 함수
 * @returns 필터링되고 정렬된 배열
 */
export function filterByKoreanSearch<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string
): T[] {
  if (!query.trim()) return [];

  // 필터링된 아이템들을 우선순위와 함께 저장
  const filteredWithPriority = items
    .filter(item => {
      const searchText = getSearchText(item);
      return matchKoreanSearch(searchText, query);
    })
    .map(item => ({
      item,
      priority: getMatchPriority(getSearchText(item), query),
    }));

  // 우선순위에 따라 정렬하고 아이템만 반환
  return filteredWithPriority
    .sort((a, b) => {
      // 우선순위가 같으면 원래 순서 유지 (안정 정렬)
      if (a.priority === b.priority) {
        return 0;
      }
      return a.priority - b.priority;
    })
    .map(({ item }) => item);
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFoodList } from '@/hooks/useFoodList';
import { useSubmitSelectedFoods } from '@/hooks/useSubmitSelectedFoods';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import type { Food } from '@/types/food.types';

import FoodAdd from './IngredientsSearch';

// Mock hooks
vi.mock('@/hooks/useFoodList');
vi.mock('@/hooks/useSubmitSelectedFoods');
vi.mock('@/stores/selectedFoodsStore');

// Mock components
vi.mock('@/components/common/SearchInput', () => ({
  SearchInput: ({ onChange, onClear, value }: any) => (
    <div data-testid="search-input">
      <input
        value={value}
        onChange={onChange}
        data-testid="search-input-field"
      />
      <button onClick={onClear} data-testid="search-clear-button">
        Clear
      </button>
    </div>
  ),
}));

vi.mock('@/components/common/HighlightText', () => ({
  HighlightText: ({ searchQuery, text }: any) => (
    <span data-testid="highlight-text" data-search-query={searchQuery}>
      {text}
    </span>
  ),
}));

vi.mock('@/components/common/Button', () => ({
  Button: ({ children, className, disabled, onClick, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock data
const mockFoods: Food[] = [
  { category: 'vegetable', id: 1, name: '감자' },
  { category: 'vegetable', id: 2, name: '고구마' },
  { category: 'vegetable', id: 3, name: '당근' },
  { category: 'meat', id: 4, name: '닭고기' },
  { category: 'vegetable', id: 5, name: '가지' },
  { category: 'seafood', id: 6, name: '갈치' },
  { category: 'sauce', id: 7, name: '간장' },
];

const mockUseFoodList = vi.mocked(useFoodList);
const mockUseSubmitSelectedFoods = vi.mocked(useSubmitSelectedFoods);
const mockUseSelectedFoodsStore = vi.mocked(useSelectedFoodsStore);

describe('FoodAdd', () => {
  const mockOnSubmissionSuccess = vi.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });

    // Reset all mocks
    vi.clearAllMocks();

    // Mock useFoodList
    mockUseFoodList.mockReturnValue({
      data: mockFoods,
      error: null,
      isLoading: false,
    } as any);

    // Mock useSubmitSelectedFoods
    mockUseSubmitSelectedFoods.mockReturnValue({
      error: null,
      isPending: false,
      mutate: vi.fn(),
    } as any);

    // Mock useSelectedFoodsStore
    mockUseSelectedFoodsStore.mockReturnValue({
      addFood: vi.fn(),
      clearAllFoods: vi.fn(),
      getSelectedCount: vi.fn().mockReturnValue(0),
      getSelectedFoods: vi.fn(),
      isSelected: vi.fn().mockReturnValue(false),
      removeFood: vi.fn(),
      selectedFoodIds: [],
      toggleFood: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderFoodAdd = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FoodAdd onSubmissionSuccess={mockOnSubmissionSuccess} />
      </QueryClientProvider>
    );
  };

  describe('로딩 상태', () => {
    it('재료 목록 로딩 중일 때 로딩 메시지를 표시한다', () => {
      mockUseFoodList.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as any);

      renderFoodAdd();

      expect(
        screen.getByText('재료 목록을 불러오는 중...')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
    });
  });

  describe('검색 기능', () => {
    it('검색어를 입력하면 필터링된 재료 목록을 표시한다', async () => {
      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '당' } });

      await waitFor(() => {
        expect(screen.getByText('당근')).toBeInTheDocument();
      });

      // '닭고기'는 '당'으로 검색했을 때 나오지 않아야 함
      expect(screen.queryByText('닭고기')).not.toBeInTheDocument();
    });

    it('한 글자 검색어로 검색할 때 초성과 중성이 같은 재료들을 표시한다', async () => {
      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '가' } });

      await waitFor(() => {
        expect(screen.getByText('가지')).toBeInTheDocument();
        expect(screen.getByText('갈치')).toBeInTheDocument();
        expect(screen.getByText('간장')).toBeInTheDocument();
      });
    });

    it('검색어가 없을 때는 검색 결과를 표시하지 않는다', () => {
      renderFoodAdd();

      expect(screen.queryByText('당근')).not.toBeInTheDocument();
      expect(screen.queryByText('닭고기')).not.toBeInTheDocument();
    });

    it('검색어를 지우면 검색 결과가 사라진다', async () => {
      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      const clearButton = screen.getByTestId('search-clear-button');

      // 검색어 입력
      fireEvent.change(searchInput, { target: { value: '당' } });
      await waitFor(() => {
        expect(screen.getByText('당근')).toBeInTheDocument();
      });

      // 검색어 지우기
      fireEvent.click(clearButton);
      await waitFor(() => {
        expect(screen.queryByText('당근')).not.toBeInTheDocument();
      });
    });
  });

  describe('재료 선택 기능', () => {
    it('재료를 클릭하면 선택 상태가 토글된다', async () => {
      const mockToggleFood = vi.fn();
      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(0),
        getSelectedFoods: vi.fn(),
        isSelected: vi.fn().mockReturnValue(false),
        removeFood: vi.fn(),
        selectedFoodIds: [],
        toggleFood: mockToggleFood,
      });

      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '당' } });

      await waitFor(() => {
        expect(screen.getByText('당근')).toBeInTheDocument();
      });

      const foodButton = screen.getByText('당근').closest('button');
      if (foodButton) {
        fireEvent.click(foodButton);
      }

      expect(mockToggleFood).toHaveBeenCalledWith(3); // 당근의 id
    });

    it('선택된 재료는 활성화된 스타일이 적용된다', async () => {
      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(1),
        getSelectedFoods: vi.fn(),
        isSelected: vi.fn().mockImplementation((id: number) => id === 3),
        removeFood: vi.fn(),
        selectedFoodIds: [3], // 당근 선택됨
        toggleFood: vi.fn(),
      });

      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '당' } });

      await waitFor(() => {
        const foodButtons = screen.getAllByText('당근');
        const searchResultButton = foodButtons.find(
          button =>
            button.closest('button')?.getAttribute('data-testid') === 'button'
        );
        expect(searchResultButton?.closest('button')).toHaveClass(
          'border-secondary-soft-green',
          'bg-secondary-light-green',
          'text-primary'
        );
      });
    });
  });

  describe('제출 기능', () => {
    it('선택된 재료가 2개 미만일 때 제출 버튼이 비활성화된다', () => {
      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(1),
        getSelectedFoods: vi.fn(),
        isSelected: vi.fn().mockImplementation((id: number) => id === 1),
        removeFood: vi.fn(),
        selectedFoodIds: [1], // 1개만 선택
        toggleFood: vi.fn(),
      });

      renderFoodAdd();

      const submitButton = screen.getByText('여유에 맞는 요리 추천받기');
      expect(submitButton).toBeDisabled();
    });

    it('선택된 재료가 2개 이상일 때 제출 버튼이 활성화된다', () => {
      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(2),
        getSelectedFoods: vi.fn(),
        isSelected: vi
          .fn()
          .mockImplementation((id: number) => [1, 3].includes(id)),
        removeFood: vi.fn(),
        selectedFoodIds: [1, 3], // 2개 선택
        toggleFood: vi.fn(),
      });

      renderFoodAdd();

      const submitButton = screen.getByText('여유에 맞는 요리 추천받기');
      expect(submitButton).not.toBeDisabled();
    });

    it('제출 중일 때 로딩 스피너가 표시되고 버튼이 비활성화된다', () => {
      const mockMutate = vi.fn();
      mockUseSubmitSelectedFoods.mockReturnValue({
        error: null,
        isPending: true,
        mutate: mockMutate,
      } as any);

      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(2),
        getSelectedFoods: vi.fn(),
        isSelected: vi
          .fn()
          .mockImplementation((id: number) => [1, 3].includes(id)),
        removeFood: vi.fn(),
        selectedFoodIds: [1, 3],
        toggleFood: vi.fn(),
      });

      renderFoodAdd();

      const submitButton = screen.getByText('여유에 맞는 요리 추천받기');
      expect(submitButton).toBeDisabled();
      // Loader2 컴포넌트는 SVG이므로 클래스명으로 확인
      expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('제출 버튼을 클릭하면 선택된 재료를 전송한다', () => {
      const mockMutate = vi.fn();
      mockUseSubmitSelectedFoods.mockReturnValue({
        error: null,
        isPending: false,
        mutate: mockMutate,
      } as any);

      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(2),
        getSelectedFoods: vi.fn(),
        isSelected: vi
          .fn()
          .mockImplementation((id: number) => [1, 3].includes(id)),
        removeFood: vi.fn(),
        selectedFoodIds: [1, 3],
        toggleFood: vi.fn(),
      });

      renderFoodAdd();

      const submitButton = screen.getByText('여유에 맞는 요리 추천받기');
      fireEvent.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith([1, 3], expect.any(Object));
    });

    it('제출 성공 시 onSubmissionSuccess 콜백이 호출된다', () => {
      const mockMutate = vi.fn((selectedIds, options) => {
        // 성공 콜백 시뮬레이션
        options.onSuccess();
      });

      mockUseSubmitSelectedFoods.mockReturnValue({
        error: null,
        isPending: false,
        mutate: mockMutate,
      } as any);

      mockUseSelectedFoodsStore.mockReturnValue({
        addFood: vi.fn(),
        clearAllFoods: vi.fn(),
        getSelectedCount: vi.fn().mockReturnValue(2),
        getSelectedFoods: vi.fn(),
        isSelected: vi
          .fn()
          .mockImplementation((id: number) => [1, 3].includes(id)),
        removeFood: vi.fn(),
        selectedFoodIds: [1, 3],
        toggleFood: vi.fn(),
      });

      renderFoodAdd();

      const submitButton = screen.getByText('여유에 맞는 요리 추천받기');
      fireEvent.click(submitButton);

      expect(mockOnSubmissionSuccess).toHaveBeenCalled();
    });
  });

  describe('한글 검색 기능', () => {
    it('종성이 있는 한글 검색어는 정확한 매칭만 수행한다', async () => {
      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '당' } });

      await waitFor(() => {
        expect(screen.getByText('당근')).toBeInTheDocument();
        expect(screen.queryByText('닭고기')).not.toBeInTheDocument();
      });
    });

    it('종성이 없는 한글 검색어는 초성과 중성이 같은 재료들을 찾는다', async () => {
      renderFoodAdd();

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '가' } });

      await waitFor(() => {
        expect(screen.getByText('가지')).toBeInTheDocument();
        expect(screen.getByText('갈치')).toBeInTheDocument();
        expect(screen.getByText('간장')).toBeInTheDocument();
      });
    });
  });
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import type { ReviewData } from '@/types/review.types';

import { ReviewBottomSheet } from '.';

// QueryClient 생성 함수
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// 테스트용 래퍼 컴포넌트
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

type MockAuthStoreState = {
  token: string | null;
  user: unknown;
};

const mockUseAuthStore = vi.hoisted(() => {
  const state: MockAuthStoreState = {
    token: 'mock-token',
    user: { id: 1, name: '테스터' },
  };

  return vi.fn((selector?: (state: MockAuthStoreState) => unknown) =>
    selector ? selector(state) : state
  );
});

// axios 모킹
// vi.hoisted를 사용하여 모킹 함수 내부에서 사용할 수 있는 변수 생성
const { mockAxiosGet, mockAxiosPost, mockInstanceGet, mockInstancePost } =
  vi.hoisted(() => {
    // 인스턴스용 mock 함수들 (createApiInstance에서 생성되는 인스턴스의 get/post용)
    const instanceGet = vi.fn();
    const instancePost = vi.fn();

    // 일반 axios 함수들 (직접 axios.get/post 호출 시 사용)
    const axiosGet = vi.fn();
    const axiosPost = vi.fn();

    return {
      mockAxiosGet: axiosGet,
      mockAxiosPost: axiosPost,
      mockInstanceGet: instanceGet,
      mockInstancePost: instancePost,
    };
  });

vi.mock('axios', () => {
  // axios 인스턴스 모킹 (createApiInstance에서 사용)
  const mockAxiosInstance = {
    get: mockInstanceGet,
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    post: mockInstancePost,
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      get: mockAxiosGet,
      isAxiosError: (error: unknown) => error instanceof Error,
      post: mockAxiosPost,
    },
    isAxiosError: (error: unknown) => error instanceof Error,
  };
});

// useAuth 모킹
vi.mock('@recipot/contexts', () => ({
  useAuth: vi.fn(() => ({
    googleLogin: vi.fn(),
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshAuth: vi.fn(),
    refreshToken: null,
    setRefreshToken: vi.fn(),
    setToken: vi.fn(),
    setUser: vi.fn(),
    token: 'mock-token',
    user: null,
  })),
  useAuthStore: mockUseAuthStore,
}));

// Drawer 컴포넌트를 간단한 div로 모킹
let mockOnOpenChange: ((open: boolean) => void) | null = null;

vi.mock('../ui/drawer', () => ({
  Drawer: ({
    children,
    onOpenChange,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    mockOnOpenChange = onOpenChange;
    return open ? <div data-testid="drawer">{children}</div> : null;
  },
  DrawerClose: ({ children }: { children: React.ReactNode }) => (
    <button
      onClick={() => mockOnOpenChange?.(false)}
      data-testid="drawer-close"
    >
      {children}
    </button>
  ),
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="drawer-description">{children}</p>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="drawer-title">{children}</h2>
  ),
}));

const mockReviewData: ReviewData = {
  completionCount: 2,
  completionMessage: '완료 메시지',
  difficultyOptions: [
    { code: 'R04001', codeName: '힘들어요' },
    { code: 'R04002', codeName: '적당해요' },
    { code: 'R04003', codeName: '쉬워요' },
  ],
  experienceOptions: [
    { code: 'R05001', codeName: '어려워요' },
    { code: 'R05002', codeName: '적당해요' },
    { code: 'R05003', codeName: '간단해요' },
  ],
  recipeId: 1,
  recipeImageUrl: '/recipeImage.png',
  recipeName: '김치찌개',
  tasteOptions: [
    { code: 'R03001', codeName: '별로예요' },
    { code: 'R03002', codeName: '그저그래요' },
    { code: 'R03003', codeName: '맛있어요' },
  ],
};

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  recipeId: 1,
};

describe('ReviewBottomSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // createApiInstance를 통해 생성된 인스턴스의 get/post 메서드 설정
    mockInstanceGet.mockResolvedValue({
      data: { data: mockReviewData },
    });
    mockInstancePost.mockResolvedValue({ data: { success: true } });
    // 직접 axios 호출용 (현재는 사용하지 않지만 호환성을 위해)
    mockAxiosGet.mockResolvedValue({
      data: { data: mockReviewData },
    });
    mockAxiosPost.mockResolvedValue({ data: { success: true } });
  });

  it('렌더링되지 않아야 함 (isOpen이 false일 때)', async () => {
    render(<ReviewBottomSheet {...defaultProps} isOpen={false} />, { wrapper });
    await waitFor(() => {
      expect(screen.queryByText('김치찌개')).not.toBeInTheDocument();
    });
  });

  it('올바르게 렌더링되어야 함', async () => {
    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
      expect(screen.getByText('2번째 레시피 해먹기 완료!')).toBeInTheDocument();
      expect(screen.getByText('요리의 맛은 어땠나요?')).toBeInTheDocument();
      expect(
        screen.getByText('요리를 시작하기가 어땠나요?')
      ).toBeInTheDocument();
      expect(screen.getByText('직접 요리해보니 어땠나요?')).toBeInTheDocument();
      expect(screen.getByText('기타 의견이 있어요!')).toBeInTheDocument();
    });
  });

  it('닫기 버튼이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    const headerButtons = screen.getAllByRole('button');
    const closeButton = headerButtons.find(
      button =>
        button.querySelector('svg') && button.className.includes('rounded-full')
    );

    expect(closeButton).toBeDefined();
    if (closeButton) {
      await user.click(closeButton);
    }

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('감정 선택이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('emotion-section-taste')).toBeInTheDocument();
    });

    const tasteSection = screen.getByTestId('emotion-section-taste');
    const tasteButton = within(tasteSection).getByRole('button', {
      name: '맛있어요',
    });
    await user.click(tasteButton);
    expect(tasteButton).toHaveClass('bg-secondary-light-green');
  });

  it('댓글 입력이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('review-comment-textarea')).toBeInTheDocument();
    });

    const commentInput = screen.getByTestId('review-comment-textarea');
    await user.type(commentInput, '정말 맛있었어요!');

    expect(commentInput).toHaveValue('정말 맛있었어요!');
  });
  it('모든 항목이 선택되면 기타 의견을 입력하는 textarea로 자동 스크롤이 되어야 함', async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();

    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    // textarea 요소 찾기
    const textarea = screen.getByTestId('review-comment-textarea');

    // scrollIntoView 메서드 모킹
    textarea.scrollIntoView = scrollIntoViewMock;

    // 첫 번째 항목 선택 (맛)
    const tasteSection = screen.getByTestId('emotion-section-taste');
    const tasteButton = within(tasteSection).getByRole('button', {
      name: '맛있어요',
    });
    await user.click(tasteButton);

    // scrollIntoView가 아직 호출되지 않았는지 확인
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    // 두 번째 항목 선택 (난이도)
    const difficultySection = screen.getByTestId('emotion-section-difficulty');
    const difficultyButton = within(difficultySection).getByRole('button', {
      name: '적당해요',
    });
    await user.click(difficultyButton);

    // scrollIntoView가 아직 호출되지 않았는지 확인
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    // 세 번째 항목 선택 (경험) - 이제 모든 항목이 선택됨
    const experienceSection = screen.getByTestId('emotion-section-experience');
    const experienceButton = within(experienceSection).getByRole('button', {
      name: '간단해요',
    });
    await user.click(experienceButton);

    // 모든 항목이 선택되었을 때 scrollIntoView가 호출되어야 함
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });

  it('다양한 reviewData에 따라 올바르게 렌더링되어야 함', async () => {
    // 이미지가 없을 때
    mockInstanceGet.mockResolvedValueOnce({
      data: {
        data: {
          ...mockReviewData,
          recipeImageUrl: undefined,
        },
      },
    });
    const { rerender } = render(<ReviewBottomSheet {...defaultProps} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    // 첫 번째 완료일 때
    mockInstanceGet.mockResolvedValueOnce({
      data: {
        data: {
          ...mockReviewData,
          completionCount: 1,
        },
      },
    });
    rerender(<ReviewBottomSheet {...defaultProps} recipeId={2} />);
    await waitFor(() => {
      expect(screen.getByText('1번째 레시피 해먹기 완료!')).toBeInTheDocument();
    });

    // 긴 레시피 이름일 때
    mockInstanceGet.mockResolvedValueOnce({
      data: {
        data: {
          ...mockReviewData,
          recipeName: '매운 돼지고기 김치찌개',
        },
      },
    });
    rerender(<ReviewBottomSheet {...defaultProps} recipeId={3} />);
    await waitFor(() => {
      expect(screen.getByText('매운 돼지고기 김치찌개')).toBeInTheDocument();
    });
  });
});

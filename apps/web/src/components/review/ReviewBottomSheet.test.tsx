import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
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

// axios 모킹
const mockAxiosGet = vi.fn();
const mockAxiosPost = vi.fn();

vi.mock('axios', () => ({
  default: {
    get: (...args: unknown[]) => mockAxiosGet(...args),
    isAxiosError: (error: unknown) => error instanceof Error,
    post: (...args: unknown[]) => mockAxiosPost(...args),
  },
  isAxiosError: (error: unknown) => error instanceof Error,
}));

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
  recipeId: 'recipe-1',
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
      expect(screen.getByText('맛있어요')).toBeInTheDocument();
    });

    const tasteButton = screen.getByRole('button', { name: '맛있어요' });
    await user.click(tasteButton);
    expect(tasteButton).toHaveClass('bg-secondary-light-green');
  });

  it('모든 감정을 선택하고 댓글을 입력해야 제출 버튼이 활성화되어야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('맛있어요')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /후기 등록하기/i });
    const commentInput = screen.getByPlaceholderText('내용을 입력해 주세요');

    expect(submitButton).toBeDisabled();

    // 맛 선택
    await user.click(screen.getByText('맛있어요'));
    expect(submitButton).toBeDisabled();

    // 시작하기 선택
    await user.click(screen.getByText('쉬워요'));
    expect(submitButton).toBeDisabled();

    // 직접 요리 선택
    await user.click(screen.getByText('간단해요'));
    expect(submitButton).toBeDisabled(); // 아직 댓글을 입력하지 않았으므로 비활성화

    // 댓글 입력
    await user.type(commentInput, '정말 맛있었어요!');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('댓글 입력이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('내용을 입력해 주세요')
      ).toBeInTheDocument();
    });

    const commentInput = screen.getByPlaceholderText('내용을 입력해 주세요');
    await user.type(commentInput, '정말 맛있었어요!');

    expect(commentInput).toHaveValue('정말 맛있었어요!');
  });

  // TODO: 백엔드 확인 필요
  // it('완전한 폼 제출이 작동해야 함', async () => {
  //   const user = userEvent.setup();
  //   render(<ReviewBottomSheet {...defaultProps} />, { wrapper });

  //   // 모든 감정 선택
  //   await user.click(screen.getByText('맛있어요'));
  //   await user.click(screen.getByText('쉬워요'));
  //   await user.click(screen.getByText('간단해요'));

  //   // 댓글 입력 - fireEvent 사용 (react-hook-form과 호환)
  //   const commentInput = screen.getByPlaceholderText('내용을 입력해 주세요');
  //   fireEvent.change(commentInput, {
  //     target: { value: '정말 맛있었어요!' },
  //   });

  //   // 제출
  //   const submitButton = screen.getByRole('button', { name: /후기 등록하기/i });
  //   await user.click(submitButton);

  //   expect(defaultProps.onSubmit).toHaveBeenCalledWith({
  //     comment: '정말 맛있었어요!',
  //     emotions: {
  //       difficulty: 'easy',
  //       experience: 'easy',
  //       taste: 'good',
  //     },
  //   });
  // });

  it('다양한 reviewData에 따라 올바르게 렌더링되어야 함', async () => {
    // 이미지가 없을 때
    mockAxiosGet.mockResolvedValueOnce({
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
    mockAxiosGet.mockResolvedValueOnce({
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
    mockAxiosGet.mockResolvedValueOnce({
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

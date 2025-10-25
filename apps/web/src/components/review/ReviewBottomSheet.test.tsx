import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { vi } from 'vitest';

import { ReviewBottomSheet } from '.';

// axios 모킹
vi.mock('axios');

// @recipot/api 모킹
vi.mock('@recipot/api', () => ({
  tokenUtils: {
    getToken: vi.fn().mockReturnValue('mock-token'),
    removeToken: vi.fn(),
    setToken: vi.fn(),
  },
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

const mockConditionsResponse = {
  data: {
    data: {
      conditions: [{ id: 1, name: 'test-condition' }],
    },
  },
};

const mockReviewDataResponse = {
  data: {
    data: {
      completionCount: 2,
      completionMessage: '2번째 해먹기 완료!',
      difficultyOptions: [
        { code: 'R04001', codeName: '부담스러웠어요' },
        { code: 'R04002', codeName: '보통이었어요' },
        { code: 'R04003', codeName: '쉬웠어요' },
      ],
      experienceOptions: [
        { code: 'R05001', codeName: '복잡했어요' },
        { code: 'R05002', codeName: '보통이었어요' },
        { code: 'R05003', codeName: '간단했어요' },
      ],
      recipeImageUrl: '/recipeImage.png',
      recipeName: '김치찌개',
      tasteOptions: [
        { code: 'R03001', codeName: '별로였어요' },
        { code: 'R03002', codeName: '그저 그래요' },
        { code: 'R03003', codeName: '맛있었어요' },
      ],
    },
  },
};

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
};

describe('ReviewBottomSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // API 호출 모킹
    vi.mocked(axios.get).mockImplementation((url: string) => {
      if (url.includes('/v1/conditions')) {
        return Promise.resolve(mockConditionsResponse);
      }
      if (url.includes('/v1/reviews/preparation')) {
        return Promise.resolve(mockReviewDataResponse);
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    vi.mocked(axios.post).mockResolvedValue({
      data: { success: true },
    });
  });

  it('렌더링되지 않아야 함 (isOpen이 false일 때)', () => {
    render(<ReviewBottomSheet {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('김치찌개')).not.toBeInTheDocument();
  });

  it('올바르게 렌더링되어야 함', async () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    expect(screen.getByText('2번째 레시피 해먹기 완료!')).toBeInTheDocument();
    expect(screen.getByText('요리의 맛은 어땠나요?')).toBeInTheDocument();
    expect(screen.getByText('요리를 시작하기가 어땠나요?')).toBeInTheDocument();
    expect(screen.getByText('직접 요리해보니 어땠나요?')).toBeInTheDocument();
    expect(screen.getByText('기타 의견이 있어요!')).toBeInTheDocument();
  });

  it('닫기 버튼이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    const headerButtons = screen.getAllByRole('button');
    const closeButton = headerButtons.find(
      button =>
        button.querySelector('svg') && button.className.includes('rounded-full')
    );

    expect(closeButton).toBeDefined();
    await user.click(closeButton!);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('감정 선택이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    const tasteButton = screen.getByRole('button', { name: '맛있어요' });
    await user.click(tasteButton);
    expect(tasteButton).toHaveClass('bg-secondary-light-green');
  });

  it('모든 감정을 선택해야 제출 버튼이 활성화됨', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /후기 등록하기/i });
    expect(submitButton).toBeDisabled();

    // 맛 선택
    await user.click(screen.getByText('맛있어요'));
    expect(submitButton).toBeDisabled();

    // 시작하기 선택
    await user.click(screen.getByText('쉬워요'));
    expect(submitButton).toBeDisabled();

    // 직접 요리 선택
    await user.click(screen.getByText('간단해요'));
    expect(submitButton).toBeDisabled();
  });

  it('댓글 입력이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('김치찌개')).toBeInTheDocument();
    });

    const commentInput = screen.getByPlaceholderText('내용을 입력해 주세요');
    await user.type(commentInput, '정말 맛있었어요!');

    expect(commentInput).toHaveValue('정말 맛있었어요!');
  });
});

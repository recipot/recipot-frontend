import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import type { ReviewData } from '@/types/review.types';

import { ReviewBottomSheet } from '.';

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
}));

const mockReviewData: ReviewData = {
  completionCount: 2,
  recipeId: 'recipe-1',
  recipeImage: '/recipeImage.png',
  recipeName: '김치찌개',
};

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  reviewData: mockReviewData,
};

describe('ReviewBottomSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('렌더링되지 않아야 함 (isOpen이 false일 때)', () => {
    render(<ReviewBottomSheet {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('김치찌개')).not.toBeInTheDocument();
  });

  it('올바르게 렌더링되어야 함', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    expect(screen.getByText('김치찌개')).toBeInTheDocument();
    expect(screen.getByText('2번째 레시피 해먹기 완료!')).toBeInTheDocument();
    expect(screen.getByText('요리의 맛은 어땠나요?')).toBeInTheDocument();
    expect(screen.getByText('요리를 시작하기가 어땠나요?')).toBeInTheDocument();
    expect(screen.getByText('직접 요리해보니 어땠나요?')).toBeInTheDocument();
    expect(screen.getByText('기타 의견이 있어요!')).toBeInTheDocument();
  });

  it('닫기 버튼이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

    const closeButton = screen.getByTestId('drawer-close');
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('감정 선택이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);
    const tasteButton = screen.getByRole('button', { name: '맛있어요' });
    await user.click(tasteButton);
    expect(tasteButton).toHaveClass('bg-secondary-light-green');
  });

  it('모든 감정을 선택해야 제출 버튼이 활성화되어야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

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
    expect(submitButton).not.toBeDisabled();
  });

  it('댓글 입력이 작동해야 함', async () => {
    const user = userEvent.setup();
    render(<ReviewBottomSheet {...defaultProps} />);

    const commentInput = screen.getByPlaceholderText('내용을 입력해 주세요');
    await user.type(commentInput, '정말 맛있었어요!');

    expect(commentInput).toHaveValue('정말 맛있었어요!');
  });

  // TODO: 백엔드 확인 필요
  // it('완전한 폼 제출이 작동해야 함', async () => {
  //   const user = userEvent.setup();
  //   render(<ReviewBottomSheet {...defaultProps} />);

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

  it('다양한 reviewData props에 따라 올바르게 렌더링되어야 함', () => {
    // 이미지가 없을 때
    const propsWithoutImage = {
      ...defaultProps,
      reviewData: {
        ...mockReviewData,
        recipeImage: undefined,
      },
    };
    const { rerender } = render(<ReviewBottomSheet {...propsWithoutImage} />);

    // 이미지가 없을 때는 기본 div가 렌더링되고, 이미지 요소는 없음
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('김치찌개')).toBeInTheDocument();

    // 첫 번째 완료일 때
    const firstTimeProps = {
      ...defaultProps,
      reviewData: {
        ...mockReviewData,
        completionCount: 1,
      },
    };
    rerender(<ReviewBottomSheet {...firstTimeProps} />);
    expect(screen.getByText('1번째 레시피 해먹기 완료!')).toBeInTheDocument();

    // 긴 레시피 이름일 때
    const longNameProps = {
      ...defaultProps,
      reviewData: {
        ...mockReviewData,
        recipeName: '매운 돼지고기 김치찌개',
      },
    };
    rerender(<ReviewBottomSheet {...longNameProps} />);
    expect(screen.getByText('매운 돼지고기 김치찌개')).toBeInTheDocument();
  });
});

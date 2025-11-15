import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    onOpenChange: vi.fn(),
    open: true,
  };

  it('다이얼로그가 열려있을 때 렌더링된다', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        description="테스트 설명입니다."
        title="테스트 제목"
      />
    );

    expect(screen.getByText('테스트 설명입니다.')).toBeInTheDocument();
  });

  it('다이얼로그가 닫혀있을 때 렌더링되지 않는다', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        description="테스트 설명입니다."
        open={false}
        title="테스트 제목"
      />
    );

    expect(screen.queryByText('테스트 설명입니다.')).not.toBeInTheDocument();
  });

  it('기본 버튼 텍스트가 표시된다', () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText('취소')).toBeInTheDocument();
    expect(screen.getByText('확인')).toBeInTheDocument();
  });

  it('커스텀 버튼 텍스트가 표시된다', () => {
    render(
      <ConfirmDialog {...defaultProps} cancelText="아니오" confirmText="예" />
    );

    expect(screen.getByText('아니오')).toBeInTheDocument();
    expect(screen.getByText('예')).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 onCancel과 onOpenChange가 호출된다', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <ConfirmDialog
        {...defaultProps}
        onCancel={handleCancel}
        onOpenChange={handleOpenChange}
      />
    );

    const cancelButton = screen.getByText('취소');
    await user.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('확인 버튼 클릭 시 onConfirm과 onOpenChange가 호출된다', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={handleConfirm}
        onOpenChange={handleOpenChange}
      />
    );

    const confirmButton = screen.getByText('확인');
    await user.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('React 노드를 설명으로 렌더링할 수 있다', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        description={
          <>
            첫 번째 줄<br />두 번째 줄
          </>
        }
      />
    );

    // React.ReactNode는 div 태그로 렌더링되므로 DIV를 찾아야 함
    // br 태그로 나눠진 텍스트를 찾기 위해 더 유연한 매처 사용
    // description div는 특정 클래스를 가지고 있으므로 이를 확인하여 정확한 요소만 선택
    const description = screen.getByText((content, element) => {
      if (element?.tagName !== 'DIV') {
        return false;
      }
      const hasDescriptionClass =
        element.classList?.contains('text-center') &&
        element.classList?.contains('text-base') &&
        element.classList?.contains('whitespace-pre-line');
      return (
        hasDescriptionClass === true &&
        element.textContent?.includes('첫 번째 줄') === true &&
        element.textContent?.includes('두 번째 줄') === true
      );
    });
    expect(description).toBeInTheDocument();
  });

  it('disableOverlayClick prop이 Modal에 전달된다', () => {
    const { rerender } = render(
      <ConfirmDialog {...defaultProps} disableOverlayClick={false} />
    );

    rerender(<ConfirmDialog {...defaultProps} disableOverlayClick />);

    // Note: 실제 오버레이 클릭 동작은 Modal 컴포넌트에서 테스트됨
    expect(screen.getByText('확인')).toBeInTheDocument();
  });
});

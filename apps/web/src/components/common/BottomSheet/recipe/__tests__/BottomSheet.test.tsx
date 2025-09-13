import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BottomSheet } from '../../BottomSheet';

describe('BottomSheet', () => {
  const defaultProps = {
    children: <div>테스트 내용</div>,
    onOpenChange: vi.fn(),
    open: true,
  };

  it('open이 true일 때 컨텐츠가 렌더링되어야 한다', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(screen.getByText('테스트 내용')).toBeInTheDocument();
  });

  it('open이 false일 때 컨텐츠가 렌더링되지 않아야 한다', () => {
    render(<BottomSheet {...defaultProps} open={false} />);
    expect(screen.queryByText('테스트 내용')).not.toBeInTheDocument();
  });

  it('닫기 버튼이 클릭될 때 onOpenChange가 호출되어야 한다', () => {
    const onOpenChange = vi.fn();
    render(<BottomSheet {...defaultProps} onOpenChange={onOpenChange} />);

    // aria-label로 닫기 버튼 찾기
    const closeButton = screen.getByRole('button', { name: /닫기/i });
    fireEvent.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

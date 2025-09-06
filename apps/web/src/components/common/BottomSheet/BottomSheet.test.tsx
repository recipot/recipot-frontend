import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  const defaultProps = {
    children: <div>Test content</div>,
    onOpenChange: vi.fn(),
    open: true,
  };

  it('renders when open is true', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<BottomSheet {...defaultProps} open={false} />);
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(<BottomSheet {...defaultProps} onOpenChange={onOpenChange} />);

    const closeButton = screen.getByRole('button', { name: /닫기/i });
    fireEvent.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders title when provided', () => {
    render(<BottomSheet {...defaultProps} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<BottomSheet {...defaultProps} description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('hides close button when hideCloseButton is true', () => {
    render(<BottomSheet {...defaultProps} hideCloseButton />);
    expect(
      screen.queryByRole('button', { name: /닫기/i })
    ).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BottomSheet {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders custom close button when provided', () => {
    const customCloseButton = <button>Custom Close</button>;
    render(
      <BottomSheet {...defaultProps} customCloseButton={customCloseButton} />
    );
    expect(screen.getByText('Custom Close')).toBeInTheDocument();
  });

  it('renders custom header when provided', () => {
    const customHeader = <div>Custom Header</div>;
    render(<BottomSheet {...defaultProps} customHeader={customHeader} />);
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders custom footer when provided', () => {
    const customFooter = <div>Custom Footer</div>;
    render(<BottomSheet {...defaultProps} customFooter={customFooter} />);
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('renders review button when onReviewSubmit is provided', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(screen.getByText('후기 등록하기')).toBeInTheDocument();
  });

  it('calls onReviewSubmit when review button is clicked', () => {
    const onReviewSubmit = vi.fn();
    render(<BottomSheet {...defaultProps} />);

    const reviewButton = screen.getByText('후기 등록하기');
    fireEvent.click(reviewButton);

    expect(onReviewSubmit).toHaveBeenCalled();
  });

  describe('size variants', () => {
    it('applies sm size class', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="sm" />);
      expect(container.firstChild).toHaveClass('max-w-sm');
    });

    it('applies md size class', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="md" />);
      expect(container.firstChild).toHaveClass('max-w-md');
    });

    it('applies lg size class', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="lg" />);
      expect(container.firstChild).toHaveClass('max-w-lg');
    });

    it('applies xl size class', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="xl" />);
      expect(container.firstChild).toHaveClass('max-w-xl');
    });

    it('applies full size class', () => {
      const { container } = render(
        <BottomSheet {...defaultProps} size="full" />
      );
      expect(container.firstChild).toHaveClass('max-w-full');
    });
  });

  describe('height variants', () => {
    it('applies custom height when provided', () => {
      const { container } = render(
        <BottomSheet {...defaultProps} height="h-[25rem]" />
      );
      expect(container.firstChild).toHaveClass('h-[25rem]');
    });

    it('applies default height for sm size', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="sm" />);
      expect(container.firstChild).toHaveClass('h-[20rem]');
    });

    it('applies default height for md size', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="md" />);
      expect(container.firstChild).toHaveClass('h-[30rem]');
    });

    it('applies default height for lg size', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="lg" />);
      expect(container.firstChild).toHaveClass('h-[40rem]');
    });

    it('applies default height for xl size', () => {
      const { container } = render(<BottomSheet {...defaultProps} size="xl" />);
      expect(container.firstChild).toHaveClass('h-[50rem]');
    });

    it('applies default height for full size', () => {
      const { container } = render(
        <BottomSheet {...defaultProps} size="full" />
      );
      expect(container.firstChild).toHaveClass('h-[90vh]');
    });
  });

  describe('sticky positioning', () => {
    it('applies sticky header class when stickyHeader is true', () => {
      const { container } = render(
        <BottomSheet {...defaultProps} stickyHeader />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });

    it('applies sticky footer class when stickyFooter is true', () => {
      const { container } = render(
        <BottomSheet {...defaultProps} stickyFooter />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });
});

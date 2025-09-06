import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BottomSheetHeader } from './BottomSheetHeader';

describe('BottomSheetHeader', () => {
  it('renders title when provided', () => {
    render(<BottomSheetHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<BottomSheetHeader description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <BottomSheetHeader>
        <div>Custom Header Content</div>
      </BottomSheetHeader>
    );
    expect(screen.getByText('Custom Header Content')).toBeInTheDocument();
  });

  it('renders both title and description', () => {
    render(
      <BottomSheetHeader
        title="Test Title"
        description="Test Description"
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BottomSheetHeader className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has correct default classes', () => {
    const { container } = render(<BottomSheetHeader />);
    expect(container.firstChild).toHaveClass(
      'border-b',
      'border-border/50'
    );
  });
});

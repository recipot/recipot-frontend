import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BottomSheetFooter } from './BottomSheetFooter';

describe('BottomSheetFooter', () => {
  it('renders children', () => {
    render(
      <BottomSheetFooter>
        <div>Test Footer Content</div>
      </BottomSheetFooter>
    );
    expect(screen.getByText('Test Footer Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BottomSheetFooter className="custom-class">
        <div>Test Footer Content</div>
      </BottomSheetFooter>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has correct default classes', () => {
    const { container } = render(
      <BottomSheetFooter>
        <div>Test Footer Content</div>
      </BottomSheetFooter>
    );
    expect(container.firstChild).toHaveClass(
      'border-t',
      'border-border/50',
      'bg-background'
    );
  });
});

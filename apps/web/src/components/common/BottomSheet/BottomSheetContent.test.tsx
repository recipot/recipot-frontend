import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BottomSheetContent } from './BottomSheetContent';

describe('BottomSheetContent', () => {
  it('renders children', () => {
    render(
      <BottomSheetContent>
        <div>Test Content</div>
      </BottomSheetContent>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BottomSheetContent className="custom-class">
        <div>Test Content</div>
      </BottomSheetContent>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has correct default classes', () => {
    const { container } = render(
      <BottomSheetContent>
        <div>Test Content</div>
      </BottomSheetContent>
    );
    expect(container.firstChild).toHaveClass(
      'flex-1',
      'overflow-y-auto',
      'p-4'
    );
  });

  it('applies scrollable class when scrollable is true', () => {
    const { container } = render(
      <BottomSheetContent scrollable>
        <div>Test Content</div>
      </BottomSheetContent>
    );
    expect(container.firstChild).toHaveClass('overflow-y-auto');
  });

  it('does not apply scrollable class when scrollable is false', () => {
    const { container } = render(
      <BottomSheetContent scrollable={false}>
        <div>Test Content</div>
      </BottomSheetContent>
    );
    expect(container.firstChild).not.toHaveClass('overflow-y-auto');
  });
});

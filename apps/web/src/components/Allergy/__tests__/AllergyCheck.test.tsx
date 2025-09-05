import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AllergyCheckContainer from '../AllergyCheckContainer';

const queryClient = new QueryClient();

const TestWrapper = ({
  formId,
  onSubmit,
}: {
  onSubmit: (data: { items: number[] }) => void;
  formId: string;
}) => {
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

  const handleItemToggle = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <AllergyCheckContainer
      formId={formId}
      onSubmit={onSubmit}
      selectedItems={selectedItems}
      onItemToggle={handleItemToggle}
    />
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('AllergyCheck', () => {
  it('항목을 클릭하면 선택 상태가 토글된다', async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestWrapper formId="test-form" onSubmit={() => {}} />);
    const fishButton = screen.getByRole('button', { name: '어류' });
    const crabButton = screen.getByRole('button', { name: '게' });

    // '어류' 선택
    await user.click(fishButton);
    expect(fishButton).toHaveClass('bg-secondary-light-green');
    expect(crabButton).not.toHaveClass('bg-secondary-light-green');

    // '게' 선택
    await user.click(crabButton);
    expect(fishButton).toHaveClass('bg-secondary-light-green');
    expect(crabButton).toHaveClass('bg-secondary-light-green');

    // '어류' 선택 해제
    await user.click(fishButton);
    expect(fishButton).not.toHaveClass('bg-secondary-light-green');
    expect(crabButton).toHaveClass('bg-secondary-light-green');
  });

  it('제출 시 선택된 항목들의 ID 배열이 전달되어야 한다', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    renderWithProviders(
      <TestWrapper formId="test-form" onSubmit={mockOnSubmit} />
    );

    // '어류'(id:1), '게'(id:2) 순서로 클릭
    const fishButton = screen.getByRole('button', { name: '어류' });
    const crabButton = screen.getByRole('button', { name: '게' });

    await user.click(fishButton);
    await user.click(crabButton);

    const form = screen.getByRole('form', { name: '알레르기 선택 양식' });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      items: [1, 2],
    });
  });
});

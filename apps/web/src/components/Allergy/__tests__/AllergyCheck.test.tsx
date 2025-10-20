import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { AllergyCategory } from '@/types/allergy.types';

import AllergyCheckContainer from '../AllergyCheckContainer';

const queryClient = new QueryClient();

// Mock categories
const mockCategories: AllergyCategory[] = [
  {
    items: [
      { id: 1, label: '참치' },
      { id: 2, label: '고등어' },
    ],
    title: '어패류',
    type: 'seafood',
  },
];

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
      categories={mockCategories}
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
    const tunaButton = screen.getByRole('button', { name: '참치' });
    const mackerelButton = screen.getByRole('button', { name: '고등어' });

    // '참치' 선택
    await user.click(tunaButton);
    expect(tunaButton).toHaveClass('bg-secondary-light-green');
    expect(mackerelButton).not.toHaveClass('bg-secondary-light-green');

    // '고등어' 선택
    await user.click(mackerelButton);
    expect(tunaButton).toHaveClass('bg-secondary-light-green');
    expect(mackerelButton).toHaveClass('bg-secondary-light-green');

    // '참치' 선택 해제
    await user.click(tunaButton);
    expect(tunaButton).not.toHaveClass('bg-secondary-light-green');
    expect(mackerelButton).toHaveClass('bg-secondary-light-green');
  });

  it('제출 시 선택된 항목들의 ID 배열이 전달되어야 한다', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    renderWithProviders(
      <TestWrapper formId="test-form" onSubmit={mockOnSubmit} />
    );

    // '참치'(id:1), '고등어'(id:2) 순서로 클릭
    const tunaButton = screen.getByRole('button', { name: '참치' });
    const mackerelButton = screen.getByRole('button', { name: '고등어' });

    await user.click(tunaButton);
    await user.click(mackerelButton);

    const form = screen.getByRole('form', { name: '알레르기 선택 양식' });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      items: [1, 2],
    });
  });
});

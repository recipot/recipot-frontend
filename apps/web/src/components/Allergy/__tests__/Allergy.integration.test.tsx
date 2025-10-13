import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AllergyCheckContainer from '../AllergyCheckContainer';

import type * as TanStackQuery from '@tanstack/react-query';

vi.mock('@tanstack/react-query', async importOriginal => {
  const original = await importOriginal<typeof TanStackQuery>();
  return {
    ...original,
    useMutation: vi.fn(),
  };
});

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

describe('Allergy.integration', () => {
  it('사용자가 알레르기 항목을 선택하고 제출하면 `onSubmit`이 올바른 데이터와 함께 호출된다', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    renderWithProviders(
      <TestWrapper formId="test-form" onSubmit={mockOnSubmit} />
    );

    // '참치'(id:1), '고등어'(id:2) 클릭
    const tunaButton = screen.getByRole('button', { name: '참치' });
    const mackerelButton = screen.getByRole('button', { name: '고등어' });

    await user.click(tunaButton);
    await user.click(mackerelButton);

    // 참고: AllergyCheckItem.tsx의 활성 상태 스타일은 'bg-secondary-light-green'을 포함합니다.
    // 다른 테스트 파일에서는 'border-primary-pressed'를 확인하고 있어 불일치가 있을 수 있습니다.
    expect(tunaButton).toHaveClass('bg-secondary-light-green');
    expect(mackerelButton).toHaveClass('bg-secondary-light-green');

    // 폼 제출
    const form = screen.getByRole('form', { name: '알레르기 선택 양식' });
    fireEvent.submit(form);

    // onSubmit 호출 확인 (ID는 정렬되어야 함)
    expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 2] });
  });

  it('선택된 항목을 다시 클릭하면 선택이 해제된다', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    renderWithProviders(
      <TestWrapper formId="test-form" onSubmit={mockOnSubmit} />
    );

    const tunaButton = screen.getByRole('button', { name: '참치' });

    // 선택했다가 해제
    await user.click(tunaButton);
    expect(tunaButton).toHaveClass('bg-secondary-light-green');

    await user.click(tunaButton);
    expect(tunaButton).not.toHaveClass('bg-secondary-light-green');

    // 폼 제출
    const form = screen.getByRole('form', { name: '알레르기 선택 양식' });
    fireEvent.submit(form);

    // onSubmit 호출 확인
    expect(mockOnSubmit).toHaveBeenCalledWith({ items: [] });
  });
});

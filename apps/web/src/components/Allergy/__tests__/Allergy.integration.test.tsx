import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AllergyCheckContainer from '../AllergyCheckContainer';

describe('못 먹는 음식 통합 테스트', () => {
  const user = userEvent.setup();

  it('전체 사용자 흐름 : 항목을 선택 후 양식 제출', async () => {
    const mockOnSubmit = jest.fn();
    render(<AllergyCheckContainer onSubmit={mockOnSubmit} />);

    // 1. 해산물류 선택 (어류, 게)
    const fishButton = screen.getByText('어류');
    const crabButton = screen.getByText('게');

    await user.click(fishButton);
    await user.click(crabButton);

    // 2. 동물성 식품 선택 (돼지고기, 닭고기)
    const porkButton = screen.getByText('돼지고기');
    const chickenButton = screen.getByText('닭고기');

    await user.click(porkButton);
    await user.click(chickenButton);

    // 3. 폼 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // 4. 결과 확인 (어류, 게, 돼지고기, 닭고기)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 2, 6, 7] });
    });
  });

  it('복잡한 선택 패턴 처리', async () => {
    const mockOnSubmit = jest.fn();
    render(<AllergyCheckContainer onSubmit={mockOnSubmit} />);

    // 1. 특정 패턴으로 선택 (게, 새우, 조개류, 알류, 유제품)
    const items = ['게', '새우', '조개류', '알류', '유제품'];

    for (const item of items) {
      await user.click(screen.getByText(item));
    }

    // 2. 폼 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // 3. 결과 확인 (게, 새우, 조개류, 알류, 유제품)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [2, 3, 5, 9, 10] });
    });
  });

  it('상태 일관성 유지 - 첫 번째 제출', async () => {
    const mockOnSubmit = jest.fn();
    render(<AllergyCheckContainer onSubmit={mockOnSubmit} />);

    // 1. 초기 선택 (어류, 돼지고기)
    await user.click(screen.getByText('어류'));
    await user.click(screen.getByText('돼지고기'));

    // 2. 폼 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // 3. 결과 확인 (어류, 돼지고기)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 6] });
    });
  });

  it('상태 일관성 유지 - 두 번째 제출', async () => {
    const mockOnSubmit = jest.fn();
    render(<AllergyCheckContainer onSubmit={mockOnSubmit} />);

    // 1. 모든 항목 선택 (어류, 돼지고기, 게, 닭고기)
    await user.click(screen.getByText('어류'));
    await user.click(screen.getByText('돼지고기'));
    await user.click(screen.getByText('게'));
    await user.click(screen.getByText('닭고기'));

    // 2. 폼 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // 3. 결과 확인 (어류, 게, 돼지고기, 닭고기) - ID 순서대로 정렬됨
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 2, 6, 7] });
    });
  });

  it('연속 클릭 상호작용 처리', async () => {
    const mockOnSubmit = jest.fn();
    render(<AllergyCheckContainer onSubmit={mockOnSubmit} />);

    // 1. 빠른 연속 클릭
    const items = ['어류', '게', '새우', '돼지고기', '닭고기'];

    for (const item of items) {
      await user.click(screen.getByText(item));
    }

    // 2. 폼 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // 3. 결과 확인 (어류, 게, 새우, 돼지고기, 닭고기)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 2, 3, 6, 7] });
    });
  });

  it('선택 상태에 대한 시각적 피드백 제공', async () => {
    const mockOnSubmit = jest.fn();
    render(<AllergyCheckContainer onSubmit={mockOnSubmit} />);

    const fishButton = screen.getByText('어류');

    // 선택 전 상태 확인
    expect(fishButton).toHaveClass('bg-white', 'border-gray-300');

    // 선택 후 상태 확인
    await user.click(fishButton);
    expect(fishButton).toHaveClass(
      'bg-secondary-light-green',
      'border-secondary-soft-green',
      'text-primary'
    );

    // 선택 해제 후 상태 확인
    await user.click(fishButton);
    expect(fishButton).toHaveClass('bg-white', 'border-gray-300');
  });
});

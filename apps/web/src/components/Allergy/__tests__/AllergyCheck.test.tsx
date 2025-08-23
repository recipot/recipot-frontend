import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import AllergyCheck from '../AllergyCheck';

describe('AllergyCheck 컴포넌트 테스트', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('모든 카테고리 섹션 렌더링', () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    expect(screen.getByText('해산물류')).toBeInTheDocument();
    expect(screen.getByText('동물성 식품')).toBeInTheDocument();
  });

  it('각 카테고리의 모든 항목 렌더링', () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    // 해산물류 항목들
    expect(screen.getByText('어류')).toBeInTheDocument();
    expect(screen.getByText('게')).toBeInTheDocument();
    expect(screen.getByText('새우')).toBeInTheDocument();
    expect(screen.getByText('오징어')).toBeInTheDocument();
    expect(screen.getByText('조개류')).toBeInTheDocument();

    // 동물성 식품 항목들
    expect(screen.getByText('돼지고기')).toBeInTheDocument();
    expect(screen.getByText('닭고기')).toBeInTheDocument();
    expect(screen.getByText('쇠고기')).toBeInTheDocument();
    expect(screen.getByText('알류')).toBeInTheDocument();
    expect(screen.getByText('유제품')).toBeInTheDocument();
  });

  it('제출 버튼 렌더링', () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('선택된 항목이 없을 때 onSubmit 호출', async () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [] });
    });
  });

  it('선택된 항목이 있을 때 onSubmit 호출', async () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    // 어류 선택
    const fishButton = screen.getByText('어류');
    fireEvent.click(fishButton);

    // 게 선택
    const crabButton = screen.getByText('게');
    fireEvent.click(crabButton);

    // 제출
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 2] });
    });
  });

  it('항목 선택 및 선택 해제 처리', async () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    // 어류 선택
    const fishButton = screen.getByText('어류');
    fireEvent.click(fishButton);

    // 어류 선택 해제
    fireEvent.click(fishButton);

    // 제출
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [] });
    });
  });

  it('여러 선택 상태 유지', async () => {
    render(<AllergyCheck onSubmit={mockOnSubmit} />);

    // 여러 항목 선택
    const fishButton = screen.getByText('어류');
    const crabButton = screen.getByText('게');
    const porkButton = screen.getByText('돼지고기');

    fireEvent.click(fishButton);
    fireEvent.click(crabButton);
    fireEvent.click(porkButton);

    // 제출
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ items: [1, 2, 6] });
    });
  });
});

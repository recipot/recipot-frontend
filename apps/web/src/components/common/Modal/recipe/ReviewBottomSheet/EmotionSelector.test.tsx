import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';

import EmotionSelector from './EmotionSelector';

import type { ReviewFeeling } from './types';

describe('EmotionSelector', () => {
  const mockOnFeelingSelect = vi.fn();
  const feelings: ReviewFeeling[] = ['bad', 'soso', 'good'];
  const labels = ['별로예요', '그저 그래요', '또 해먹을래요'];

  test('초기 렌더링 시 "식사는 어떠셨나요?" 문구가 보여야 함', () => {
    render(
      <EmotionSelector
        selectedFeeling={null}
        onFeelingSelect={mockOnFeelingSelect}
      />
    );

    expect(screen.getByText('식사는 어떠셨나요?')).toBeInTheDocument();
  });

  test('모든 감정 버튼이 올바르게 렌더링되어야 함', () => {
    render(
      <EmotionSelector
        selectedFeeling={null}
        onFeelingSelect={mockOnFeelingSelect}
      />
    );

    labels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('감정 버튼 클릭 시 onFeelingSelect가 올바른 인자와 함께 호출되어야 함', () => {
    render(
      <EmotionSelector
        selectedFeeling={null}
        onFeelingSelect={mockOnFeelingSelect}
      />
    );

    feelings.forEach((feeling, index) => {
      const button = screen.getByText(labels[index]);
      fireEvent.click(button);
      expect(mockOnFeelingSelect).toHaveBeenCalledWith(feeling);
    });
  });

  test('선택된 감정이 있으면 제목이 보이지 않아야 함', () => {
    const { rerender } = render(
      <EmotionSelector
        selectedFeeling={null}
        onFeelingSelect={mockOnFeelingSelect}
      />
    );

    // 선택된 감정이 없을 때는 제목이 보여야 함
    expect(screen.getByText('식사는 어떠셨나요?')).toBeInTheDocument();

    // 선택된 감정이 있을 때
    rerender(
      <EmotionSelector
        selectedFeeling="good"
        onFeelingSelect={mockOnFeelingSelect}
      />
    );

    // 제목이 보이지 않아야 함
    expect(screen.queryByText('식사는 어떠셨나요?')).not.toBeInTheDocument();
  });
});

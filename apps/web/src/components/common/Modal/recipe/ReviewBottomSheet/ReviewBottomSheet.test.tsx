import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ReviewBottomSheet } from './ReviewBottomSheet';

import recipeImage from '/public/recipeImage.png';

describe('ReviewBottomSheet', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnFeelingSelect = vi.fn();
  const defaultProps = {
    onFeelingSelect: mockOnFeelingSelect,
    onOpenChange: mockOnOpenChange,
    open: true,
    recipeImageUrl: recipeImage,
    recipeTitle: '테스트 레시피',
    timesCooked: 1,
  };

  test('기본 렌더링이 올바르게 동작한다', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    expect(screen.getByText('테스트 레시피')).toBeInTheDocument();
    expect(screen.getByText('1번째 해먹기 완료')).toBeInTheDocument();
  });

  test('닫기 버튼 클릭 시 onOpenChange가 호출된다', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const closeButton = buttons[0];

    fireEvent.click(closeButton);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  test('레시피 이미지가 올바르게 렌더링된다.', () => {
    render(<ReviewBottomSheet {...defaultProps} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', defaultProps.recipeTitle);
    expect(image).toHaveAttribute('src');
  });

  test('후기 선택 여부에 따라 후기 등록 버튼이 활성화/비활성화된다.', () => {
    render(<ReviewBottomSheet {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const submitButton = buttons[buttons.length - 1];

    // 초기 상태는 비활성화
    expect(submitButton).toBeDisabled();

    // '별로예요' 선택 시 활성화
    fireEvent.click(screen.getByRole('button', { name: /별로예요/i }));
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /그저 그래요/i }));
    expect(submitButton).not.toBeDisabled();
  });

  test('"또 해먹을래요" 선택 시 장점 선택 UI가 표시된다', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    // "또 해먹을래요" 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: /또 해먹을래요/i }));

    // 장점 선택 UI가 표시되는지 확인
    expect(screen.getByText('어떤점이 좋았나요?')).toBeInTheDocument();

    const checkboxes = [
      '간단해서 빨리 만들 수 있어요',
      '재료가 집에 있는 걸로 충분해요',
      '맛 균형이 좋아요',
      '다음에도 또 해먹고 싶어요',
      '아이도 잘 먹어요',
    ];

    checkboxes.forEach(text => {
      expect(
        screen.getByRole('checkbox', { name: RegExp(text, 'i') })
      ).toBeInTheDocument();
    });
  });

  test('"별로예요" 선택 시 장점 선택 UI가 표시되지 않는다', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    // "별로예요" 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: /별로예요/i }));

    // 장점 선택 UI가 표시되는지 확인
    expect(screen.queryByText('어떤점이 좋았나요?')).not.toBeInTheDocument();
  });

  test('"그저 그래요" 선택 시 장점 선택 UI가 표시되지 않는다', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    // "그저 그래요" 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: /그저 그래요/i }));

    // 장점 선택 UI가 표시되는지 확인
    expect(screen.queryByText('어떤점이 좋았나요?')).not.toBeInTheDocument();
  });
});

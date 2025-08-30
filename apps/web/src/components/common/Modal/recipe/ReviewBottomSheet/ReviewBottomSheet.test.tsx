import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReviewBottomSheet } from './ReviewBottomSheet';
import recipeImage from '../../../../../../public/recipeImage.png';

describe('ReviewBottomSheet', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnFeelingSelect = jest.fn();
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onFeelingSelect: mockOnFeelingSelect,
    recipeTitle: '테스트 레시피',
    recipeImageUrl: recipeImage,
    timesCooked: 1,
  };

  test('기본 렌더링이 올바르게 동작한다', () => {
    render(<ReviewBottomSheet {...defaultProps} />);

    expect(screen.getByText('테스트 레시피')).toBeInTheDocument();
    expect(screen.getByText('1번째 해먹기 완료')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '후기 등록하기' })
    ).toBeDisabled();
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
  });
});

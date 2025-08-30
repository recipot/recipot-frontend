import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmotionOptionButton } from './EmotionOptionButton';

describe('EmotionOptionButton', () => {
  test('적절한 label 및 color가 올바르게 렌더링된다', () => {
    render(
      <EmotionOptionButton label="별로예요" color="red" onClick={() => {}} />
    );

    const button = screen.getByRole('button', { name: /별로예요/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#FFE2E2]');
    expect(button).toHaveClass('text-[#D25D5D]');
  });

  test('감정이 선택된 경우 스타일이 적절하게 변경된다.', () => {
    render(
      <EmotionOptionButton
        label="그저 그래요"
        color="yellow"
        selected
        onClick={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /보통/ });
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('text-gray-500');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  test('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = jest.fn();

    render(
      <EmotionOptionButton
        label="별로예요"
        color="blue"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: /별로예요/ });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled prop이 true일 때 disabled 상태가 적용된다', () => {
    render(
      <EmotionOptionButton
        label="슬픔"
        color="blue"
        disabled
        onClick={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /슬픔/ });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-60');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  test('적절한 color에 따라 올바른 아이콘을 렌더링한다', () => {
    const { container } = render(
      <EmotionOptionButton label="별로예요" color="blue" onClick={() => {}} />
    );

    // EmotionBadIcon이 렌더링되는지 확인
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

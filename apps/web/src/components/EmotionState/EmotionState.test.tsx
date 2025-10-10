import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EmotionState from './EmotionState';

// Mock EmotionOptionButton 컴포넌트
vi.mock('./EmotionOptionButton', () => ({
  default: function MockEmotionOptionButton({
    label,
    onClick,
    selected,
  }: {
    label: string;
    onClick: () => void;
    selected: boolean;
  }) {
    return (
      <button
        data-testid={`emotion-button-${label}`}
        onClick={onClick}
        data-selected={selected}
        className="emotion-button"
      >
        {label}
      </button>
    );
  },
}));

describe('EmotionState', () => {
  const defaultProps = {
    onMoodChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('렌더링', () => {
    it('기본 상태에서 올바르게 렌더링된다', () => {
      render(<EmotionState {...defaultProps} />);

      // 감정 버튼들이 표시되는지 확인
      expect(screen.getByTestId('emotion-button-힘들어')).toBeInTheDocument();
      expect(screen.getByTestId('emotion-button-그럭저럭')).toBeInTheDocument();
      expect(screen.getByTestId('emotion-button-충분해')).toBeInTheDocument();
    });

    it('초기 감정이 설정된 경우 올바르게 렌더링된다', () => {
      render(<EmotionState {...defaultProps} initialMood="good" />);

      const enoughButton = screen.getByTestId('emotion-button-충분해');
      expect(enoughButton).toHaveAttribute('data-selected', 'true');
    });

    it('커스텀 className이 적용된다', () => {
      const { container } = render(
        <EmotionState {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('감정 선택 기능', () => {
    it('감정 버튼을 클릭하면 onMoodChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onMoodChange = vi.fn();

      render(<EmotionState onMoodChange={onMoodChange} />);

      const tiredButton = screen.getByTestId('emotion-button-힘들어');
      await user.click(tiredButton);

      expect(onMoodChange).toHaveBeenCalledWith('bad');
    });

    it('같은 감정을 다시 클릭하면 null이 전달된다', async () => {
      const user = userEvent.setup();
      const onMoodChange = vi.fn();

      render(<EmotionState onMoodChange={onMoodChange} initialMood="bad" />);

      const tiredButton = screen.getByTestId('emotion-button-힘들어');
      await user.click(tiredButton);

      expect(onMoodChange).toHaveBeenCalledWith(null);
    });

    it('다른 감정을 클릭하면 새로운 감정이 선택된다', async () => {
      const user = userEvent.setup();
      const onMoodChange = vi.fn();

      render(<EmotionState onMoodChange={onMoodChange} initialMood="bad" />);

      const sosoButton = screen.getByTestId('emotion-button-그럭저럭');
      await user.click(sosoButton);

      expect(onMoodChange).toHaveBeenCalledWith('neutral');
    });
  });

  describe('배경 그라디언트', () => {
    it('선택된 감정에 따라 올바른 배경 그라디언트가 적용된다', () => {
      // 기본 상태 (선택 없음) - 기본 그라디언트가 적용됨
      const { container: containerDefault } = render(
        <EmotionState {...defaultProps} />
      );
      const mainContainerDefault = containerDefault.firstChild as HTMLElement;
      expect(mainContainerDefault).toHaveClass('emotion-gradient-default');

      // bad 감정 선택
      const { container: containerBad } = render(
        <EmotionState {...defaultProps} initialMood="bad" />
      );
      const mainContainerBad = containerBad.firstChild as HTMLElement;
      expect(mainContainerBad).toHaveClass('emotion-gradient-bad');

      // neutral 감정 선택
      const { container: containerNeutral } = render(
        <EmotionState {...defaultProps} initialMood="neutral" />
      );
      const mainContainerNeutral = containerNeutral.firstChild as HTMLElement;
      expect(mainContainerNeutral).toHaveClass('emotion-gradient-neutral');

      // good 감정 선택
      const { container: containerGood } = render(
        <EmotionState {...defaultProps} initialMood="good" />
      );
      const mainContainerGood = containerGood.firstChild as HTMLElement;
      expect(mainContainerGood).toHaveClass('emotion-gradient-good');
    });
  });

  describe('접근성', () => {
    it('감정 버튼들이 올바른 접근성 속성을 가진다', () => {
      render(<EmotionState {...defaultProps} initialMood="bad" />);

      const 힘들어Button = screen.getByTestId('emotion-button-힘들어');
      expect(힘들어Button).toHaveAttribute('data-selected', 'true');

      const 그럭저럭Button = screen.getByTestId('emotion-button-그럭저럭');
      expect(그럭저럭Button).toHaveAttribute('data-selected', 'false');
    });
  });
});

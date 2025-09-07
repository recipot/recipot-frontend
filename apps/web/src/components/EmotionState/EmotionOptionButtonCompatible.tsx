import React from 'react';
import EmotionOptionButtonWrapper from './EmotionOptionButtonWrapper';

// 기존 EmotionOptionButton과 완전히 호환되는 인터페이스
export interface FeelingPillProps {
  label: string;
  color: 'blue' | 'yellow' | 'red';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function EmotionOptionButtonCompatible({
  color,
  disabled,
  label,
  onClick,
  selected,
}: FeelingPillProps) {
  return (
    <EmotionOptionButtonWrapper
      color={color}
      disabled={disabled}
      label={label}
      onClick={onClick}
      selected={selected}
      size="md"
      variant="default"
    />
  );
}

export default EmotionOptionButtonCompatible;

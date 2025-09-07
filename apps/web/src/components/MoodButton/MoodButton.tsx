import React from 'react';

import EmotionBadIcon from '../Icons/EmotionBadIcon';
import EmotionGoodIcon from '../Icons/EmotionGoodIcon';
import EmotionNeutralIcon from '../Icons/EmotionNeutralIcon';

export type MoodType = 'bad' | 'neutral' | 'good';
export type MoodState = 'default' | 'selected' | 'disabled';

interface MoodButtonProps {
  type: MoodType;
  state: MoodState;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const MoodButton: React.FC<MoodButtonProps> = ({
  type,
  state,
  onClick,
  disabled = false,
  className = '',
}) => {
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled' || disabled;

  const getColors = () => {
    switch (type) {
      case 'bad':
        return {
          bg: isSelected ? '#d4e2ff' : '#f8f9fa',
          border: isSelected ? '#4164ae' : '#e9ecef',
          icon: isSelected ? '#4164ae' : '#adb5bd',
          text: isSelected ? '#4164ae' : '#6c757d',
        };
      case 'neutral':
        return {
          bg: isSelected ? '#fdfab0' : '#f8f9fa',
          border: isSelected ? '#ad7e06' : '#e9ecef',
          icon: isSelected ? '#ad7e06' : '#adb5bd',
          text: isSelected ? '#ad7e06' : '#6c757d',
        };
      case 'good':
        return {
          bg: isSelected ? '#ffe0e1' : '#f8f9fa',
          border: isSelected ? '#df6567' : '#e9ecef',
          icon: isSelected ? '#df6567' : '#adb5bd',
          text: isSelected ? '#df6567' : '#6c757d',
        };
      default:
        return {
          bg: '#f8f9fa',
          border: '#e9ecef',
          icon: '#adb5bd',
          text: '#6c757d',
        };
    }
  };

  const colors = getColors();
  const labels = {
    bad: '힘들어',
    good: '충분해',
    neutral: '그럭저럭',
  };

  const renderIcon = () => {
    const iconProps = {
      className: isDisabled ? 'opacity-50' : '',
      color: colors.icon,
      size: 24,
    };

    switch (type) {
      case 'bad':
        return <EmotionBadIcon {...iconProps} />;
      case 'neutral':
        return <EmotionNeutralIcon {...iconProps} />;
      case 'good':
        return <EmotionGoodIcon {...iconProps} />;
      default:
        return <EmotionBadIcon {...iconProps} />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <div
        className="flex items-center justify-center rounded-full border transition-all duration-200"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderRadius: isSelected ? 36 : 30,
          borderWidth: 1,
          height: isSelected ? 72 : 60,
          marginBottom: 8,
          opacity: 0.95,
          width: isSelected ? 72 : 60,
        }}
      >
        <div
          className="relative"
          style={{
            transform: (() => {
              const getIconOffset = () => {
                switch (type) {
                  case 'bad':
                    return isSelected
                      ? 'translate(-9px, -9px)'
                      : 'translate(-3px, -3px)';
                  case 'neutral':
                    return isSelected
                      ? 'translate(0px, -9px)'
                      : 'translate(0px, 0px)';
                  case 'good':
                    return isSelected
                      ? 'translate(-9px, -9px)'
                      : 'translate(-3px, -3px)';
                  default:
                    return isSelected
                      ? 'translate(-9px, -9px)'
                      : 'translate(-3px, -3px)';
                }
              };
              return getIconOffset();
            })(),
          }}
        >
          {renderIcon()}
        </div>
      </div>
      <span
        className="text-sm font-semibold transition-colors duration-200"
        style={{ color: colors.text }}
      >
        {labels[type]}
      </span>
    </button>
  );
};

export default MoodButton;

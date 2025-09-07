import React from 'react';
import EmotionBadIcon from '../Icons/EmotionBadIcon';
import EmotionNeutralIcon from '../Icons/EmotionNeutralIcon';
import EmotionGoodIcon from '../Icons/EmotionGoodIcon';

interface EmotionIconProps {
  type: 'bad' | 'neutral' | 'good';
  size?: number;
  className?: string;
}

const EmotionIcon: React.FC<EmotionIconProps> = ({
  type,
  size = 24,
  className = '',
}) => {
  const getIconColor = () => {
    switch (type) {
      case 'bad':
        return '#4164ae';
      case 'neutral':
        return '#ad7e06';
      case 'good':
        return '#df6567';
      default:
        return '#4164ae';
    }
  };

  const iconColor = getIconColor();

  const renderIcon = () => {
    const iconProps = {
      color: iconColor,
      size,
      className,
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

  return renderIcon();
};

export default EmotionIcon;

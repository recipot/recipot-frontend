import { type EmotionSectionType, getEmotionDisplayText } from './constants';
import { EmotionButton } from './EmotionButton';

interface EmotionSectionProps {
  title: string;
  type: EmotionSectionType;
  options: {
    code: string;
    codeName: string;
  }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export function EmotionSection({
  onSelect,
  options,
  selectedValue,
  title,
  type,
}: EmotionSectionProps) {
  return (
    <div className="mb-8 space-y-2" data-testid={`emotion-section-${type}`}>
      <p className="text-18sb text-gray-800">{title}</p>
      <div className="flex gap-2">
        {options?.map(option => {
          const displayText = getEmotionDisplayText(
            option.code,
            type,
            option.codeName
          );
          return (
            <div key={option.code} className="w-full">
              <EmotionButton
                label={displayText}
                isSelected={selectedValue === option.code}
                onClick={() => onSelect(option.code)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

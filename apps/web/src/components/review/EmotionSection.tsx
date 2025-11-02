import { EmotionButton } from './EmotionButton';

interface EmotionSectionProps {
  title: string;
  options: {
    code: string;
    codeName: string;
  }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  uiTextMapping?: Record<string, string>;
}

export function EmotionSection({
  onSelect,
  options,
  selectedValue,
  title,
  uiTextMapping,
}: EmotionSectionProps) {
  return (
    <div className="mb-8 space-y-2">
      <p className="text-18sb text-gray-800">{title}</p>
      <div className="flex gap-2">
        {options?.map(option => {
          const displayText = uiTextMapping?.[option.code] ?? option.codeName;
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

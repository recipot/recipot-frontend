import { EmotionButton } from './EmotionButton';

interface EmotionSectionProps {
  title: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export function EmotionSection({
  onSelect,
  options,
  selectedValue,
  title,
}: EmotionSectionProps) {
  return (
    <div className="space-y-2 mb-8">
      <p className="text-18sb text-gray-800">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {options.map(option => (
          <div key={option.value} className="w-full">
            <EmotionButton
              label={option.label}
              isSelected={selectedValue === option.value}
              onClick={() => onSelect(option.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

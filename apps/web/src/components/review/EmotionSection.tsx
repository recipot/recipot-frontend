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
    <div className="space-y-4">
      <h3 className="text-[18px] leading-[27px] font-semibold text-gray-800">
        {title}
      </h3>
      <div className="flex gap-2">
        {options.map(option => (
          <div key={option.value} className="flex-1">
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

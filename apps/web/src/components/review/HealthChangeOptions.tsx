import { Button } from '../common/Button';

import type { HealthSurveyPreparationOption } from '@recipot/api';

interface HealthChangeOptionsProps {
  options: HealthSurveyPreparationOption[];
  onSelect: (value: string) => void;
  selectedValue: string;
}

// 옵션 렌더링 컴포넌트
const HealthChangeOptions = ({
  onSelect,
  options,
  selectedValue,
}: HealthChangeOptionsProps) => (
  <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-2">
    {options.map(option => {
      const optionText = option.codeName;
      const optionValue = option.code;

      return (
        <Button
          key={optionValue}
          variant="outline"
          size="full"
          type="button"
          onClick={() => onSelect(optionValue)}
          className={`text-15sb xs:text-13sb min-w-0 flex-1 rounded-[10px] border p-3 ${
            selectedValue === optionValue
              ? 'border-secondary-soft-green bg-secondary-light-green text-primary'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          {optionText}
        </Button>
      );
    })}
  </div>
);

export default HealthChangeOptions;

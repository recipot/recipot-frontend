import { Button } from '../common/Button';

// 옵션 렌더링 컴포넌트
const HealthChangeOptions = ({
  onSelect,
  options,
  selectedValue,
}: {
  options: Array<{ code: string; codeName: string }>;
  onSelect: (value: string) => void;
  selectedValue: string;
}) => (
  <div className="mt-2 flex gap-2">
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
          className={`text-15sb rounded-[10px] border p-3 ${
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

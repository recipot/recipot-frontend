import { useState } from 'react';

import { SearchIcon } from '@/components/Icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 재료 검색 입력 컴포넌트
 * @param onChange - 입력 값 변경 핸들러
 * @param value - 입력 값
 * @returns 검색 입력 컴포넌트
 */
export function SearchInput({ onChange, value }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  const stylesInitial = 'border-none shadow-none focus-visible:ring-0';

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="재료 검색하기"
        value={inputValue}
        onChange={handleChange}
        maxLength={6}
        className={cn(
          'text-17 flex h-[56px] w-full items-center rounded-xl bg-gray-50 pr-12 pl-4 placeholder:text-gray-600',
          stylesInitial
        )}
      />
      <SearchIcon
        size={24}
        className="absolute top-1/2 right-4 -translate-y-1/2"
      />
    </div>
  );
}

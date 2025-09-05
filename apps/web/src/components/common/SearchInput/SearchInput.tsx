import { SearchIcon } from '@/components/Icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  placeholder?: string;
  ref?: React.RefObject<HTMLInputElement>;
}

/**
 * 재료 검색 입력 컴포넌트 (Controlled Component)
 * @param onChange - 입력 값 변경 핸들러
 * @param value - 입력 값 (외부에서 관리)
 * @param maxLength - 최대 입력 글자 수
 * @param placeholder - 입력 플레이스홀더
 * @param ref - 입력 요소 참조
 * @param props - 입력 요소 속성
 * @returns 검색 입력 컴포넌트
 */
export function SearchInput({
  maxLength = 6,
  onChange,
  placeholder = '재료 검색하기',
  ref,
  value,
  ...props
}: SearchInputProps) {
  const stylesInitial = 'border-none shadow-none focus-visible:ring-0 py-0';

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        name="searchInput"
        className={cn(
          'text-17 flex h-[52px] w-full items-center rounded-xl bg-gray-50 pr-12 pl-4 placeholder:text-gray-600',
          stylesInitial
        )}
        {...props}
      />
      <SearchIcon
        size={24}
        className="absolute top-1/2 right-4 -translate-y-1/2"
      />
    </div>
  );
}

import { BackIcon } from '@/components/Icons';

interface HeaderBackProps {
  onClick?: () => void;
  show?: boolean;
  ariaLabel?: string;
}

/**
 * Header의 뒤로가기 버튼
 * @param onClick - 클릭 핸들러 (기본값: router.back())
 * @param show - 버튼 표시 여부 (false일 경우 빈 공간 표시)
 * @param ariaLabel - 접근성 라벨
 */
export function HeaderBack({
  ariaLabel = '뒤로가기',
  onClick,
  show = true,
}: HeaderBackProps) {
  if (!show) {
    return <div className="size-10" />;
  }

  return (
    <button
      className="flex size-10 items-center justify-center"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <BackIcon size={24} color="hsl(var(--gray-900))" />
    </button>
  );
}

import { cn } from '@/lib/utils';

/**
 * 레시피 상세 타이틀
 * @param children - 타이틀 텍스트 또는 컴포넌트
 * @param className - 추가 스타일
 * @param title - 타이틀 텍스트
 */
export default function Title({
  children,
  className,
  title,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-18sb">{title}</p>
      {children}
    </div>
  );
}

import Link from 'next/link';

import { ArrowIcon } from '@/components/Icons';

const links = [
  // TODO: 실제 링크로 교체 필요
  { href: '/faq', label: '자주묻는 질문' },
  { href: '/feedback', label: '앱 피드백 남기기' },
  { href: '/terms', label: '이용약관' },
];

export default function InfoLinks() {
  return (
    <div className="mt-6">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="flex w-fit items-center py-[0.688rem] pl-2"
        >
          <span className="text-17sb">{label}</span>
          <ArrowIcon size={18} color="var(--gray-900)" />
        </Link>
      ))}
    </div>
  );
}

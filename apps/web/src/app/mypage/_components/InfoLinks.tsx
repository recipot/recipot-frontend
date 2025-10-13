import Link from 'next/link';

import { ArrowIcon } from '@/components/Icons';

const links = [
  { href: '/mypage/faq', label: '자주묻는 질문' },
  { href: '/mypage/feedback', label: '앱 피드백 남기기' },
  {
    href: 'https://www.notion.so/21c4ef560994809ba1f7e0ac853f0b24?source=copy_link',
    label: '이용약관',
  },
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

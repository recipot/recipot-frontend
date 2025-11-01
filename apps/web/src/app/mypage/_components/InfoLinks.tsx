import Link from 'next/link';

import { ArrowIcon } from '@/components/Icons';

const links = [
  { href: 'https://slashpage.com/hankki/qpv5x427xr9e1mkyn3dw', label: 'FAQ' },
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
          <ArrowIcon size={18} color="hsl(var(--gray-900))" />
        </Link>
      ))}
    </div>
  );
}

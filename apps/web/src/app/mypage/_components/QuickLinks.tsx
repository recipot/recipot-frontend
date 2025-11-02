import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { MyFileIcon, MyOpenFileIcon } from '@/components/Icons';

const QUICK_LINKS_DATA = [
  {
    colors: {
      activeBg: 'active:bg-[#d0ebff]',
      bg: 'bg-[#e7f5ff]',
      icon: '#228be6',
      text: 'text-[#228be6]',
    },
    href: '/mypage/recipes/saved',
    Icon: MyFileIcon,
    paddingX: 'px-[1.8125rem]',
    text: '내가 찜한 레시피',
  },
  {
    colors: {
      activeBg: 'active:bg-[#e5dbff]',
      bg: 'bg-[#f3f0ff]',
      icon: '#845ef7',
      text: 'text-[#845ef7]',
    },
    href: '/mypage/recipes/recent',
    Icon: MyOpenFileIcon,
    paddingX: 'px-[1.6875rem]',
    text: '최근 본 레시피',
  },
];

export default function QuickLinks() {
  return (
    <div className="mb-3 flex w-full items-center gap-3">
      {QUICK_LINKS_DATA.map(({ colors, href, Icon, paddingX, text }) => (
        <Link key={href} href={href} className="flex min-w-0 flex-1">
          <Button
            size="lg"
            shape="square"
            className={`flex w-full items-center justify-center gap-1.5 rounded-[0.875rem] py-4 leading-[100%] font-medium ${colors.bg} ${colors.activeBg} ${paddingX}`}
          >
            <div className="flex-shrink-0">
              <Icon size={18} color={colors.icon} />
            </div>

            <span className={`text-16 ${colors.text}`}>{text}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}

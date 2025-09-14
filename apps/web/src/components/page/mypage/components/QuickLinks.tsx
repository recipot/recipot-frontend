import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { MyFileIcon, MyOpenFileIcon } from '@/components/Icons';

export default function QuickLinks() {
  return (
    <div className="mb-3 flex w-full items-center gap-3">
      <Link href="/mypage/recipes/saved" className="flex flex-1">
        <Button
          size="lg"
          shape="square"
          className="flex flex-1 items-center justify-center gap-1.5 bg-[#e7f5ff] px-7 py-4 active:bg-[#d0ebff]"
        >
          <MyFileIcon size={18} color="#228be6" />
          <span className="text-16 text-[#228be6]">보관한 레시피</span>
        </Button>
      </Link>

      <Link href="/mypage/recipes/recent" className="flex flex-1">
        <Button
          size="lg"
          shape="square"
          className="flex flex-1 items-center justify-center gap-1.5 bg-[#f3f0ff] px-7 py-4 active:bg-[#e5dbff]"
        >
          <MyOpenFileIcon size={18} color="#845ef7" />
          <span className="text-16 text-[#845ef7]">최근 본 레시피</span>
        </Button>
      </Link>
    </div>
  );
}

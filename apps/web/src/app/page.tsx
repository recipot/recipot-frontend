import { ChefHat } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/common/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <ChefHat size={64} className="text-primary mx-auto mb-4" />
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Recipot</h1>
          <p className="text-gray-600">맛있는 요리를 쉽게 만들어보세요</p>
        </div>

        <div className="space-y-4">
          <Link href="/recipes">
            <Button size="lg" className="w-full max-w-xs">
              레시피 둘러보기
            </Button>
          </Link>

          <Link href="/onboarding/refrigerator">
            <Button variant="outline" size="lg" className="w-full max-w-xs">
              재료로 레시피 찾기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

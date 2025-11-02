'use client';

import { useState } from 'react';
import Link from 'next/link';

import { TermsOfServiceBottomSheet } from '@/app/(auth)/signin/_components/TermsOfServiceBottomSheet';
import { ArrowIcon } from '@/components/Icons';

const links = [
  { href: 'https://slashpage.com/hankki/qpv5x427xr9e1mkyn3dw', label: 'FAQ' },
  { label: '이용약관', type: 'modal' as const },
];

export default function InfoLinks() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleOpenTerms = () => setIsTermsOpen(true);
  const handleCloseTerms = () => setIsTermsOpen(false);

  return (
    <>
      <div className="mt-6">
        {links.map(({ href, label, type }) =>
          type === 'modal' ? (
            <button
              key={label}
              type="button"
              onClick={handleOpenTerms}
              className="flex w-fit items-center py-[0.688rem] pl-2"
            >
              <span className="text-17sb">{label}</span>
              <ArrowIcon size={18} color="hsl(var(--gray-900))" />
            </button>
          ) : href ? (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center py-[0.688rem] pl-2"
            >
              <span className="text-17sb">{label}</span>
              <ArrowIcon size={18} color="hsl(var(--gray-900))" />
            </Link>
          ) : null
        )}
      </div>

      <TermsOfServiceBottomSheet
        isOpen={isTermsOpen}
        onClose={handleCloseTerms}
      />
    </>
  );
}

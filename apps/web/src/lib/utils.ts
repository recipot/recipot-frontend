import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMergeExtended = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            '14',
            '14b',
            '15',
            '15sb',
            '16',
            '16sb',
            '17',
            '17sb',
            '18',
            '18sb',
            '20',
            '22',
            '24',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMergeExtended(clsx(inputs));
}

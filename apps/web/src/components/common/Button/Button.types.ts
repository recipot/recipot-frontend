import type { buttonVariants } from '@/components/common/Button/Button';

import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

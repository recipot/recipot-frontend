import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ButtonProps } from './Button.types';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'lg',
      variant: 'default',
    },
    variants: {
      size: {
        icon: 'h-[52px] w-[52px]',
        lg: 'h-[52px] px-6 font-semibold text-base',
        md: 'h-[40px] px-4 text-sm',
      },
      variant: {
        default:
          'font-semibold bg-[#68982D] text-white hover:bg-[#5A8627] disabled:bg-neutral-200 disabled:text-neutral-500',
        'icon-outline': 'rounded-full border border-white bg-transparent hover:bg-accent text-xl',
        'icon-solid': 'rounded-full bg-neutral-600 text-white hover:bg-gray-300 text-xl',
        kakao: 'bg-[#FCE40B] text-black hover:bg-yellow-500 disabled:bg-neutral-200',
        outline:
          'border border-input bg-background text-neutral-900 hover:bg-accent hover:text-accent-foreground disabled:bg-neutral-200',
        toggle:
          'bg-neutral-100 py-2 text-neutral-600 font-semibold hover:bg-gray-200 data-[state=active]:bg-neutral-900 data-[state=active]:text-white',
      },
    },
  }
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild = false, children, className, icon, iconPosition = 'left', isLoading = false, size, variant, ...props },
    ref
  ) => {
    return (
      <ShadcnButton
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        asChild={asChild}
        disabled={isLoading || props.disabled}
        {...props}>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center gap-1.5">
            {icon && iconPosition === 'left' && <div className="flex justify-center items-center w-5 h-5">{icon}</div>}
            {children}
            {icon && iconPosition === 'right' && <div className="flex justify-center items-center w-5 h-5">{icon}</div>}
          </div>
        )}
      </ShadcnButton>
    );
  }
);
Button.displayName = 'Button';

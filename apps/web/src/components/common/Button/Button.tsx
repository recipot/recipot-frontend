import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[0.375rem] whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    defaultVariants: {
      shape: 'round',
      size: 'lg',
      variant: 'default',
    },
    variants: {
      shape: {
        round: 'rounded-full',
        square: 'rounded-lg',
      },
      size: {
        full: 'h-[3.25rem] w-full text-17sb', // 52px
        icon: 'h-[3.25rem] w-[3.25rem]', // 52px
        'icon-xl': 'h-[3.875rem] w-[3.875rem]', // 62px
        lg: 'h-[3.25rem] px-6 text-17sb', // 52px
        md: 'h-[2.9375rem] px-5 text-sm', // 47px
        sm: 'h-[1.6875rem] px-3 text-xs', // 27px
      },
      variant: {
        default:
          'font-semibold bg-primary text-primary-foreground disabled:bg-gray-200 disabled:text-gray-500 active:bg-primary-pressed',
        destructive:
          'bg-destructive text-destructive-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        outline:
          'border bg-background text-gray-900 disabled:bg-muted disabled:text-muted-foreground',
        secondary: 'bg-secondary text-white active:bg-secondary-pressed',
        toggle:
          'bg-gray-100 text-gray-600 data-[state=active]:bg-gray-900 data-[state=active]:text-white',
      },
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, shape, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({  shape, size, variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };

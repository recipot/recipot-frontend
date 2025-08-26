import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { ButtonProps } from './Button.types';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
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
        full: 'h-[3.25rem] w-full text-base font-semibold', // 52px
        icon: 'h-[3.25rem] w-[3.25rem]', // 52px
        'icon-xl': 'h-[3.875rem] w-[3.875rem]', // 62px
        lg: 'h-[3.25rem] px-6 text-base font-semibold', // 52px
        md: 'h-[2.9375rem] px-5 text-sm', // 47px
        sm: 'h-[1.6875rem] px-3 text-xs', // 27px
      },
      variant: {
        default:
          'font-semibold bg-primary text-primary-foreground disabled:bg-neutral-200 disabled:text-neutral-500',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-neutral-400 bg-background text-neutral-900 disabled:bg-muted disabled:text-muted-foreground',
        toggle:
          'bg-neutral-100 text-neutral-600 font-semibold data-[state=active]:bg-neutral-900 data-[state=active]:text-white',
      },
    },
  }
);

// Button Root
const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      asChild = false,
      children,
      className,
      isLoading = false,
      shape,
      size,
      variant,
      ...props
    },
    ref
  ) {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ className, shape, size, variant }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        <span
          className={cn(
            'inline-flex items-center justify-center',
            isLoading && 'invisible'
          )}
        >
          {children}
        </span>
      </Comp>
    );
  }
);
ButtonRoot.displayName = 'Button';

// Button Text
const ButtonText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function ButtonText({ className, ...props }, ref) {
  return <span ref={ref} className={cn('mx-1.5', className)} {...props} />;
});
ButtonText.displayName = 'Button.Text';

// Button Icon
const ButtonIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function ButtonIcon({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex h-5 w-5 items-center justify-center',
        className
      )}
      {...props}
    />
  );
});
ButtonIcon.displayName = 'Button.Icon';

export const Button = Object.assign(ButtonRoot, {
  Icon: ButtonIcon,
  Text: ButtonText,
});

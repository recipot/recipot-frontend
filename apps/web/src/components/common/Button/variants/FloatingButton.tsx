import * as React from 'react';

import { Button } from '@/components/common/Button/Button';
import type { ButtonProps } from '@/components/common/Button/Button.types';
import { cn } from '@/lib/utils';

export const FloatingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function FloatingButton({ children, className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        size="icon"
        shape="round"
        className={cn('fixed right-5 z-50 h-12 w-12', className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
FloatingButton.displayName = 'FloatingButton';

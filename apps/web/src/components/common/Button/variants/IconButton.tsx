import * as React from 'react';

import { Button } from '@/components/common/Button/Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'solid';
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = 'outline', ...props }, ref) => {
    const buttonVariant = variant === 'outline' ? 'icon-outline' : 'icon-solid';

    return (
      <Button ref={ref} variant={buttonVariant} size="icon" {...props}>
        {children}
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';

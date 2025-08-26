import * as React from 'react';

import { Button } from '@/components/common/Button/Button';
import type { ButtonProps } from '@/components/common/Button/Button.types';
export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  children: React.ReactNode;
  size?: 'icon' | 'icon-xl';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, size = 'icon', ...props }, ref) {
    return (
      <Button ref={ref} size={size} {...props}>
        {children}
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';

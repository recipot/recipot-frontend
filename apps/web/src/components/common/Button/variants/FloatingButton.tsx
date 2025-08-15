import * as React from "react";

import { Button } from "@/components/common/Button/Button";
import { cn } from "@/lib/utils";

import type { ButtonProps } from "../Button.types";

export const FloatingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("fixed right-5 h-12 w-12 rounded-full z-50", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
FloatingButton.displayName = "FloatingButton";

import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";
import { forwardRef } from "react";

import type { ButtonProps } from "@/components/ui/button";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return <ShadcnButton ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ModalProps
    extends React.ComponentPropsWithoutRef<typeof Dialog> {
    /**
     * Modal title displayed in the header
     */
    title?: string;
    /**
     * Optional description text displayed below the title
     */
    description?: string;
    /**
     * Size variant of the modal
     * @default 'default'
     */
    size?: "sm" | "default" | "lg" | "xl" | "full";
    /**
     * Whether to show the close button
     * @default true
     */
    showCloseButton?: boolean;
    /**
     * Custom class name for the content container
     */
    contentClassName?: string;
    /**
     * Footer content to be rendered at the bottom of the modal
     */
    footer?: React.ReactNode;
    /**
     * Whether to prevent closing the modal when clicking the overlay
     * @default false
     */
    disableOverlayClick?: boolean;
}

const sizeClasses = {
    default: "max-w-md",
    full: "max-w-[95vw] max-h-[90vh] w-full",
    lg: "max-w-2xl",
    sm: "max-w-sm",
    xl: "max-w-4xl"
} as const;

/**
 * A reusable modal component that provides a consistent look and feel for dialogs.
 * Built on top of Radix UI's Dialog for accessibility and focus management.
 */
export const Modal = ({
    children,
    contentClassName,
    description,
    disableOverlayClick = false,
    footer,
    onOpenChange,
    size = "default",
    title,
    ...props
}: ModalProps) => {
    const handleOpenChange = React.useCallback(
        (open: boolean) => {
            if (onOpenChange) {
                onOpenChange(open);
            }
        },
        [onOpenChange]
    );

    const handleOverlayClick = React.useCallback(
        (e: React.MouseEvent) => {
            if (disableOverlayClick) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        [disableOverlayClick]
    );

    return (
        <Dialog onOpenChange={handleOpenChange} {...props}>
            <DialogPortal>
                <DialogOverlay
                    className="fixed inset-0 z-50 bg-gray-300 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    onClick={handleOverlayClick}
                />
                <DialogContent
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                        // eslint-disable-next-line security/detect-object-injection
                        sizeClasses[size],
                        contentClassName
                    )}
                >
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-center">
                            <div>
                                <h2 className="text-[17px] font-normal leading-none tracking-tight font-pretendard">
                                    {title}
                                </h2>
                                {description && (
                                    <p className="text-sm text-muted-foreground font-pretendard">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-1 text-[17px] font-pretendard">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            {footer}
                        </div>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

// Export the Dialog components for more flexible usage
export { Dialog as ModalRoot };
export { DialogTrigger as ModalTrigger };
export { DialogClose as ModalClose };

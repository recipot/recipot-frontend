import React, { useEffect } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef } from "react";

export interface ModalProps extends ComponentPropsWithoutRef<typeof Dialog> {
    title?: string;
    description?: string;
    size?: "sm" | "default" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
    contentClassName?: string;
    footer?: React.ReactNode;
    disableOverlayClick?: boolean;
    titleClassName?: string;
}

const sizeClasses = {
    default: "max-w-md",
    full: "max-w-[95vw] w-full",
    lg: "max-w-2xl",
    sm: "max-w-sm",
    xl: "max-w-4xl"
} as const;

export function Modal({
    children,
    contentClassName,
    description,
    disableOverlayClick = false,
    footer,
    onOpenChange,
    size = "default",
    title,
    titleClassName,
    ...props
}: ModalProps) {
    const ALLOWED_SIZES = new Set<keyof typeof sizeClasses>([
        "default",
        "full",
        "lg",
        "sm",
        "xl"
    ]);

    const safeSize: keyof typeof sizeClasses = ALLOWED_SIZES.has(size)
        ? size
        : "default";

    const lockBodyScroll = (lock: boolean) => {
        const html = document.documentElement;
        const { body } = document;
        if (lock) {
            html.style.overflow = "hidden";
            body.style.overflow = "hidden";
            body.style.overscrollBehavior = "contain";
        } else {
            html.style.overflow = "";
            body.style.overflow = "";
            body.style.overscrollBehavior = "";
        }
    };

    const handleOpenChange = (open: boolean) => {
        lockBodyScroll(open);
        if (onOpenChange) onOpenChange(open);
    };

    useEffect(() => {
        const initiallyOpen = props.open;
        if (initiallyOpen) lockBodyScroll(true);
        return () => lockBodyScroll(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (
        event
    ) => {
        if (disableOverlayClick) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    let sizeClass: (typeof sizeClasses)[keyof typeof sizeClasses];
    switch (safeSize) {
        case "sm":
            sizeClass = sizeClasses.sm;
            break;
        case "lg":
            sizeClass = sizeClasses.lg;
            break;
        case "xl":
            sizeClass = sizeClasses.xl;
            break;
        case "full":
            sizeClass = sizeClasses.full;
            break;
        default:
            sizeClass = sizeClasses.default;
    }

    return (
        <Dialog onOpenChange={handleOpenChange} {...props}>
            <DialogPortal>
                <DialogOverlay
                    className="fixed inset-0 z-50 bg-gray-300 backdrop-blur-sm"
                    onClick={handleOverlayClick}
                />
                <DialogContent
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-[320px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background px-6 pt-[30px] shadow-lg duration-200 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 rounded-3xl",
                        sizeClass,
                        contentClassName
                    )}
                >
                    <div className="flex flex-col space-y-2 text-center">
                        <h2
                            className={cn(
                                "font-normal leading-none tracking-tight",
                                "text-[14px]",
                                titleClassName
                            )}
                        >
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
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
}

// Export the Dialog components for more flexible usage
export { Dialog as ModalRoot };
export { DialogTrigger as ModalTrigger };
export { DialogClose as ModalClose };

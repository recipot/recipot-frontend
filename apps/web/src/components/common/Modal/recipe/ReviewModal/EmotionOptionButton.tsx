import React from "react";

import {
    EmotionBadIcon,
    EmotionGoodIcon,
    EmotionNeutralIcon
} from "@/components/Icons";
import { cn } from "@/lib/utils";

export interface FeelingPillProps {
    label: string;
    color: "blue" | "yellow" | "red";
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export const EmotionOptionButton = ({
    color,
    disabled,
    label,
    onClick,
    selected
}: FeelingPillProps) => {
    const baseByColor: Record<FeelingPillProps["color"], string> = {
        blue: "bg-[#D4E2FF] text-feel-tired-text",
        red: "bg-[#FFE2E2] text-[#D25D5D]",
        yellow: "bg-[#FDFAB0] text-feel-soso-text"
    };

    const selectedByColor: Record<FeelingPillProps["color"], string> = {
        blue: "bg-gray-100 text-gray-500",
        red: "bg-gray-100 text-gray-500",
        yellow: "bg-gray-100 text-gray-500"
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex h-20 w-[94px] flex-col items-center justify-center rounded-2xl text-sm font-semibold",
                disabled && "opacity-60 cursor-not-allowed",
                selected ? selectedByColor[color] : baseByColor[color]
            )}
            aria-pressed={!!selected}
        >
            <span className="text-2xl leading-none">
                {color === "blue" && <EmotionBadIcon />}
                {color === "yellow" && <EmotionNeutralIcon />}
                {color === "red" && <EmotionGoodIcon />}
            </span>
            <span>{label}</span>
        </button>
    );
};

export default EmotionOptionButton;

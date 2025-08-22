import React from "react";

import { EmotionBadIcon, EmotionGoodIcon, EmotionNeutralIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export interface FeelingPillProps {
  label: string;
  color: "blue" | "yellow" | "red";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const EmotionOptionButton: React.FC<FeelingPillProps> = ({ color, disabled, label, onClick, selected }) => {
  const baseByColor: Record<FeelingPillProps["color"], string> = {
    blue: "bg-[#E9F0FF] text-[#5B74C8]",
    red: "bg-[#FFE2E2] text-[#D25D5D]",
    yellow: "bg-[#FFF6C7] text-[#A08C26]",
  };

  const selectedByColor: Record<FeelingPillProps["color"], string> = {
    blue: "bg-[#EDEFF3] text-neutral-400",
    red: "bg-[#FFD4D4] text-[#D25D5D]",
    yellow: "bg-[#EDEFF3] text-neutral-400",
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

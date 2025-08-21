import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/common/Button/Button";
import {
    CheckIcon,
    EmotionBadIcon,
    EmotionGoodIcon,
    EmotionNeutralIcon
} from "@/components/Icons";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ReviewFeeling = "bad" | "soso" | "good";

export interface ReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipeTitle: string;
    recipeImageUrl: string;
    timesCooked?: number;
}

const FeelingPill: React.FC<{
    label: string;
    color: "blue" | "yellow" | "red";
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}> = ({ color, disabled, label, onClick, selected }) => {
    const baseByColor: Record<typeof color, string> = {
        blue: "bg-[#E9F0FF] text-[#5B74C8]",
        red: "bg-[#FFE2E2] text-[#D25D5D]",
        yellow: "bg-[#FFF6C7] text-[#A08C26]"
    };

    const selectedByColor: Record<typeof color, string> = {
        blue: "bg-[#EDEFF3] text-neutral-400",
        red: "bg-[#FFD4D4] text-[#D25D5D]",
        yellow: "bg-[#EDEFF3] text-neutral-400"
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex h-20 w-[94px] flex-col items-center justify-center rounded-2xl border border-transparent text-sm font-semibold transition-colors",
                disabled && "opacity-60 cursor-not-allowed",
                selected ? selectedByColor[color] : baseByColor[color]
            )}
            aria-pressed={!!selected}
        >
            <span className="text-2xl leading-none mb-1">
                {color === "blue" && <EmotionGoodIcon />}
                {color === "yellow" && <EmotionNeutralIcon />}
                {color === "red" && <EmotionBadIcon />}
            </span>
            <span>{label}</span>
        </button>
    );
};

const SectionDivider: React.FC = () => (
    <div className="my-4 border-t border-neutral-200" />
);

export const ReviewModal: React.FC<ReviewModalProps> = ({
    onOpenChange,
    open,
    recipeImageUrl,
    recipeTitle,
    timesCooked = 1
}) => {
    const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
    const [pros, setPros] = useState<string[]>([]);

    const cookedBadge = useMemo(() => {
        if (!timesCooked) return null;
        if (timesCooked <= 1) return `첫 해먹기 레시피예요!`;
        return `${timesCooked}번 해먹었어요!`;
    }, [timesCooked]);

    const prosCandidates = useMemo(
        () => [
            "간단해서 빨리 만들 수 있어요",
            "재료가 집에 있는 걸로 충분해요",
            "맛 균형이 좋아요",
            "다음에도 또 해먹고 싶어요",
            "아이도 잘 먹어요"
        ],
        []
    );

    const togglePro = (text: string) => {
        setPros((prev) =>
            prev.includes(text)
                ? prev.filter((t) => t !== text)
                : [...prev, text]
        );
    };

    const handleFeelingClick = (selectedFeeling: ReviewFeeling) => {
        setFeeling((prevFeeling) =>
            prevFeeling === selectedFeeling ? null : selectedFeeling
        );
    };

    // feeling이 good이면 pros가 1개 이상이어야 제출 가능
    const canSubmit = !!feeling && (feeling !== "good" || pros.length > 0);
    const goodFeeling = feeling === "good";

    const handleSubmit = () => {
        // TODO: submit hook 연결 지점
        onOpenChange(false);
    };

    // Body scroll lock while modal is open (since this component uses ui/dialog directly)
    useEffect(() => {
        const html = document.documentElement;
        const { body } = document;
        if (open) {
            html.style.overflow = "hidden";
            body.style.overflow = "hidden";
            body.style.overscrollBehavior = "contain";
        } else {
            html.style.overflow = "";
            body.style.overflow = "";
            body.style.overscrollBehavior = "";
        }
        return () => {
            html.style.overflow = "";
            body.style.overflow = "";
            body.style.overscrollBehavior = "";
        };
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    `fixed bottom-0 left-1/2 z-50 w-[340px] max-w-[340px] -translate-x-1/2 rounded-t-3xl rounded-b-2xl bg-white ${goodFeeling ? "h-[700px]" : "h-[560px]"} px-6 pt-6 pb-0 shadow-lg min-h-[560px] flex flex-col overflow-hidden`,
                    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2"
                )}
            >
                {/* Close button */}
                <div className="absolute right-3 top-3">
                    <DialogClose asChild>
                        <button
                            aria-label="닫기"
                            className="grid h-7 w-7 place-items-center rounded-full bg-neutral-100 text-neutral-500"
                        >
                            ×
                        </button>
                    </DialogClose>
                </div>

                {/* Content area - no scrolling, padded to avoid footer overlap */}
                <div className="w-full">
                    <div className="mx-auto flex max-w-[292px] flex-col items-center gap-6 pb-24">
                        {cookedBadge && (
                            <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                                {cookedBadge}
                            </div>
                        )}
                        {/* 레시피 타이틀 + 이미지 */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-lg font-bold">
                                {recipeTitle}
                            </div>
                            {recipeImageUrl && (
                                <Image
                                    src={recipeImageUrl}
                                    alt={recipeTitle}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-md object-cover shadow"
                                />
                            )}
                        </div>

                        <SectionDivider />

                        {/* 1단계: 기분 선택 */}
                        <div className="w-full mb-6">
                            {feeling === null && (
                                <p className="mb-3 text-center text-[17px] font-semibold">
                                    식사는 어떠셨나요?
                                </p>
                            )}
                            <div className="flex w-full items-center justify-between">
                                <FeelingPill
                                    label="별로예요"
                                    color="blue"
                                    onClick={() => handleFeelingClick("bad")}
                                    selected={feeling === "bad"}
                                />
                                <FeelingPill
                                    label="그저 그래요"
                                    color="yellow"
                                    onClick={() => handleFeelingClick("soso")}
                                    selected={feeling === "soso"}
                                />
                                <FeelingPill
                                    label="또 해먹을래요"
                                    color="red"
                                    onClick={() => handleFeelingClick("good")}
                                    selected={feeling === "good"}
                                />
                            </div>
                        </div>

                        {/* 2단계: 긍정 선택 시 추가 질문 */}
                        {feeling === "good" && (
                            <div className="w-full">
                                <div className="mb-4 rounded-2xl bg-[#FFE2E2] py-3 text-center text-[#D25D5D] font-semibold">
                                    😊 또 해먹을래요
                                </div>

                                <p className="mb-3 text-[17px] font-semibold">
                                    어떤점이 좋았나요?
                                </p>
                                <ul className="flex flex-col gap-3 ">
                                    {prosCandidates.map((text) => {
                                        const checked = pros.includes(text);
                                        return (
                                            <li key={text}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        togglePro(text)
                                                    }
                                                    className={cn(
                                                        "flex w-full items-center gap-3 px-3 text-left",
                                                        checked
                                                            ? "border-[#68982D] bg-[#F4FAEC]"
                                                            : "border-neutral-200 bg-white"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "grid h-5 w-5 place-items-center rounded-full border text-white",
                                                            checked
                                                                ? "border-[#68982D] bg-[#68982D]"
                                                                : "border-neutral-300 bg-white"
                                                        )}
                                                        aria-hidden
                                                    >
                                                        {checked ? (
                                                            <CheckIcon />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                    <span className="text-[16px]">
                                                        {text}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer (always visible) */}
                <div className="sticky bottom-0 w-full bg-white pt-4 pb-[calc(env(safe-area-inset-bottom)+20px)]">
                    <Button
                        className="w-full bg-[#6FAA2E] hover:bg-[#629c2a]"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        후기 등록하기
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;

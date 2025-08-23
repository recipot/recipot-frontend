import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/common/Button/Button";
import { CheckIcon, CloseIcon, EmotionGoodIcon } from "@/components/Icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { EmotionOptionButton } from "./EmotionOptionButton";

import type { ReviewFeeling, ReviewModalProps } from "./types";

export const ReviewModal: React.FC<ReviewModalProps> = ({
    onOpenChange,
    open,
    recipeImageUrl,
    recipeTitle,
    timesCooked = 1
}) => {
    const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
    const [pros, setPros] = useState<string[]>([]);

    const cookedBadge = (timesCooked: number) => {
        if (!timesCooked) return null;
        if (timesCooked <= 1) return `첫 해먹기 레시피예요!`;
        return `${timesCooked}번째 해먹기 완료한 레시피네요!`;
    };

    const prosCandidates = [
        "간단해서 빨리 만들 수 있어요",
        "재료가 집에 있는 걸로 충분해요",
        "맛 균형이 좋아요",
        "다음에도 또 해먹고 싶어요",
        "아이도 잘 먹어요"
    ];

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

    const canSubmit = !!feeling && (feeling !== "good" || pros.length > 0);
    const goodFeeling = feeling === "good";

    const handleSubmit = () => {
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            aria-labelledby="review-dialog-title"
        >
            <DialogContent
                role="dialog"
                aria-modal="true"
                className={cn(
                    `fixed bottom-0 left-1/2 w-[370px] h-[649px] -translate-x-1/2 rounded-t-3xl bg-white ${goodFeeling ? "h-[90vh]" : "h-[80vh]"} px-6 pt-6 pb-8 shadow-lg min-h-[400px] flex flex-col overflow-hidden`,
                    "transition-all duration-300 ease-out transform",
                    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=open]:duration-300",
                    "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=closed]:duration-300"
                )}
            >
                <div className="absolute right-3 top-3">
                    <CloseIcon />
                </div>

                <div className="w-full">
                    <div className="mx-auto flex max-w-[292px] flex-col items-center">
                        {cookedBadge(timesCooked) && (
                            <div className="w-[212px] h-[31px] flex justify-center items-center rounded-full bg-neutral-100 px-4 py-[5px] mb-5 text-xs text-neutral-600">
                                {cookedBadge(timesCooked)}
                            </div>
                        )}
                        {/* 레시피 타이틀 + 이미지 */}
                        <div className="flex flex-col justify-center items-center overflow-y-auto pb-6 -mx-6 px-6">
                            <div className="text-lg font-bold mb-2">
                                {recipeTitle}
                            </div>
                            {recipeImageUrl && (
                                <Image
                                    src={recipeImageUrl}
                                    alt={recipeTitle}
                                    width={72}
                                    height={72}
                                    className="rounded-md"
                                />
                            )}
                        </div>

                        <div className="w-full mb-6">
                            {feeling === null ? (
                                <p className="my-3 text-center text-[17px] font-semibold">
                                    식사는 어떠셨나요?
                                </p>
                            ) : (
                                <div className="h-5" />
                            )}
                            <div className="flex w-full items-center justify-between gap-[10px]">
                                <EmotionOptionButton
                                    label="별로예요"
                                    color="blue"
                                    onClick={() => handleFeelingClick("bad")}
                                    selected={feeling === "bad"}
                                />
                                <EmotionOptionButton
                                    label="그저 그래요"
                                    color="yellow"
                                    onClick={() => handleFeelingClick("soso")}
                                    selected={feeling === "soso"}
                                />
                                <EmotionOptionButton
                                    label="또 해먹을래요"
                                    color="red"
                                    onClick={() => handleFeelingClick("good")}
                                    selected={feeling === "good"}
                                />
                            </div>
                        </div>

                        {feeling === "good" && (
                            <div className="w-full">
                                <div className="flex justify-center mb-4 rounded-2xl bg-[#FFE2E2] py-3 text-center text-[#D25D5D] font-semibold">
                                    <EmotionGoodIcon /> 또 해먹을래요
                                </div>

                                <p className="mb-3 text-[17px] font-semibold text-center">
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
                                                            ? ""
                                                            : "border-neutral-200 bg-white"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "grid h-5 w-5 place-items-center rounded-md border text-brand-primary",
                                                            checked
                                                                ? "bg-secondary-soft-green"
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

                <div className="sticky bottom-0 w-full bg-white mt-[290px]">
                    <Button
                        className="w-full "
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

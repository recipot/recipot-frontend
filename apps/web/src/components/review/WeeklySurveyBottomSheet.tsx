'use client';
import React, { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Button } from '../common/Button';
import CheckboxIcon from '../common/CheckboxIcon';
import { CloseIcon } from '../Icons';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '../ui/drawer';

const HEALTH_IMPROVEMENT_OPTIONS = [
  '피로가 줄었다',
  '몸이 가벼워 졌다',
  '속이 편했다',
  '체중 관리에 도움이 된다',
  '기타',
] as const;

const HEALTH_CHANGE_OPTIONS = [
  '더 나빠졌어요',
  '비슷해요',
  '개선됐어요',
] as const;

export function WeeklySurveyBottomSheet() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedHealthChange, setSelectedHealthChange] = useState<string>('');

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleHealthChangeSelect = (option: string) => {
    setSelectedHealthChange(option);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    // 설문 완료 로직
    console.log('건강 변화:', selectedHealthChange);
    console.log('선택된 옵션들:', selectedOptions);
    // TODO: API 호출 또는 다른 완료 처리
    handleClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="mx-auto w-full max-w-[430px]">
        <VisuallyHidden asChild>
          <DrawerTitle>어제 드신 메뉴 어떠셨나요?</DrawerTitle>
        </VisuallyHidden>
        <div>
          <div className="overflow-y-auto px-6 pb-6">
            {/* 헤더 - 상단에 고정 */}
            <header className="sticky top-0 z-10 -mx-4 flex justify-end bg-white px-4">
              <DrawerClose
                type="button"
                className="rounded-full p-1.5"
                aria-label="리뷰 리마인드 바텀시트 닫기"
              >
                <CloseIcon size={24} color="#626A7A" />
                <span className="sr-only">닫기</span>
              </DrawerClose>
            </header>

            {/* 메인 컨텐츠 영역 */}
            <main className="mt-2">
              {/* 리뷰 요청 섹션 */}
              <section
                aria-labelledby="review-request-title"
                className="space-y-8"
              >
                <div className="mb-2">
                  <h1
                    id="review-request-title"
                    className="text-24 mb-2 text-gray-900"
                  >
                    집밥을 챙겨 먹은 후에
                    <br />
                    건강에 어떤 변화가 있었나요?
                  </h1>
                </div>
              </section>
              <h3 className="text-15 text-gray-600">
                더 건강한 메뉴를 위해 여러분의 의견을 들려주세요
              </h3>
              <div className="mt-6 h-0 w-[390px] border-t border-dashed border-gray-300" />
              <div className="mt-6 flex items-center">
                <div className="w-full">
                  <section>
                    <h2 className="text-18sb text-gray-900">
                      평소 건강 문제에 변화가 있었나요?
                    </h2>
                    <div className="mt-2 flex gap-2">
                      {HEALTH_CHANGE_OPTIONS.map(option => (
                        <Button
                          key={option}
                          variant="outline"
                          size="full"
                          onClick={() => handleHealthChangeSelect(option)}
                          className={`text-15sb rounded-[10px] border p-3 ${
                            selectedHealthChange === option
                              ? 'border-secondary-soft-green bg-secondary-light-green text-primary'
                              : 'border-gray-300 text-gray-600'
                          }`}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </section>
                  <section className="mt-6">
                    <h2 className="text-18sb mb-6 text-gray-800">
                      어떤 점이 개선되었나요?(다중선택)
                    </h2>

                    {HEALTH_IMPROVEMENT_OPTIONS.map(option => (
                      <div
                        key={option}
                        className="flex cursor-pointer items-center gap-3 py-[10px]"
                        onClick={() => handleOptionToggle(option)}
                      >
                        <CheckboxIcon
                          isSelected={selectedOptions.includes(option)}
                        />
                        <span className="text-base text-[#000000]/96">
                          {option}
                        </span>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </main>
          </div>

          {/* 설문완료 버튼 - 하단 고정 */}
          <div className="sticky bottom-0 bg-white px-6 pt-4 pb-6">
            <Button
              disabled={!selectedHealthChange || selectedOptions.length === 0}
              onClick={handleSubmit}
              className="text-17sb w-full rounded-full bg-[#68982d] py-4 text-white hover:bg-[#5a7a26] disabled:bg-gray-300 disabled:text-gray-500"
            >
              설문완료
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

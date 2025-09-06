import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Image from 'next/image';

import { Button } from '../Button';
import EmotionOptionButton from '../Modal/recipe/ReviewBottomSheet/EmotionOptionButton';

import { BottomSheet } from './BottomSheet';
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
} from './index';

const CONFETTI_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
];

const CONFETTI_STYLE = {
  left: 0,
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  zIndex: 9999,
} as const;

// 카테고리 탭 버튼 그룹 컴포넌트
export function CategoryTabGroup({
  onCategorySelect,
  selectedCategory,
}: {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}) {
  const categories = [
    { key: 'seafood', label: '해산물류' },
    { key: 'meat', label: '육류 및 유제품' },
    { key: 'nuts', label: '견과류 및 곡류' },
  ];

  return (
    <div className="flex gap-2">
      {categories.map(category => (
        <Button
          key={category.key}
          variant={
            selectedCategory === category.key ? 'categoryActive' : 'category'
          }
          size="sm"
          shape="square"
          className="flex-1"
          onClick={() => onCategorySelect(category.key)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}

// 음식 아이템 선택 버튼 그룹 컴포넌트
export function FoodItemGroup({
  category,
  onItemToggle,
  selectedItems,
}: {
  category: string;
  selectedItems: string[];
  onItemToggle: (item: string) => void;
}) {
  const foodItems = {
    meat: ['돼지', '닭', '소', '유제품'],
    nuts: ['땅콩', '호두', '잣'],
    seafood: ['어류', '게', '새우', '오징어', '조개류'],
  };

  const items = foodItems[category as keyof typeof foodItems] || [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">
        {category === 'seafood' && '해산물류'}
        {category === 'meat' && '육류 및 유제품'}
        {category === 'nuts' && '견과류 및 곡류'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map(item => (
          <Button
            key={item}
            variant={
              selectedItems.includes(item) ? 'foodItemSelected' : 'foodItem'
            }
            size="sm"
            shape="square"
            onClick={() => onItemToggle(item)}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}

// 리셋 버튼 컴포넌트
export function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <Button
      variant="reset"
      size="icon"
      shape="round"
      onClick={onReset}
      className="bg-gray-100"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    </Button>
  );
}

// 감정 선택 바텀시트 (ReviewBottomSheet 스타일)
export function EmotionSelectionBottomSheet({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [pros, setPros] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      // 3초 후 컨페티 효과 중지
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Review submitted: { pros, selectedEmotion }
    onOpenChange(false);
  };

  const togglePro = (text: string) => {
    setPros(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const PROS_OPTIONS = [
    '간단해서 빨리 만들 수 있어요',
    '재료가 집에 있는 걸로 충분해요',
    '맛 균형이 좋아요',
    '다음에도 또 해먹고 싶어요',
    '아이도 잘 먹어요',
  ] as const;

  return (
    <>
      {/* 컨페티 효과 */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          initialVelocityY={20}
          colors={CONFETTI_COLORS}
          style={CONFETTI_STYLE}
        />
      )}

      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        size="sm"
        height="h-[90vh] max-h-[568px] min-h-[400px]"
      >
        <div className="flex w-full flex-col items-center justify-center px-2 sm:px-4">
          {/* ReviewHeader 스타일 */}
          <div className="flex w-full flex-col items-center justify-center">
            {/* 해먹은 횟수 */}
            <div className="text-14 mt-2 mb-3 flex h-[28px] w-[10rem] items-center justify-center rounded-2xl bg-gray-100 px-3 py-[4px] text-xs text-gray-700 sm:mt-4 sm:mb-5 sm:h-[31px] sm:w-[11.25rem] sm:px-4 sm:py-[5px]">
              2번째 해먹기 완료
            </div>

            {/* 레시피 타이틀 + 이미지 */}
            <div className="flex flex-col items-center justify-center overflow-y-auto">
              <div className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">
                양배추 계란 샐러드
              </div>
              <Image
                src="/recipeImage.png"
                alt="양배추 계란 샐러드"
                width={72}
                height={72}
                className="rounded-[10.67px]"
              />
            </div>
            <div className="mt-3 h-[1px] w-full max-w-[280px] border border-dashed border-neutral-100 sm:mt-5 sm:max-w-[342px]" />
          </div>

          {/* ReviewForm 스타일 */}
          <div className="mx-auto flex w-full max-w-[280px] flex-col items-center justify-center px-2 pb-4 sm:max-w-[342px]">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="space-y-4 sm:space-y-5">
                {/* EmotionSelector 스타일 */}
                <div className="flex w-full flex-col items-center space-y-4 sm:space-y-6">
                  <h2 className="sm:text-22 mt-3 text-center text-lg text-gray-900 sm:mt-5">
                    식사는 어떠셨나요?
                  </h2>
                  <div className="flex h-[120px] w-full items-center justify-center gap-2 sm:h-[140px] sm:gap-3">
                    <EmotionOptionButton
                      label="별로예요"
                      color="blue"
                      onClick={() => handleEmotionSelect('bad')}
                      selected={selectedEmotion === 'bad'}
                    />
                    <EmotionOptionButton
                      label="그저 그래요"
                      color="yellow"
                      onClick={() => handleEmotionSelect('soso')}
                      selected={selectedEmotion === 'soso'}
                    />
                    <EmotionOptionButton
                      label="또 해먹을래요"
                      color="red"
                      onClick={() => handleEmotionSelect('good')}
                      selected={selectedEmotion === 'good'}
                    />
                  </div>
                </div>

                {/* RecipeProsSelector 스타일 - good 선택시에만 표시 */}
                {selectedEmotion === 'good' && (
                  <div className="w-full">
                    <div className="bg-feel-back-free text-feel-free-text text-15sb mt-3 mb-4 flex items-center justify-center rounded-2xl py-4 text-center sm:mt-5 sm:mb-6 sm:py-5">
                      <span className="mr-1">😊</span>
                      <span>또 해먹을래요</span>
                    </div>

                    <p className="sm:text-20 lg:text-22 mb-2 text-center text-lg sm:mb-3">
                      어떤점이 좋았나요?
                    </p>

                    <ul className="flex flex-col gap-1.5 sm:gap-2">
                      {PROS_OPTIONS.map(text => {
                        const isSelected = pros.includes(text);
                        const id = `pros-${text.replace(/\s+/g, '-').toLowerCase()}`;

                        return (
                          <li key={id}>
                            <div
                              role="checkbox"
                              aria-checked={isSelected}
                              tabIndex={0}
                              onClick={() => togglePro(text)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  togglePro(text);
                                }
                              }}
                              className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2"
                            >
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded border-2 sm:h-5 sm:w-5 ${
                                  isSelected
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {isSelected && (
                                  <span className="text-xs text-white">✓</span>
                                )}
                              </div>
                              <span className="text-13 sm:text-14 lg:text-16 text-left">
                                {text}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-0 left-0 z-10 w-full bg-white pt-3">
                <Button
                  type="submit"
                  className="w-full rounded-[6.25rem] px-[1.5rem] py-[0.75rem] text-sm font-semibold sm:px-[2rem] sm:py-[0.938rem] sm:text-base"
                  variant="default"
                  size="full"
                >
                  후기 등록하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

// 알레르기/음식 제한 선택 바텀시트 (주석 처리됨)
// export function AllergySelectionBottomSheet({
//   onOpenChange,
//   open,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const [selectedCategory, setSelectedCategory] = useState('seafood');
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);

//   const handleItemToggle = (item: string) => {
//     setSelectedItems(prev =>
//       prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
//     );
//   };

//   const handleReset = () => {
//     setSelectedItems([]);
//   };

//   return (
//     <BottomSheet
//       open={open}
//       onOpenChange={onOpenChange}
//       title="바텀시트"
//       customFooter={
//         <div className="flex items-center justify-between">
//           <ResetButton onReset={handleReset} />
//           <Button variant="primaryAction" size="lg" className="ml-4 flex-1">
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="mr-2"
//             >
//               <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <path d="M16 10a4 4 0 0 1-8 0" />
//             </svg>
//             못먹는 음식 선택 완료
//           </Button>
//         </div>
//       }
//     >
//       <div className="space-y-6">
//         <CategoryTabGroup
//           selectedCategory={selectedCategory}
//           onCategorySelect={setSelectedCategory}
//         />
//         <FoodItemGroup
//           category={selectedCategory}
//           selectedItems={selectedItems}
//           onItemToggle={handleItemToggle}
//         />
//       </div>
//     </BottomSheet>
//   );
// }

// 기본 바텀시트
export function SimpleBottomSheet({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="바텀시트 공통 스타일"
    >
      <div className="py-8 text-center">
        <p className="text-gray-500">
          여기에 다양한 콘텐츠를 추가할 수 있습니다.
        </p>
      </div>
    </BottomSheet>
  );
}

// 바텀시트 사용 예시 모음
export function BottomSheetShowcase() {
  const [openBasic, setOpenBasic] = useState(false);
  const [openWithHeader, setOpenWithHeader] = useState(false);
  const [openWithFooter, setOpenWithFooter] = useState(false);
  const [openFull, setOpenFull] = useState(false);

  const customHeader = (
    <BottomSheetHeader
      title="커스텀 헤더"
      description="shadcn drawer 헤더를 사용합니다."
    />
  );

  const customFooter = (
    <BottomSheetFooter>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpenWithFooter(false)}>
          취소
        </Button>
        <Button onClick={() => setOpenWithFooter(false)}>확인</Button>
      </div>
    </BottomSheetFooter>
  );

  const customFullFooter = (
    <BottomSheetFooter>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpenFull(false)}>
          취소
        </Button>
        <Button onClick={() => setOpenFull(false)}>저장</Button>
      </div>
    </BottomSheetFooter>
  );

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">
        shadcn Drawer 기반 바텀시트 컴포넌트 데모
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* 기본 바텀시트 */}
        <Button onClick={() => setOpenBasic(true)}>기본 바텀시트</Button>
        <BottomSheet
          open={openBasic}
          onOpenChange={setOpenBasic}
          title="기본 바텀시트"
          description="shadcn drawer 기반 바텀시트입니다."
        >
          <div className="space-y-4">
            <p>기본 바텀시트 내용입니다.</p>
            <p>스크롤이 가능하며, 오버레이 클릭으로 닫을 수 있습니다.</p>
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i}>내용 {i + 1}</p>
            ))}
          </div>
        </BottomSheet>

        {/* 헤더가 있는 바텀시트 */}
        <Button onClick={() => setOpenWithHeader(true)}>헤더 바텀시트</Button>
        <BottomSheet
          open={openWithHeader}
          onOpenChange={setOpenWithHeader}
          customHeader={customHeader}
        >
          <BottomSheetContent>
            <div className="space-y-4">
              <p>헤더가 있는 바텀시트입니다.</p>
              <p>shadcn drawer의 DrawerHeader를 활용했습니다.</p>
              {Array.from({ length: 15 }, (_, i) => (
                <p key={i}>스크롤 가능한 내용 {i + 1}</p>
              ))}
            </div>
          </BottomSheetContent>
        </BottomSheet>

        {/* 푸터가 있는 바텀시트 */}
        <Button onClick={() => setOpenWithFooter(true)}>푸터 바텀시트</Button>
        <BottomSheet
          open={openWithFooter}
          onOpenChange={setOpenWithFooter}
          title="푸터가 있는 바텀시트"
          description="shadcn drawer 기반 바텀시트입니다."
          customFooter={customFooter}
        >
          <BottomSheetContent>
            <div className="space-y-4">
              <p>푸터가 있는 바텀시트입니다.</p>
              <p>shadcn drawer의 DrawerFooter를 활용했습니다.</p>
              {Array.from({ length: 8 }, (_, i) => (
                <p key={i}>내용 {i + 1}</p>
              ))}
            </div>
          </BottomSheetContent>
        </BottomSheet>

        {/* 전체 화면 바텀시트 */}
        <Button onClick={() => setOpenFull(true)}>전체 화면 바텀시트</Button>
        <BottomSheet
          open={openFull}
          onOpenChange={setOpenFull}
          title="전체 화면 바텀시트"
          description="이 바텀시트는 전체 화면 크기입니다."
          size="full"
          stickyHeader
          stickyFooter
          customFooter={customFullFooter}
        >
          <BottomSheetContent>
            <div className="space-y-4">
              <p>전체 화면 크기의 바텀시트입니다.</p>
              <p>헤더와 푸터가 고정되어 있습니다.</p>
              {Array.from({ length: 25 }, (_, i) => (
                <p key={i}>긴 내용 {i + 1}</p>
              ))}
            </div>
          </BottomSheetContent>
        </BottomSheet>
      </div>
    </div>
  );
}

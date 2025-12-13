'use client';

import { useEffect, useRef, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { upload } from '@recipot/api';
import Image from 'next/image';

import { useRecipeTableActionsContext } from '@/app/admin/recipe/_components/RecipeTableActionsContext';
import { useRecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { normalizeImageUrl } from '@/lib/url';

/**
 * RecipeModals.Image
 * 이미지 수정 모달 컴포넌트
 */
export default function RecipeModalsImage() {
  const { modalState, recipes } = useRecipeTableDataContext();

  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달이 이미지 모달인지 확인
  const isImageModalOpen = modalState?.type === 'image';

  // modalState에서 필요한 정보 추출
  const recipeId = modalState?.recipeId;
  const stepOrderNum = modalState?.stepOrderNum;

  // 레시피 찾기
  const targetRecipe = recipeId ? recipes.find(r => r.id === recipeId) : null;

  // 모드 구분: stepOrderNum이 있으면 step 이미지 모드, 없으면 대표 이미지 모드
  const isStepImageMode = stepOrderNum !== undefined;

  // 대표 이미지 관련 데이터
  const mainImageUrl = targetRecipe?.imageUrl ?? null;

  // Step 이미지 관련 데이터

  const targetStep = isStepImageMode
    ? targetRecipe?.steps?.find(s => s.orderNum === stepOrderNum)
    : null;
  const stepImageUrl = targetStep?.imageUrl ?? null;

  // 현재 모드에 맞는 이미지 URL 선택
  const currentImageUrl = isStepImageMode ? stepImageUrl : mainImageUrl;

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isImageModalOpen) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedUrl(null);
      setErrorMessage('');
    }
  }, [isImageModalOpen, previewUrl]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage('');
    setIsUploading(true);

    try {
      const url = await upload.uploadImage(file);
      setUploadedUrl(url);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setErrorMessage('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      setUploadedUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const updateStepImage = (urlToSave: string) => {
    if (!targetRecipe) return;
    const currentSteps = targetRecipe.steps ?? [];
    const updatedSteps = currentSteps.map(step =>
      step.orderNum === stepOrderNum ? { ...step, imageUrl: urlToSave } : step
    );
    updateEditedRecipe(targetRecipe.id, { steps: updatedSteps });
  };

  const updateMainImage = (urlToSave: string) => {
    if (!targetRecipe) return;
    updateEditedRecipe(targetRecipe.id, { imageUrl: urlToSave });
  };

  const handleSave = () => {
    if (!targetRecipe) return;

    if (isUploading) {
      setErrorMessage('이미지 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    // 업로드된 URL이 있으면 우선 사용, 없으면 현재 이미지 URL 사용
    const urlToSave = uploadedUrl ?? currentImageUrl;

    if (!urlToSave) {
      setErrorMessage('이미지 URL을 입력하거나 파일을 업로드해주세요.');
      return;
    }

    // 모드에 따라 저장 로직 분리
    if (isStepImageMode) {
      updateStepImage(urlToSave);
    } else {
      updateMainImage(urlToSave);
    }
    closeModal();
  };

  const renderImagePreview = () => {
    // 표시할 이미지 URL과 alt 텍스트 결정
    let imageUrl: string | null = null;
    let altText = '';

    if (previewUrl) {
      imageUrl = previewUrl;
      altText = '미리보기';
    } else if (uploadedUrl) {
      imageUrl = normalizeImageUrl(uploadedUrl);
      altText = '업로드된 이미지';
    } else if (currentImageUrl) {
      imageUrl = normalizeImageUrl(currentImageUrl);
      altText = '현재 이미지';
    }

    // 이미지가 있으면 Image 컴포넌트로 렌더링
    if (imageUrl) {
      return (
        <div className="relative h-full min-h-[300px] w-full">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-contain"
            priority={!!previewUrl}
          />
        </div>
      );
    }

    // 이미지가 없으면 플레이스홀더 표시
    return (
      <div className="flex flex-col items-center justify-center text-gray-400">
        <div>이미지</div>
        <div>미리보기</div>
      </div>
    );
  };

  const getDisplayFileName = () => {
    if (selectedFile) return selectedFile.name;
    if (currentImageUrl)
      return currentImageUrl.split('/').pop() ?? currentImageUrl;
    return '';
  };

  if (!isImageModalOpen || !targetRecipe) return null;

  const displayFileName = getDisplayFileName();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="max-w-md" showCloseButton>
        <VisuallyHidden asChild>
          <DialogTitle className="text-18sb">대표 이미지</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle className="text-18sb">
            {isStepImageMode ? `Step ${stepOrderNum} 이미지` : '대표 이미지'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {errorMessage && (
              <span className="text-sm text-red-500">{errorMessage}</span>
            )}
            {isUploading && (
              <span className="text-sm text-blue-600">이미지 업로드 중...</span>
            )}
          </div>

          <div className="flex flex-col items-center justify-between gap-2">
            {displayFileName && (
              <div className="w-full">
                <div className="text-22">{displayFileName}</div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              size="full"
              shape="square"
              variant="outline"
              onClick={handleFileSelect}
              disabled={isUploading}
            >
              {isUploading ? '업로드 중...' : '파일 선택'}
            </Button>
          </div>

          <div className="flex min-h-[300px] items-center justify-center">
            {renderImagePreview()}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={(!uploadedUrl && !currentImageUrl) || isUploading}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

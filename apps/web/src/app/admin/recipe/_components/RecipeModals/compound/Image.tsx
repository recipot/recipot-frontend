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
  const { editedRecipes, modalState, recipes } = useRecipeTableDataContext();
  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = modalState?.type === 'image';
  const { recipeId, stepOrderNum } = modalState ?? {};
  const targetRecipe = recipeId ? recipes.find(r => r.id === recipeId) : null;
  const editedData = recipeId ? editedRecipes.get(recipeId) : undefined;
  const isStepImage = stepOrderNum !== undefined;
  const currentImageUrl = isStepImage
    ? (editedData?.steps?.find(s => s.orderNum === stepOrderNum)?.imageUrl ??
      targetRecipe?.steps?.find(s => s.orderNum === stepOrderNum)?.imageUrl)
    : (editedData?.imageUrl ?? targetRecipe?.imageUrl);

  useEffect(() => {
    if (isOpen && currentImageUrl !== undefined) {
      const initialUrl = currentImageUrl ?? '';
      setImageUrlInput(initialUrl);
    }
  }, [isOpen, currentImageUrl]);

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
      const uploadedUrl = await upload.uploadImage(file);
      setImageUrlInput(uploadedUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setErrorMessage('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      setImageUrlInput('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!targetRecipe) return;

    if (isUploading) {
      setErrorMessage('이미지 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    let urlToSave: string | null = null;

    if (imageUrlInput) {
      if (imageUrlInput.startsWith('blob:')) {
        setErrorMessage(
          'Blob URL은 저장할 수 없습니다. 실제 이미지 URL을 입력해주세요.'
        );
        return;
      }
      urlToSave = imageUrlInput;
    } else if (currentImageUrl) {
      urlToSave = currentImageUrl;
    } else {
      setErrorMessage('이미지 URL을 입력하거나 파일을 업로드해주세요.');
      return;
    }

    if (urlToSave) {
      if (isStepImage && stepOrderNum !== undefined) {
        const currentSteps = editedData?.steps ?? targetRecipe?.steps ?? [];
        const updatedSteps = currentSteps.map(step =>
          step.orderNum === stepOrderNum
            ? { ...step, imageUrl: urlToSave }
            : step
        );
        updateEditedRecipe(targetRecipe.id, { steps: updatedSteps });
      } else {
        updateEditedRecipe(targetRecipe.id, { imageUrl: urlToSave });
      }
      closeModal();
      // 상태 초기화
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setErrorMessage('');
    }
  };

  const displayFileName = (() => {
    if (selectedFile) return selectedFile.name;
    if (currentImageUrl)
      return currentImageUrl.split('/').pop() ?? currentImageUrl;
    return '';
  })();

  if (!isOpen || !targetRecipe) return null;

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="max-w-md" showCloseButton>
        <VisuallyHidden asChild>
          <DialogTitle className="text-18sb">대표 이미지</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle className="text-18sb">
            {isStepImage ? `Step ${stepOrderNum} 이미지` : '대표 이미지'}
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
            <div className="flex-1">
              <div className="text-18sb mt-1">
                {displayFileName ?? '이미지 없음'}
              </div>
            </div>

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
            {previewUrl ? (
              <div className="relative h-full min-h-[300px] w-full">
                <Image
                  src={previewUrl}
                  alt="미리보기"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : imageUrlInput ? (
              <div className="relative h-full min-h-[300px] w-full">
                <Image
                  src={normalizeImageUrl(imageUrlInput)}
                  alt="이미지 미리보기"
                  fill
                  className="object-contain"
                  onError={() => {
                    // 이미지 로드 실패 시 처리 (선택사항)
                  }}
                />
              </div>
            ) : currentImageUrl ? (
              <div className="relative h-full min-h-[300px] w-full">
                <Image
                  src={normalizeImageUrl(currentImageUrl)}
                  alt="현재 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <div>이미지</div>
                <div>미리보기</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={(!imageUrlInput && !currentImageUrl) || isUploading}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

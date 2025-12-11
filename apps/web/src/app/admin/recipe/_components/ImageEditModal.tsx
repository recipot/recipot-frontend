'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { normalizeImageUrl } from '@/lib/url';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  columnName?: string;
  onSave: (imageUrl: string) => void;
}

export function ImageEditModal({
  columnName,
  currentImageUrl,
  isOpen,
  onClose,
  onSave,
}: ImageEditModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageUrlInput(currentImageUrl ?? '');
    }
  }, [isOpen, currentImageUrl]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // 파일 이름을 URL 입력 필드에 설정 (blob URL 대신 파일 이름 사용)
      setImageUrlInput(file.name);
    }
  };

  const handleSave = () => {
    let urlToSave: string | null = null;
    if (previewUrl) {
      // 새로 등록하거나 수정 시
      urlToSave = previewUrl;
    } else if (imageUrlInput.trim()) {
      // 이미지를 수정하지 않고 그대로 저장
      urlToSave = imageUrlInput.trim();
    }

    if (urlToSave) {
      onSave(urlToSave);
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const displayFileName = selectedFile
    ? selectedFile.name
    : currentImageUrl
      ? (currentImageUrl.split('/').pop() ?? currentImageUrl)
      : '';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-18sb">{columnName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            >
              파일 선택
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
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!imageUrlInput.trim() && !currentImageUrl}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

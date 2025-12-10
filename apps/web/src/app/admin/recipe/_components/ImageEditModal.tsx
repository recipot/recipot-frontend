'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  onSave: (imageUrl: string) => void;
}

export function ImageEditModal({
  currentImageUrl,
  isOpen,
  onClose,
  onSave,
}: ImageEditModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(currentImageUrl ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // 파일명을 기반으로 임시 URL 생성 (실제로는 서버에 업로드 후 받아야 함)
      // 여기서는 파일명을 URL로 사용
      setImageUrl(file.name);
    }
  };

  const handleSave = () => {
    if (imageUrl) {
      onSave(imageUrl);
      // 정리
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleClose = () => {
    // 정리
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl(currentImageUrl ?? '');
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
          <DialogTitle>이미지 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 파일명과 수정 버튼 */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-18sb mt-1">
                {displayFileName ?? '이미지 없음'}
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleFileSelect}
              >
                수정
              </Button>
            </div>
          </div>

          {/* 이미지 미리보기 영역 */}
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
            ) : currentImageUrl ? (
              <div className="relative h-full min-h-[300px] w-full">
                <Image
                  src={currentImageUrl}
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
          <Button onClick={handleSave} disabled={!imageUrl}>
            수정
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { createApiInstance } from './createApiInstance';

const uploadAPI = createApiInstance({ apiName: 'Upload' });

export interface ImageUploadResponse {
  key: string;
  url: string;
}

export const upload = {
  /**
   * 이미지 파일 업로드
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지 URL
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadAPI.post<{
      status: number;
      data: ImageUploadResponse;
    }>('/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  },
};

'use client';

import { create } from 'zustand';

interface ShowErrorPayload {
  code?: string | number | null;
  message?: string;
}

interface ApiErrorModalState {
  code?: string;
  isOpen: boolean;
  message: string;
  hide: () => void;
  showError: (payload?: ShowErrorPayload) => void;
}

const DEFAULT_ERROR_MESSAGE =
  '요청을 처리하는 중 문제가 발생했어요.\n잠시 후 다시 시도해주세요.';

export const useApiErrorModalStore = create<ApiErrorModalState>(set => ({
  code: undefined,
  isOpen: false,
  message: DEFAULT_ERROR_MESSAGE,
  hide: () =>
    set(state => ({
      ...state,
      isOpen: false,
    })),
  showError: payload =>
    set(() => ({
      code: payload?.code != null ? String(payload.code) : undefined,
      isOpen: true,
      message: payload?.message ?? DEFAULT_ERROR_MESSAGE,
    })),
}));

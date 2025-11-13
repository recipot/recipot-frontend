'use client';

import { create } from 'zustand';

interface ShowErrorPayload {
  code?: string | number | null;
  isFatal?: boolean;
  message?: string;
}

interface ApiErrorModalState {
  code?: string;
  isFatal: boolean;
  isOpen: boolean;
  message: string;
  hide: () => void;
  showError: (payload?: ShowErrorPayload) => void;
}

const DEFAULT_ERROR_MESSAGE =
  '서버 내부 오류입니다.\n잠시 후 다시 시도해주세요.';

export const useApiErrorModalStore = create<ApiErrorModalState>(set => ({
  code: undefined,
  hide: () =>
    set(state => ({
      ...state,
      isFatal: false,
      isOpen: false,
    })),
  isFatal: false,
  isOpen: false,
  message: DEFAULT_ERROR_MESSAGE,
  showError: payload =>
    set(() => ({
      code: payload?.code != null ? String(payload.code) : undefined,
      isFatal: Boolean(payload?.isFatal),
      isOpen: true,
      message: DEFAULT_ERROR_MESSAGE,
    })),
}));

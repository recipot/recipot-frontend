import { create } from 'zustand';

interface LoginModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useLoginModalStore = create<LoginModalState>(set => ({
  closeModal: () => set({ isOpen: false }),
  isOpen: false,
  openModal: () => set({ isOpen: true }),
}));

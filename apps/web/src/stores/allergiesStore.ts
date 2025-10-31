'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * 알러지 스토어 상태
 */
interface AllergiesState {
  /** 선택된 알러지 ID 목록 */
  allergies: number[];
  /** UI에서 선택된 아이템 (카테고리별) */
  selectedItems: number[];
  /** 현재 사용자 ID (세션 추적용) */
  userId: string | null;
}

/**
 * 알러지 스토어 액션
 */
interface AllergiesActions {
  /** 알러지 추가 */
  addAllergy: (allergyId: number) => void;
  /** 알러지 제거 */
  removeAllergy: (allergyId: number) => void;
  /** 알러지 토글 */
  toggleAllergy: (allergyId: number) => void;
  /** 여러 알러지 설정 */
  setAllergies: (allergies: number[]) => void;
  /** 선택된 아이템 설정 */
  setSelectedItems: (items: number[]) => void;
  /** 모든 알러지 초기화 */
  clearAllergies: () => void;
  /** 특정 알러지가 선택되었는지 확인 */
  isSelected: (allergyId: number) => boolean;
  /** 사용자 세션 검증 및 필요시 초기화 */
  validateUserSession: (currentUserId: string | null) => void;
}

/** 초기 상태 */
const initialState: AllergiesState = {
  allergies: [],
  selectedItems: [],
  userId: null,
};

/**
 * 알러지 관리를 위한 Zustand 스토어
 *
 * 기능:
 * - 사용자의 알러지 정보 관리
 * - 온보딩 및 다른 페이지에서 재사용 가능
 * - localStorage에 자동 저장 (persist)
 * - 사용자 세션 변경 시 자동 초기화
 */
export const useAllergiesStore = create<AllergiesState & AllergiesActions>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        ...initialState,

        // 액션들
        addAllergy: (allergyId: number) => {
          set(
            state => ({
              allergies: [...new Set([...state.allergies, allergyId])],
            }),
            false,
            'addAllergy'
          );
        },

        clearAllergies: () => {
          set(
            { allergies: [], selectedItems: [] },
            false,
            'clearAllergies'
          );
        },

        isSelected: (allergyId: number) => {
          const { allergies } = get();
          return allergies.includes(allergyId);
        },

        removeAllergy: (allergyId: number) => {
          set(
            state => ({
              allergies: state.allergies.filter(id => id !== allergyId),
            }),
            false,
            'removeAllergy'
          );
        },

        setAllergies: (allergies: number[]) => {
          set({ allergies }, false, 'setAllergies');
        },

        setSelectedItems: (items: number[]) => {
          set({ selectedItems: items }, false, 'setSelectedItems');
        },

        toggleAllergy: (allergyId: number) => {
          const { allergies } = get();
          const isCurrentlySelected = allergies.includes(allergyId);

          set(
            state => ({
              allergies: isCurrentlySelected
                ? state.allergies.filter(id => id !== allergyId)
                : [...state.allergies, allergyId],
            }),
            false,
            `toggleAllergy-${isCurrentlySelected ? 'remove' : 'add'}`
          );
        },

        validateUserSession: (currentUserId: string | null) => {
          const { userId } = get();

          if (!currentUserId) {
            set({ ...initialState, userId: null }, false, 'resetSession');
            return;
          }

          if (userId !== currentUserId) {
            console.info('🔄 사용자 세션 변경 감지, 알러지 데이터 초기화');
            set({ ...initialState, userId: currentUserId }, false, 'resetSession');
          }
        },
      }),
      {
        name: 'allergies-storage',
      }
    ),
    {
      name: 'allergies-store',
    }
  )
);

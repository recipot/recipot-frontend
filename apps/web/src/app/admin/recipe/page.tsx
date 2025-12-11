'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { condition } from '@recipot/api';
import { Trash } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Toast } from '@/components/common/Toast';
import { Table } from '@/components/ui/table';
import { useAdminRecipes } from '@/hooks/useAdminRecipes';
import { useFoodList } from '@/hooks/useFoodList';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useToast } from '@/hooks/useToast';
import { isAdminRecipeCompletelyEmpty } from '@/utils/recipeValidation';

import { RecipeModals } from './_components/RecipeModals';
import { RecipeTable } from './_components/RecipeTable';
import { RecipeTableActionsContext } from './_components/RecipeTableActionsContext';
import { RecipeTableDataContext } from './_components/RecipeTableDataContext';
import { useRecipeEditor } from './_hooks/useRecipeEditor';
import { useRecipeSave } from './_hooks/useRecipeSave';
import {
  extractAvailableSeasonings,
  extractAvailableTools,
} from './_utils/recipeExtractor';

import type { ModalType } from './_components/RecipeModals';

export default function AdminRecipePage() {
  // 1. 데이터 페칭
  const { isLoading, recipes: allRecipes, refetch } = useAdminRecipes();
  const { data: foodList = [] } = useFoodList();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 컨디션 목록 조회
  const [conditions, setConditions] = useState<
    Array<{ id: number; name: string }>
  >([]);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const data = await condition.getConditions();
        setConditions(data);
      } catch (error) {
        console.error('컨디션 조회 실패:', error);
      }
    };
    fetchConditions();
  }, []);

  const getConditionId = useCallback(
    (conditionName?: string): number => {
      if (!conditionName) return 1;
      const found = conditions.find(c => c.name === conditionName);
      return found?.id ?? 1;
    },
    [conditions]
  );

  // 2. 커스텀 훅으로 로직 분리
  const {
    clearEdits,
    editedRecipes,
    editingCell,
    selectedCell,
    setEditingCell,
    setSelectedCell,
    updateEditedRecipe,
  } = useRecipeEditor();

  // 모달 상태 관리
  const [modalState, setModalState] = useState<{
    recipeId: number;
    type: ModalType;
  } | null>(null);

  const openModal = useCallback((type: ModalType, recipeId: number) => {
    setModalState({ recipeId, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  // 선택 상태 관리
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const selectRecipe = useCallback((id: number | null) => {
    setSelectedRecipeId(id);
  }, []);

  const toggleSelection = useCallback((id: number, checked: boolean) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  }, []);

  const { isSaving, saveRecipes, setValidationError, validationError } =
    useRecipeSave({
      onSuccess: clearEdits,
      refetch,
    });

  // 3. 데이터 가공
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter(recipe => !isAdminRecipeCompletelyEmpty(recipe));
  }, [allRecipes]);

  const {
    displayedItems: recipes,
    hasMore,
    isLoadingMore,
    observerTargetRef,
  } = usePaginatedList({
    items: filteredRecipes,
    itemsPerPage: 20,
    scrollContainerRef,
  });

  const availableTools = useMemo(
    () => extractAvailableTools(recipes),
    [recipes]
  );
  const availableSeasonings = useMemo(
    () => extractAvailableSeasonings(recipes),
    [recipes]
  );

  // 4. Toast 알림
  const { isVisible: isToastVisible, message: toastMessage } = useToast();

  // 테이블 외부 클릭 시 선택된 셀 해제
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(event.target as Node) &&
        selectedCell !== null
      ) {
        setSelectedCell(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCell, setSelectedCell]);

  // 5. Context 값 구성
  const dataContextValue = useMemo(
    () => ({
      availableSeasonings,
      availableTools,
      conditions,
      editedRecipes,
      editingCell,
      foodList,
      modalState,
      recipes,
      selectedCell,
      selectedIds,
      selectedRecipeId,
    }),
    [
      availableSeasonings,
      availableTools,
      conditions,
      editedRecipes,
      editingCell,
      foodList,
      modalState,
      recipes,
      selectedCell,
      selectedIds,
      selectedRecipeId,
    ]
  );

  const actionsContextValue = useMemo(
    () => ({
      closeModal,
      getConditionId,
      onSelectOne: toggleSelection,
      openModal,
      setEditingCell,
      setSelectedCell,
      setSelectedRecipeId: selectRecipe,
      updateEditedRecipe,
    }),
    [
      closeModal,
      getConditionId,
      openModal,
      selectRecipe,
      setEditingCell,
      setSelectedCell,
      toggleSelection,
      updateEditedRecipe,
    ]
  );

  // 6. 핸들러
  const handleSave = () => {
    saveRecipes(editedRecipes, recipes, getConditionId);
  };

  // 7. UI 렌더링
  return (
    <div className="container mx-auto p-6">
      {/* Toast 알림 */}
      <Toast isVisible={isToastVisible} message={toastMessage} />

      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">레시피 DB</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 hover:bg-gray-100">
            <Trash size={20} />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || editedRecipes.size === 0}
            className="bg-primary text-primary-foreground hover:bg-primary-pressed rounded px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? '저장 중...'
              : `저장${editedRecipes.size > 0 ? ` (${editedRecipes.size})` : ''}`}
          </button>
        </div>
      </div>

      {/* 레시피 테이블 */}
      <RecipeTableDataContext.Provider value={dataContextValue}>
        <RecipeTableActionsContext.Provider value={actionsContextValue}>
          <div ref={tableContainerRef} className="rounded-md border">
            <div
              ref={scrollContainerRef}
              className="relative max-h-[calc(100vh-200px)] overflow-auto"
            >
              <RecipeTable>
                <Table>
                  <RecipeTable.Header />
                  <RecipeTable.Body />
                </Table>
              </RecipeTable>

              {/* 무한스크롤 감지용 타겟 요소 */}
              {!isLoading && hasMore && (
                <div
                  ref={observerTargetRef}
                  className="flex h-20 items-center justify-center"
                >
                  {isLoadingMore && (
                    <div className="text-center text-gray-500">
                      더 불러오는 중...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 모달들 */}
          <RecipeModals />
        </RecipeTableActionsContext.Provider>
      </RecipeTableDataContext.Provider>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mt-4 text-center text-gray-500">로딩 중...</div>
      )}

      {/* 검증 에러 모달 */}
      <Modal
        contentGap={24}
        description={validationError.message}
        onOpenChange={open => {
          if (!open) {
            setValidationError({ isOpen: false, message: '' });
          }
        }}
        open={validationError.isOpen}
        title="데이터 검증 오류"
        titleBlock
      >
        <Button
          onClick={() => setValidationError({ isOpen: false, message: '' })}
          size="full"
        >
          확인
        </Button>
      </Modal>
    </div>
  );
}

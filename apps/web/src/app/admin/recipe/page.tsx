'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type AdminRecipe, condition, recipe } from '@recipot/api';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';

import type { ModalType } from '@/app/admin/recipe/_components/RecipeModals';
import RecipeModals from '@/app/admin/recipe/_components/RecipeModals';
import { RecipeTable } from '@/app/admin/recipe/_components/RecipeTable';
import { RecipeTableActionsContext } from '@/app/admin/recipe/_components/RecipeTableActionsContext';
import { RecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
import { useRecipeEditor } from '@/app/admin/recipe/_hooks/useRecipeEditor';
import { useRecipeSave } from '@/app/admin/recipe/_hooks/useRecipeSave';
import {
  extractAvailableSeasonings,
  extractAvailableTools,
} from '@/app/admin/recipe/_utils/recipeExtractor';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Toast } from '@/components/common/Toast';
import { Table } from '@/components/ui/table';
import {
  ADMIN_RECIPES_QUERY_KEY,
  useAdminRecipes,
} from '@/hooks/useAdminRecipes';
import { useFoodList } from '@/hooks/useFoodList';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useToast } from '@/hooks/useToast';
import { isAdminRecipeCompletelyEmpty } from '@/utils/recipeValidation';

export default function AdminRecipePage() {
  // 1. 데이터 페칭
  const { isLoading, recipes: allRecipes, refetch } = useAdminRecipes();
  const { data: foodList = [] } = useFoodList();
  const queryClient = useQueryClient();
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
      } catch {
        showToast('컨디션 조회 실패');
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
    stepOrderNum?: number;
  } | null>(null);

  const openModal = useCallback(
    (type: ModalType, recipeId: number, stepOrderNum?: number) => {
      setModalState({ recipeId, stepOrderNum, type });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  // 선택 상태 관리
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [expandedStepsRecipeId, setExpandedStepsRecipeId] = useState<
    number | null
  >(null);

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

  // 4. Toast 알림
  const {
    isVisible: isToastVisible,
    message: toastMessage,
    showToast,
  } = useToast();

  const { isSaving, saveRecipes, setValidationError, validationError } =
    useRecipeSave({
      onSuccess: clearEdits,
      refetch,
      showToast,
    });

  // 삭제 확인 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<Set<number>>(new Set());

  // 신규 레코드 관리
  const [newRecipes, setNewRecipes] = useState<AdminRecipe[]>([]);
  const nextTempIdRef = useRef(-1);

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

  // 신규 레코드와 기존 레시피 합치기
  const allDisplayedRecipes = useMemo(() => {
    return [...recipes, ...newRecipes];
  }, [recipes, newRecipes]);

  const availableTools = useMemo(
    () => extractAvailableTools(allDisplayedRecipes),
    [allDisplayedRecipes]
  );
  const availableSeasonings = useMemo(
    () => extractAvailableSeasonings(allDisplayedRecipes),
    [allDisplayedRecipes]
  );

  // 신규 레코드 생성 함수
  const createNewRecipe = useCallback(() => {
    const tempId = nextTempIdRef.current;
    nextTempIdRef.current -= 1;

    const newRecipe: AdminRecipe = {
      condition: '',
      description: '',
      duration: 0,
      id: tempId,
      imageUrl: '',
      ingredients: [],
      seasonings: [],
      steps: [],
      title: '',
      tools: [],
    };

    setNewRecipes(prev => [...prev, newRecipe]);

    // 리스트 맨 끝으로 스크롤
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  // Shift+Enter 키 이벤트   리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        createNewRecipe();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [createNewRecipe]);

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
      expandedStepsRecipeId,
      foodList,
      modalState,
      recipes: allDisplayedRecipes,
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
      expandedStepsRecipeId,
      foodList,
      modalState,
      allDisplayedRecipes,
      selectedCell,
      selectedIds,
      selectedRecipeId,
    ]
  );

  const actionsContextValue = useMemo(
    () => ({
      closeModal,
      createNewRecipe,
      getConditionId,
      onSelectOne: toggleSelection,
      openModal,
      setEditingCell,
      setExpandedStepsRecipeId,
      setSelectedCell,
      setSelectedRecipeId: selectRecipe,
      updateEditedRecipe,
    }),
    [
      closeModal,
      createNewRecipe,
      getConditionId,
      openModal,
      selectRecipe,
      setEditingCell,
      setExpandedStepsRecipeId,
      setSelectedCell,
      toggleSelection,
      updateEditedRecipe,
    ]
  );

  // 6. 핸들러
  const handleSave = () => {
    saveRecipes(editedRecipes, allDisplayedRecipes, getConditionId);
  };

  const handleDeleteClick = () => {
    if (selectedIds.size === 0) {
      showToast('삭제할 레시피를 선택해주세요.');
      return;
    }
    setIdsToDelete(new Set(selectedIds));
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (idsToDelete.size === 0) return;

    setIsDeleting(true);
    try {
      const deleteCount = idsToDelete.size;

      // 양수 ID만 필터링 (신규 레코드는 음수 ID이므로 제외)
      const recipeIdsToDelete = Array.from(idsToDelete).filter(id => id > 0);

      // 신규 레코드(음수 ID)는 로컬 상태에서만 제거
      const newRecipeIdsToRemove = Array.from(idsToDelete).filter(id => id < 0);
      if (newRecipeIdsToRemove.length > 0) {
        setNewRecipes(prev =>
          prev.filter(recipe => !newRecipeIdsToRemove.includes(recipe.id))
        );
      }

      // 기존 레시피는 API로 삭제
      if (recipeIdsToDelete.length > 0) {
        await recipe.deleteRecipes(recipeIdsToDelete);
      }

      // React Query 캐시 무효화하여 최신 데이터 가져오기
      await queryClient.invalidateQueries({
        queryKey: ADMIN_RECIPES_QUERY_KEY,
      });

      // 선택 상태 초기화
      setSelectedIds(new Set());
      setIdsToDelete(new Set());
      setIsDeleteModalOpen(false);
      showToast(`${deleteCount}개의 레시피가 삭제되었습니다.`);
    } catch (error) {
      console.error('레시피 삭제 실패:', error);
      showToast('레시피 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const validationErrorDescription = validationError.fieldNames ? (
    <div className="text-center">
      <span className="text-primary">
        {validationError.fieldNames.join(', ')}
      </span>
      <span className="text-black"> 데이터 미등록</span>
    </div>
  ) : (
    validationError.message
  );

  // 7. UI 렌더링
  return (
    <div className="container mx-auto p-6">
      {/* Toast 알림 */}
      <Toast isVisible={isToastVisible} message={toastMessage} />

      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">레시피 DB</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteClick}
            disabled={selectedIds.size === 0 || isDeleting}
            className="px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
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
          <RecipeModals>
            <RecipeModals.Ingredients />
            <RecipeModals.Seasonings />
            <RecipeModals.Image />
          </RecipeModals>
        </RecipeTableActionsContext.Provider>
      </RecipeTableDataContext.Provider>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mt-4 text-center text-gray-500">로딩 중...</div>
      )}

      {/* 검증 에러 모달 */}
      <Modal
        contentGap={24}
        description={validationErrorDescription}
        disableCloseButton={false}
        onOpenChange={open => {
          if (!open) {
            setValidationError({
              isOpen: false,
              message: '',
              showCloseButton: true,
            });
          }
        }}
        open={validationError.isOpen}
        showDefaultCloseButton
        // titleBlock
      >
        <Button
          onClick={() =>
            setValidationError({
              isOpen: false,
              message: '',
              showCloseButton: false,
            })
          }
          size="full"
        >
          확인
        </Button>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        contentGap={24}
        description={
          idsToDelete.size === 1
            ? (() => {
                const recipeId = Array.from(idsToDelete)[0];
                const recipeToDelete = allDisplayedRecipes.find(
                  r => r.id === recipeId
                );
                const recipeTitle = recipeToDelete?.title ?? '레시피';
                return `"${recipeTitle}"를 삭제하시겠습니까?`;
              })()
            : `선택한 ${idsToDelete.size}개의 레시피를 삭제하시겠습니까?`
        }
        disableCloseButton={false}
        onOpenChange={open => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setIdsToDelete(new Set());
          }
        }}
        open={isDeleteModalOpen}
        showDefaultCloseButton={false}
        title="레시피 삭제"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="full"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            취소
          </Button>
          <Button
            variant="default"
            size="full"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

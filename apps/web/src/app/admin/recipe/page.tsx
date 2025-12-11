'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { condition, recipe, type RecipeUpdateRequest } from '@recipot/api';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Toast } from '@/components/common/Toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminRecipes } from '@/hooks/useAdminRecipes';
import { useFoodList } from '@/hooks/useFoodList';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useToast } from '@/hooks/useToast';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';
import {
  formatValidationErrors,
  isAdminRecipeCompletelyEmpty,
  isRecipeCompletelyEmpty,
  validateRecipeUpdateRequests,
} from '@/utils/recipeValidation';

import { ImageEditModal } from './_components/ImageEditModal';
import { IngredientsEditModal } from './_components/IngredientsEditModal';
import { RecipeRow } from './_components/RecipeRow';
import { RecipeTableContext } from './_components/RecipeTableContext';
import { SeasoningsEditModal } from './_components/SeasoningsEditModal';
import { StepsEditModal } from './_components/StepsEditModal';

export default function AdminRecipePage() {
  const router = useRouter();
  const { isLoading, recipes: allRecipes } = useAdminRecipes();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const { data: foodList = [] } = useFoodList();
  const {
    isVisible: isToastVisible,
    message: toastMessage,
    showToast,
  } = useToast();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editedRecipes, setEditedRecipes] = useState<
    Map<number, Partial<RecipeUpdateRequest>>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [conditions, setConditions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [validationError, setValidationError] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });
  // 편집 상태 관리
  const [editingCell, setEditingCell] = useState<{
    field: string;
    recipeId: number;
  } | null>(null);

  // 통합된 모달 상태
  type ModalType = 'ingredients' | 'seasonings' | 'steps' | 'image';
  const [modalState, setModalState] = useState<{
    recipeId: number;
    type: ModalType;
  } | null>(null);

  const { showError } = useApiErrorModalStore();

  // 컨디션 목록 조회
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(recipes.map(recipe => recipe.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = useCallback((id: number, checked: boolean) => {
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

  const isAllSelected =
    recipes.length > 0 && selectedIds.size === recipes.length;

  // condition 이름을 conditionId로 변환
  const getConditionId = useCallback(
    (conditionName?: string): number => {
      if (!conditionName) return 1; // 기본값
      const found = conditions.find(c => c.name === conditionName);
      return found?.id ?? 1;
    },
    [conditions]
  );

  // duration 파싱 헬퍼
  const parseDuration = (duration: string): number => {
    return Number(duration) || 0;
  };

  // 레시피 수정 데이터 업데이트
  const updateEditedRecipe = useCallback(
    (recipeId: number, updates: Partial<RecipeUpdateRequest>) => {
      setEditedRecipes(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(recipeId) ?? {};
        newMap.set(recipeId, { ...existing, ...updates });
        return newMap;
      });
    },
    []
  );

  // 조리도구 목록 추출 (기존 레시피 데이터에서)
  const availableTools = useMemo(() => {
    const toolsMap = new Map<number, { id: number; name: string }>();
    recipes.forEach(recipe => {
      recipe.tools?.forEach(tool => {
        if (!toolsMap.has(tool.id)) {
          toolsMap.set(tool.id, { id: tool.id, name: tool.name });
        }
      });
    });
    return Array.from(toolsMap.values());
  }, [recipes]);

  // 양념 목록 추출 (기존 레시피 데이터에서)
  const availableSeasonings = useMemo(() => {
    const seasoningsMap = new Map<number, { id: number; name: string }>();
    recipes.forEach(recipe => {
      recipe.seasonings?.forEach(seasoning => {
        if (!seasoningsMap.has(seasoning.id)) {
          seasoningsMap.set(seasoning.id, {
            id: seasoning.id,
            name: seasoning.name,
          });
        }
      });
    });
    return Array.from(seasoningsMap.values());
  }, [recipes]);

  // 모달 열기 헬퍼 함수
  const openModal = useCallback((type: ModalType, recipeId: number) => {
    setModalState({ recipeId, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  // RecipeTableContext 값
  const tableContextValue = useMemo(
    () => ({
      availableSeasonings,
      availableTools,
      conditions,
      editingCell,
      foodList,
      getConditionId,
      onSelectOne: handleSelectOne,
      parseDuration,
      selectedIds,
      setEditingCell,
      setImageModalState: (
        state: { isOpen: boolean; recipeId: number } | null
      ) => {
        if (state?.isOpen) {
          openModal('image', state.recipeId);
        } else {
          closeModal();
        }
      },
      setIngredientsModalState: (
        state: { isOpen: boolean; recipeId: number } | null
      ) => {
        if (state?.isOpen) {
          openModal('ingredients', state.recipeId);
        } else {
          closeModal();
        }
      },
      setSeasoningsModalState: (
        state: { isOpen: boolean; recipeId: number } | null
      ) => {
        if (state?.isOpen) {
          openModal('seasonings', state.recipeId);
        } else {
          closeModal();
        }
      },
      setStepsModalState: (
        state: { isOpen: boolean; recipeId: number } | null
      ) => {
        if (state?.isOpen) {
          openModal('steps', state.recipeId);
        } else {
          closeModal();
        }
      },
      updateEditedRecipe,
    }),
    [
      availableSeasonings,
      availableTools,
      conditions,
      editingCell,
      foodList,
      getConditionId,
      handleSelectOne,
      openModal,
      closeModal,
      selectedIds,
      setEditingCell,
      updateEditedRecipe,
    ]
  );

  // 저장 버튼 핸들러
  const handleSave = async () => {
    if (editedRecipes.size === 0) {
      setValidationError({
        isOpen: true,
        message: '수정된 레시피가 없습니다.',
      });
      return;
    }

    setIsSaving(true);
    try {
      // 수정된 레시피들을 API 요청 형식으로 변환
      const updateRequests: RecipeUpdateRequest[] = Array.from(
        editedRecipes.entries()
      ).map(([recipeId, edits]) => {
        const originalRecipe = recipes.find(r => r.id === recipeId);
        if (!originalRecipe) {
          throw new Error(`레시피 ID ${recipeId}를 찾을 수 없습니다.`);
        }

        // 기본값은 원본 레시피에서 가져오고, 수정된 값으로 덮어씀
        return {
          conditionId:
            edits.conditionId ?? getConditionId(originalRecipe.condition),
          description: edits.description ?? originalRecipe.description ?? '',
          duration:
            edits.duration ??
            (typeof originalRecipe.duration === 'number'
              ? originalRecipe.duration
              : Number(originalRecipe.duration) || 0),
          id: recipeId,
          imageUrl: edits.imageUrl ?? originalRecipe.imageUrl,
          ingredients:
            edits.ingredients ??
            originalRecipe.ingredients?.map(ing => ({
              amount: ing.amount,
              id: ing.id,
              isAlternative: ing.isAlternative,
            })) ??
            [],
          seasonings:
            edits.seasonings ??
            originalRecipe.seasonings?.map(sea => ({
              amount: sea.amount,
              id: sea.id,
            })) ??
            [],
          steps:
            edits.steps ??
            originalRecipe.steps?.map(step => ({
              content: step.content,
              imageUrl: step.imageUrl,
              orderNum: step.orderNum,
              summary: step.summary,
            })) ??
            [],
          title: edits.title ?? originalRecipe.title,
          tools:
            edits.tools ??
            originalRecipe.tools?.map(tool => ({ id: tool.id })) ??
            [],
        };
      });

      // 전 컬럼 공란 행 제외
      const validRequests = updateRequests.filter(
        request => !isRecipeCompletelyEmpty(request)
      );

      if (validRequests.length === 0) {
        showError({
          message: '등록할 레시피가 없습니다.',
        });
        setIsSaving(false);
        return;
      }

      // 데이터 검증 (전 컬럼 공란 행 제외한 것만)
      const validationResult = validateRecipeUpdateRequests(validRequests);
      if (!validationResult.isValid) {
        const errorMessages = formatValidationErrors(validationResult.errors);
        setValidationError({
          isOpen: true,
          message: errorMessages.join('\n'),
        });
        setIsSaving(false);
        return;
      }

      // 수정된 레시피 개수에 따라 API 메서드 선택
      if (validRequests.length === 1) {
        // 단일 레시피 수정: PUT 사용 (전체 데이터 포함)
        const singleRequest = validRequests[0];
        const putRequestData = {
          conditionId: singleRequest.conditionId,
          description: singleRequest.description,
          duration: singleRequest.duration,
          healthPoints: [], // TODO: healthPoints 데이터 추가 필요 시 구현
          images: singleRequest.imageUrl
            ? [{ imageUrl: singleRequest.imageUrl }]
            : [],
          ingredients: singleRequest.ingredients.map(ing => ({
            amount: ing.amount,
            ingredientId: ing.id,
            isAlternative: ing.isAlternative,
          })),
          seasonings: singleRequest.seasonings.map(sea => ({
            amount: sea.amount,
            seasoningId: sea.id,
          })),
          steps: singleRequest.steps.map(step => ({
            content: step.content,
            imageUrl: step.imageUrl,
            orderNum: step.orderNum,
            summary: step.summary,
          })),
          title: singleRequest.title,
          tools: singleRequest.tools.map(tool => ({
            toolId: tool.id,
          })),
        };
        await recipe.updateRecipe(singleRequest.id, putRequestData);
      } else {
        // 다중 레시피 수정: POST 사용
        await recipe.updateRecipes(validRequests);
      }

      showToast('레시피가 성공적으로 저장되었습니다.');
      setEditedRecipes(new Map()); // 저장 후 수정 내역 초기화
      // 저장 성공 후 화면 새로고침
      router.refresh();
    } catch (error) {
      console.error('레시피 저장 실패:', error);
      showError({
        message: '레시피 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Toast 알림 */}
      <Toast isVisible={isToastVisible} message={toastMessage} />

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

      <div className="rounded-md border">
        <div
          ref={scrollContainerRef}
          className="relative max-h-[calc(100vh-200px)] overflow-auto"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>레시피 타이틀</TableHead>
                <TableHead>대표 이미지</TableHead>
                <TableHead>조리시간</TableHead>
                <TableHead>유저 컨디션</TableHead>
                <TableHead>후킹 타이틀</TableHead>
                <TableHead>조리도구</TableHead>
                <TableHead>재료</TableHead>
                <TableHead>대체불가능 재료</TableHead>
                <TableHead>양념</TableHead>
                <TableHead>요리순서</TableHead>
              </TableRow>
            </TableHeader>
            <RecipeTableContext.Provider value={tableContextValue}>
              <TableBody>
                {recipes.map(recipeItem => {
                  const editedData = editedRecipes.get(recipeItem.id);
                  return (
                    <RecipeRow
                      editedData={editedData}
                      key={recipeItem.id}
                      recipeItem={recipeItem}
                    />
                  );
                })}
              </TableBody>
            </RecipeTableContext.Provider>
          </Table>

          {/* 무한스크롤 감지용 타겟 요소 - 테이블 내부에 배치 */}
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

      {isLoading && (
        <div className="mt-4 text-center text-gray-500">로딩 중...</div>
      )}

      {/* 통합된 모달 렌더링 */}
      {modalState &&
        (() => {
          const { recipeId, type } = modalState;
          const targetRecipe = recipes.find(r => r.id === recipeId);
          const editedData = editedRecipes.get(recipeId);

          switch (type) {
            case 'ingredients': {
              const currentIngredients =
                editedData?.ingredients ?? targetRecipe?.ingredients ?? [];
              return (
                <IngredientsEditModal
                  availableFoods={foodList}
                  currentIngredients={currentIngredients}
                  isOpen
                  onClose={closeModal}
                  onSave={ingredients => {
                    updateEditedRecipe(recipeId, { ingredients });
                    closeModal();
                  }}
                />
              );
            }

            case 'seasonings': {
              const currentSeasonings =
                editedData?.seasonings ?? targetRecipe?.seasonings ?? [];
              return (
                <SeasoningsEditModal
                  availableSeasonings={availableSeasonings}
                  currentSeasonings={currentSeasonings}
                  isOpen
                  onClose={closeModal}
                  onSave={seasonings => {
                    updateEditedRecipe(recipeId, { seasonings });
                    closeModal();
                  }}
                />
              );
            }

            case 'steps': {
              const currentSteps =
                editedData?.steps ?? targetRecipe?.steps ?? [];
              return (
                <StepsEditModal
                  currentSteps={currentSteps}
                  isOpen
                  onClose={closeModal}
                  onSave={steps => {
                    updateEditedRecipe(recipeId, { steps });
                    closeModal();
                  }}
                />
              );
            }

            case 'image':
              return (
                <ImageEditModal
                  columnName="대표 이미지"
                  currentImageUrl={
                    editedData?.imageUrl ?? targetRecipe?.imageUrl
                  }
                  isOpen
                  onClose={closeModal}
                  onSave={imageUrl => {
                    updateEditedRecipe(recipeId, { imageUrl });
                    closeModal();
                  }}
                />
              );

            default:
              return null;
          }
        })()}

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

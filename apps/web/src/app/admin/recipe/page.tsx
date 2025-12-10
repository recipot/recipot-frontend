'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { condition, recipe, type RecipeUpdateRequest } from '@recipot/api';
import { Trash } from 'lucide-react';
import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFoodList } from '@/hooks/useFoodList';
import { useInfiniteRecipes } from '@/hooks/useInfiniteRecipes';

import { ConditionSelect } from './_components/ConditionSelect';
import { EditableCell } from './_components/EditableCell';
import { ImageEditModal } from './_components/ImageEditModal';
import { IngredientsEditModal } from './_components/IngredientsEditModal';
import { SeasoningsEditModal } from './_components/SeasoningsEditModal';
import { StepsEditModal } from './_components/StepsEditModal';
import { ToolsSelect } from './_components/ToolsSelect';

export default function AdminRecipePage() {
  const { hasNextPage, isLoading, loadMore, recipes } = useInfiniteRecipes();
  const { data: foodList = [] } = useFoodList();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editedRecipes, setEditedRecipes] = useState<
    Map<number, Partial<RecipeUpdateRequest>>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [conditions, setConditions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 편집 상태 관리
  const [editingCell, setEditingCell] = useState<{
    field: string;
    recipeId: number;
  } | null>(null);
  const [imageModalState, setImageModalState] = useState<{
    isOpen: boolean;
    recipeId: number;
  } | null>(null);
  const [ingredientsModalState, setIngredientsModalState] = useState<{
    isOpen: boolean;
    recipeId: number;
  } | null>(null);
  const [seasoningsModalState, setSeasoningsModalState] = useState<{
    isOpen: boolean;
    recipeId: number;
  } | null>(null);
  const [stepsModalState, setStepsModalState] = useState<{
    isOpen: boolean;
    recipeId: number;
  } | null>(null);

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

  // 무한스크롤을 위한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isLoading, loadMore]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(recipes.map(recipe => recipe.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected =
    recipes.length > 0 && selectedIds.size === recipes.length;

  // duration 문자열을 숫자로 변환 (예: "15분" -> 15)
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // condition 이름을 conditionId로 변환
  const getConditionId = (conditionName?: string): number => {
    if (!conditionName) return 1; // 기본값
    const found = conditions.find(c => c.name === conditionName);
    return found?.id ?? 1;
  };

  // 레시피 수정 데이터 업데이트
  const updateEditedRecipe = (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => {
    setEditedRecipes(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(recipeId) ?? {};
      newMap.set(recipeId, { ...existing, ...updates });
      return newMap;
    });
  };

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

  // 저장 버튼 핸들러
  const handleSave = async () => {
    if (editedRecipes.size === 0) {
      alert('수정된 레시피가 없습니다.');
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
            parseDuration(
              typeof originalRecipe.duration === 'string'
                ? originalRecipe.duration
                : String(originalRecipe.duration)
            ),
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

      await recipe.updateRecipes(updateRequests);
      alert('레시피가 성공적으로 저장되었습니다.');
      setEditedRecipes(new Map()); // 저장 후 수정 내역 초기화
      // 데이터 새로고침
      window.location.reload();
    } catch (error) {
      console.error('레시피 저장 실패:', error);
      alert('레시피 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
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
        <div className="relative max-h-[calc(100vh-200px)] overflow-auto">
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
            <TableBody>
              {recipes.map(recipeItem => {
                const editedData = editedRecipes.get(recipeItem.id);
                const currentTitle = editedData?.title ?? recipeItem.title;
                const currentDuration = editedData?.duration
                  ? String(editedData.duration)
                  : recipeItem.duration;
                const currentDescription =
                  editedData?.description ?? recipeItem.description ?? '';
                const currentConditionId =
                  editedData?.conditionId ??
                  getConditionId(recipeItem.condition);
                const currentImageUrl =
                  editedData?.imageUrl ?? recipeItem.imageUrl;
                const currentTools =
                  editedData?.tools ?? recipeItem.tools ?? [];
                const currentIngredients =
                  editedData?.ingredients ?? recipeItem.ingredients ?? [];
                const currentSeasonings =
                  editedData?.seasonings ?? recipeItem.seasonings ?? [];
                const currentSteps =
                  editedData?.steps ?? recipeItem.steps ?? [];

                return (
                  <TableRow key={recipeItem.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(recipeItem.id)}
                        onCheckedChange={checked =>
                          handleSelectOne(recipeItem.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell>{recipeItem.id}</TableCell>
                    <TableCell className="font-medium">
                      {editingCell?.recipeId === recipeItem.id &&
                      editingCell?.field === 'title' ? (
                        <EditableCell
                          value={currentTitle}
                          onSave={value => {
                            updateEditedRecipe(recipeItem.id, {
                              title: String(value),
                            });
                            setEditingCell(null);
                          }}
                          type="text"
                        />
                      ) : (
                        <div
                          onDoubleClick={() =>
                            setEditingCell({
                              field: 'title',
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {currentTitle}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="relative">
                      {currentImageUrl ? (
                        <div
                          onDoubleClick={() =>
                            setImageModalState({
                              isOpen: true,
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer"
                        >
                          <Image
                            src={currentImageUrl}
                            alt={currentTitle}
                            width={60}
                            height={60}
                            className="rounded object-cover"
                          />
                        </div>
                      ) : (
                        <span
                          onDoubleClick={() =>
                            setImageModalState({
                              isOpen: true,
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer text-gray-400 hover:bg-gray-50"
                        >
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCell?.recipeId === recipeItem.id &&
                      editingCell?.field === 'duration' ? (
                        <EditableCell
                          value={parseDuration(String(currentDuration))}
                          onSave={value => {
                            updateEditedRecipe(recipeItem.id, {
                              duration: Number(value),
                            });
                            setEditingCell(null);
                          }}
                          type="number"
                        />
                      ) : (
                        <div
                          onDoubleClick={() =>
                            setEditingCell({
                              field: 'duration',
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {currentDuration}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="relative">
                      {editingCell?.recipeId === recipeItem.id &&
                      editingCell?.field === 'condition' ? (
                        <ConditionSelect
                          conditions={conditions}
                          currentConditionId={currentConditionId}
                          onSelect={conditionId => {
                            updateEditedRecipe(recipeItem.id, {
                              conditionId,
                            });
                            setEditingCell(null);
                          }}
                          onClose={() => setEditingCell(null)}
                        />
                      ) : (
                        <div
                          onDoubleClick={() =>
                            setEditingCell({
                              field: 'condition',
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {conditions.find(c => c.id === currentConditionId)
                            ?.name ?? '-'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCell?.recipeId === recipeItem.id &&
                      editingCell?.field === 'description' ? (
                        <EditableCell
                          value={currentDescription}
                          onSave={value => {
                            updateEditedRecipe(recipeItem.id, {
                              description: String(value),
                            });
                            setEditingCell(null);
                          }}
                          type="text"
                        />
                      ) : (
                        <div
                          onDoubleClick={() =>
                            setEditingCell({
                              field: 'description',
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {currentDescription ?? '-'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="relative">
                      {editingCell?.recipeId === recipeItem.id &&
                      editingCell?.field === 'tools' ? (
                        <ToolsSelect
                          availableTools={availableTools}
                          selectedToolIds={currentTools.map(t => t.id)}
                          onSelect={toolIds => {
                            updateEditedRecipe(recipeItem.id, {
                              tools: toolIds.map(id => ({ id })),
                            });
                            setEditingCell(null);
                          }}
                          onClose={() => setEditingCell(null)}
                        />
                      ) : (
                        <div
                          onDoubleClick={() =>
                            setEditingCell({
                              field: 'tools',
                              recipeId: recipeItem.id,
                            })
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {currentTools.length > 0
                            ? availableTools
                                .filter(t =>
                                  currentTools.some(ct => ct.id === t.id)
                                )
                                .map(t => t.name)
                                .join(', ')
                            : '-'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        onDoubleClick={() =>
                          setIngredientsModalState({
                            isOpen: true,
                            recipeId: recipeItem.id,
                          })
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {currentIngredients.length > 0
                          ? foodList
                              .filter(f =>
                                currentIngredients.some(ci => ci.id === f.id)
                              )
                              .map(f => f.name)
                              .join(', ')
                          : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {recipeItem.irreplaceableIngredients ?? '-'}
                    </TableCell>
                    <TableCell>
                      <div
                        onDoubleClick={() =>
                          setSeasoningsModalState({
                            isOpen: true,
                            recipeId: recipeItem.id,
                          })
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {currentSeasonings.length > 0
                          ? availableSeasonings
                              .filter(s =>
                                currentSeasonings.some(cs => cs.id === s.id)
                              )
                              .map(s => s.name)
                              .join(', ')
                          : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        onDoubleClick={() =>
                          setStepsModalState({
                            isOpen: true,
                            recipeId: recipeItem.id,
                          })
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {currentSteps.length > 0 ? (
                          <div className="space-y-1">
                            <div className="font-medium">
                              {currentSteps.length}단계
                            </div>
                            <div className="max-w-xs truncate text-xs text-gray-600">
                              {currentSteps
                                .sort((a, b) => a.orderNum - b.orderNum)
                                .map(step => step.summary ?? step.content)
                                .filter(Boolean)
                                .slice(0, 3)
                                .join(' / ')}
                              {currentSteps.length > 3 && '...'}
                            </div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={observerTarget} className="h-10" />

      {isLoading && (
        <div className="mt-4 text-center text-gray-500">로딩 중...</div>
      )}

      {!hasNextPage && recipes.length > 0 && (
        <div className="mt-4 text-center text-gray-500">
          모든 레시피를 불러왔습니다.
        </div>
      )}

      {/* 이미지 수정 모달 */}
      {imageModalState && (
        <ImageEditModal
          isOpen={imageModalState.isOpen}
          onClose={() => setImageModalState(null)}
          currentImageUrl={
            recipes.find(r => r.id === imageModalState.recipeId)?.imageUrl
          }
          onSave={imageUrl => {
            updateEditedRecipe(imageModalState.recipeId, { imageUrl });
            setImageModalState(null);
          }}
        />
      )}

      {/* 재료 수정 모달 */}
      {ingredientsModalState && (
        <IngredientsEditModal
          isOpen={ingredientsModalState.isOpen}
          onClose={() => setIngredientsModalState(null)}
          currentIngredients={
            editedRecipes.get(ingredientsModalState.recipeId)?.ingredients ??
            recipes.find(r => r.id === ingredientsModalState.recipeId)
              ?.ingredients ??
            []
          }
          availableFoods={foodList}
          onSave={ingredients => {
            updateEditedRecipe(ingredientsModalState.recipeId, {
              ingredients,
            });
            setIngredientsModalState(null);
          }}
        />
      )}

      {/* 양념 수정 모달 */}
      {seasoningsModalState && (
        <SeasoningsEditModal
          isOpen={seasoningsModalState.isOpen}
          onClose={() => setSeasoningsModalState(null)}
          currentSeasonings={
            editedRecipes.get(seasoningsModalState.recipeId)?.seasonings ??
            recipes.find(r => r.id === seasoningsModalState.recipeId)
              ?.seasonings ??
            []
          }
          availableSeasonings={availableSeasonings}
          onSave={seasonings => {
            updateEditedRecipe(seasoningsModalState.recipeId, {
              seasonings,
            });
            setSeasoningsModalState(null);
          }}
        />
      )}

      {/* 요리순서 수정 모달 */}
      {stepsModalState && (
        <StepsEditModal
          isOpen={stepsModalState.isOpen}
          onClose={() => setStepsModalState(null)}
          currentSteps={
            editedRecipes.get(stepsModalState.recipeId)?.steps ??
            recipes.find(r => r.id === stepsModalState.recipeId)?.steps ??
            []
          }
          onSave={steps => {
            updateEditedRecipe(stepsModalState.recipeId, { steps });
            setStepsModalState(null);
          }}
        />
      )}
    </div>
  );
}

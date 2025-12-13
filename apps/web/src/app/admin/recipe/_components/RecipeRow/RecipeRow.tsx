'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import { EditableCell } from '@/app/admin/recipe/_components/Cell/EditableCell';
import {
  RecipeRowContext,
  useRecipeRowContextWithTable,
} from '@/app/admin/recipe/_components/RecipeRow/RecipeRowContext';
import { useRecipeTableActionsContext } from '@/app/admin/recipe/_components/RecipeTableActionsContext';
import { useRecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
import { ConditionSelect } from '@/app/admin/recipe/_components/Select/ConditionSelect';
import { ToolsSelect } from '@/app/admin/recipe/_components/Select/ToolsSelect';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { normalizeImageUrl } from '@/lib/url';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface RecipeRowProps {
  editedData?: Partial<RecipeUpdateRequest>;
  recipeItem: AdminRecipe;
}

function RecipeRowProvider({ editedData, recipeItem }: RecipeRowProps) {
  const dataContext = useRecipeTableDataContext();
  const actionsContext = useRecipeTableActionsContext();

  // 현재 값 계산 로직을 useMemo로 최적화
  const currentValues = useMemo(() => {
    return {
      conditionId:
        editedData?.conditionId ??
        actionsContext.getConditionId(recipeItem.condition),
      description: editedData?.description ?? recipeItem.description ?? '',
      duration: editedData?.duration
        ? String(editedData.duration)
        : recipeItem.duration,
      imageUrl: editedData?.imageUrl ?? recipeItem.imageUrl,
      ingredients: editedData?.ingredients ?? recipeItem.ingredients ?? [],
      seasonings: editedData?.seasonings ?? recipeItem.seasonings ?? [],
      steps: editedData?.steps ?? recipeItem.steps ?? [],
      title: editedData?.title ?? recipeItem.title ?? '',
      tools: editedData?.tools ?? recipeItem.tools ?? [],
    };
  }, [editedData, recipeItem, actionsContext]);

  const contextValue = useMemo(() => {
    const isEditing = (field: string) =>
      dataContext.editingCell?.recipeId === recipeItem.id &&
      dataContext.editingCell?.field === field;

    return {
      currentValues,
      editedData,
      isEditing,
      recipeItem,
    };
  }, [currentValues, editedData, recipeItem, dataContext.editingCell]);

  const isSelected = dataContext.selectedRecipeId === recipeItem.id;

  const handleRowClick = useCallback(() => {
    actionsContext.setSelectedRecipeId(isSelected ? null : recipeItem.id);
  }, [isSelected, recipeItem.id, actionsContext]);

  const isStepsExpanded = dataContext.expandedStepsRecipeId === recipeItem.id;

  return (
    <RecipeRowContext.Provider value={contextValue}>
      <>
        <TableRow
          className={`${isSelected ? 'bg-primary-pressed/50' : ''}`}
          onClick={handleRowClick}
        >
          <CheckboxCell />
          <IdCell />
          <TitleCell />
          <ImageCell />
          <DurationCell />
          <ConditionCell />
          <DescriptionCell />
          <ToolsCell />
          <IngredientsCell />
          <IrreplaceableIngredientsCell />
          <SeasoningsCell />
          <StepsCell />
        </TableRow>
        {isStepsExpanded && <ExpandedStepsRow />}
      </>
    </RecipeRowContext.Provider>
  );
}

// 하위 컴포넌트들
function CheckboxCell() {
  const { recipeItem } = useRecipeRowContextWithTable();
  const { selectedIds } = useRecipeTableDataContext();
  const { onSelectOne } = useRecipeTableActionsContext();

  return (
    <TableCell>
      <Checkbox
        checked={selectedIds.has(recipeItem.id)}
        onCheckedChange={checked =>
          onSelectOne(recipeItem.id, checked === true)
        }
        onClick={e => e.stopPropagation()}
      />
    </TableCell>
  );
}

function IdCell() {
  const { recipeItem } = useRecipeRowContextWithTable();

  const { setSelectedCell } = useRecipeTableActionsContext();

  // 신규 레코드(음수 ID)인 경우 공란으로 표시
  const isNewRecord = recipeItem.id < 0;

  return (
    <TableCell
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'id', recipeId: recipeItem.id });
      }}
    >
      {isNewRecord ? '' : recipeItem.id}
    </TableCell>
  );
}

function TitleCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { selectedCell } = useRecipeTableDataContext();
  const { setEditingCell, setSelectedCell, updateEditedRecipe } =
    useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id && selectedCell?.field === 'title';

  if (isEditing('title')) {
    return (
      <TableCell className="font-medium">
        <EditableCell
          value={currentValues.title}
          onSave={value => {
            updateEditedRecipe(recipeItem.id, {
              title: String(value),
            });
            setEditingCell(null);
          }}
          type="text"
          initialEditing
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      className={`font-medium ${isSelected ? 'border-primary border-2' : ''}`}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'title', recipeId: recipeItem.id });
      }}
    >
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'title',
            recipeId: recipeItem.id,
          })
        }
        className="min-h-[1.5rem] cursor-pointer select-none hover:bg-gray-50"
      >
        {currentValues.title || (
          <span className="pointer-events-none text-gray-400">
            더블클릭하여 입력
          </span>
        )}
      </div>
    </TableCell>
  );
}

function ImageCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { selectedCell } = useRecipeTableDataContext();
  const { openModal, setSelectedCell } = useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id && selectedCell?.field === 'image';
  const isNewRecord = recipeItem.id < 0;

  if (currentValues.imageUrl) {
    return (
      <TableCell
        className={`relative ${isSelected ? 'border-primary border-2' : ''}`}
        onClick={e => {
          e.stopPropagation();
          setSelectedCell({ field: 'image', recipeId: recipeItem.id });
        }}
      >
        <div
          onDoubleClick={() => openModal('image', recipeItem.id)}
          className="cursor-pointer"
        >
          <Image
            src={normalizeImageUrl(currentValues.imageUrl)}
            alt={currentValues.title}
            width={60}
            height={60}
            className="h-[60px] w-[60px] rounded object-cover"
          />
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell
      className={`relative ${isSelected ? 'border-primary border-2' : ''}`}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'image', recipeId: recipeItem.id });
      }}
    >
      {isNewRecord ? (
        <Button
          onClick={e => {
            e.stopPropagation();
            openModal('image', recipeItem.id);
          }}
          size="sm"
          variant="outline"
        >
          등록
        </Button>
      ) : (
        <span
          onDoubleClick={() => openModal('image', recipeItem.id)}
          className="cursor-pointer text-gray-400 hover:bg-gray-50"
        >
          -
        </span>
      )}
    </TableCell>
  );
}

function DurationCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { selectedCell } = useRecipeTableDataContext();
  const { setEditingCell, setSelectedCell, updateEditedRecipe } =
    useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id &&
    selectedCell?.field === 'duration';

  if (isEditing('duration')) {
    return (
      <TableCell>
        <EditableCell
          value={Number(currentValues.duration) || 0}
          onSave={value => {
            updateEditedRecipe(recipeItem.id, {
              duration: Number(value),
            });
            setEditingCell(null);
          }}
          type="number"
          initialEditing
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      className={isSelected ? 'border-primary border-2' : ''}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'duration', recipeId: recipeItem.id });
      }}
    >
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'duration',
            recipeId: recipeItem.id,
          })
        }
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.duration}
      </div>
    </TableCell>
  );
}

function ConditionCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { conditions, selectedCell } = useRecipeTableDataContext();
  const { setEditingCell, setSelectedCell, updateEditedRecipe } =
    useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id &&
    selectedCell?.field === 'condition';
  const isNewRecord = recipeItem.id < 0;
  const hasCondition = conditions.find(c => c.id === currentValues.conditionId);

  if (isEditing('condition')) {
    return (
      <TableCell className="relative">
        <ConditionSelect
          conditions={conditions}
          currentConditionId={currentValues.conditionId}
          onSelect={conditionId => {
            updateEditedRecipe(recipeItem.id, {
              conditionId,
            });
            setEditingCell(null);
          }}
          onClose={() => setEditingCell(null)}
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      className={`relative ${isSelected ? 'border-primary border-2' : ''}`}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'condition', recipeId: recipeItem.id });
      }}
    >
      {isNewRecord && !hasCondition ? (
        <Button
          onClick={e => {
            e.stopPropagation();
            setEditingCell({
              field: 'condition',
              recipeId: recipeItem.id,
            });
          }}
          size="sm"
          variant="outline"
        >
          등록
        </Button>
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
          {hasCondition?.name ?? '-'}
        </div>
      )}
    </TableCell>
  );
}

function DescriptionCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { selectedCell } = useRecipeTableDataContext();
  const { setEditingCell, setSelectedCell, updateEditedRecipe } =
    useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id &&
    selectedCell?.field === 'description';

  if (isEditing('description')) {
    return (
      <TableCell>
        <EditableCell
          value={currentValues.description}
          onSave={value => {
            updateEditedRecipe(recipeItem.id, {
              description: String(value),
            });
            setEditingCell(null);
          }}
          type="text"
          initialEditing
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      className={isSelected ? 'border-primary border-2' : ''}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'description', recipeId: recipeItem.id });
      }}
    >
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'description',
            recipeId: recipeItem.id,
          })
        }
        className="min-h-[1.5rem] cursor-pointer select-none hover:bg-gray-50"
      >
        {currentValues.description || (
          <span className="pointer-events-none text-gray-400">
            더블클릭하여 입력
          </span>
        )}
      </div>
    </TableCell>
  );
}

function ToolsCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { availableTools, selectedCell } = useRecipeTableDataContext();
  const { setEditingCell, setSelectedCell, updateEditedRecipe } =
    useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id && selectedCell?.field === 'tools';
  const isNewRecord = recipeItem.id < 0;
  const hasTools = currentValues.tools.length > 0;

  if (isEditing('tools')) {
    return (
      <TableCell
        className="relative"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <ToolsSelect
          recipeId={recipeItem.id}
          selectedToolIds={currentValues.tools.map(t => t.id)}
          onSelect={toolIds => {
            updateEditedRecipe(recipeItem.id, {
              tools: toolIds.map(id => ({ id })),
            });
            setEditingCell(null);
          }}
          onClose={() => setEditingCell(null)}
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      className={`relative ${isSelected ? 'border-primary border-2' : ''}`}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'tools', recipeId: recipeItem.id });
      }}
    >
      {isNewRecord && !hasTools ? (
        <Button
          onClick={e => {
            e.stopPropagation();
            setEditingCell({
              field: 'tools',
              recipeId: recipeItem.id,
            });
          }}
          size="sm"
          variant="outline"
        >
          등록
        </Button>
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
          {hasTools
            ? availableTools
                .filter(t => currentValues.tools.some(ct => ct.id === t.id))
                .map(t => t.name)
                .join(', ')
            : '-'}
        </div>
      )}
    </TableCell>
  );
}

function IngredientsCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { foodList, selectedCell } = useRecipeTableDataContext();
  const { openModal, setSelectedCell } = useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id &&
    selectedCell?.field === 'ingredients';
  const isNewRecord = recipeItem.id < 0;
  const hasIngredients = currentValues.ingredients.length > 0;

  return (
    <TableCell
      className={isSelected ? 'border-primary border-2' : ''}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'ingredients', recipeId: recipeItem.id });
      }}
    >
      {isNewRecord && !hasIngredients ? (
        <Button
          onClick={e => {
            e.stopPropagation();
            openModal('ingredients', recipeItem.id);
          }}
          size="sm"
          variant="outline"
        >
          등록
        </Button>
      ) : (
        <div
          onDoubleClick={() => openModal('ingredients', recipeItem.id)}
          className="cursor-pointer hover:bg-gray-50"
        >
          {hasIngredients
            ? foodList
                .filter(f =>
                  currentValues.ingredients.some(ci => ci.id === f.id)
                )
                .map(f => f.name)
                .join(', ')
            : '-'}
        </div>
      )}
    </TableCell>
  );
}

function IrreplaceableIngredientsCell() {
  const { recipeItem } = useRecipeRowContextWithTable();
  const { selectedCell } = useRecipeTableDataContext();
  const { setSelectedCell } = useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id &&
    selectedCell?.field === 'irreplaceableIngredients';

  return (
    <TableCell
      className={isSelected ? 'border-primary border-2' : ''}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({
          field: 'irreplaceableIngredients',
          recipeId: recipeItem.id,
        });
      }}
    >
      {recipeItem.irreplaceableIngredients ?? '-'}
    </TableCell>
  );
}

function SeasoningsCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { availableSeasonings, selectedCell } = useRecipeTableDataContext();
  const { openModal, setSelectedCell } = useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id &&
    selectedCell?.field === 'seasonings';
  const isNewRecord = recipeItem.id < 0;
  const hasSeasonings = currentValues.seasonings.length > 0;

  return (
    <TableCell
      className={isSelected ? 'border-primary border-2' : ''}
      onClick={e => {
        e.stopPropagation();
        setSelectedCell({ field: 'seasonings', recipeId: recipeItem.id });
      }}
    >
      {isNewRecord && !hasSeasonings ? (
        <Button
          onClick={e => {
            e.stopPropagation();
            openModal('seasonings', recipeItem.id);
          }}
          size="sm"
          variant="outline"
        >
          등록
        </Button>
      ) : (
        <div
          onDoubleClick={() => openModal('seasonings', recipeItem.id)}
          className="cursor-pointer hover:bg-gray-50"
        >
          {hasSeasonings
            ? availableSeasonings
                .filter(s =>
                  currentValues.seasonings.some(cs => cs.id === s.id)
                )
                .map(s => s.name)
                .join(', ')
            : '-'}
        </div>
      )}
    </TableCell>
  );
}

function StepsCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { expandedStepsRecipeId, selectedCell } = useRecipeTableDataContext();
  const { setExpandedStepsRecipeId, setSelectedCell } =
    useRecipeTableActionsContext();

  const isSelected =
    selectedCell?.recipeId === recipeItem.id && selectedCell?.field === 'steps';
  const isExpanded = expandedStepsRecipeId === recipeItem.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCell({ field: 'steps', recipeId: recipeItem.id });
    setExpandedStepsRecipeId(isExpanded ? null : recipeItem.id);
  };

  return (
    <TableCell
      className={isSelected ? 'border-primary border-2' : ''}
      onClick={handleClick}
    >
      <div className="cursor-pointer hover:bg-gray-50">
        {currentValues.steps.length > 0 ? (
          <div className="font-medium">{currentValues.steps.length}단계</div>
        ) : (
          '-'
        )}
      </div>
    </TableCell>
  );
}

function ExpandedStepsRow() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { editingCell } = useRecipeTableDataContext();
  const { openModal, setEditingCell, updateEditedRecipe } =
    useRecipeTableActionsContext();
  const sortedSteps = [...currentValues.steps].sort(
    (a, b) => a.orderNum - b.orderNum
  );

  const handleStepContentSave = (orderNum: number, content: string) => {
    const updatedSteps = currentValues.steps.map(step =>
      step.orderNum === orderNum ? { ...step, content } : step
    );

    updateEditedRecipe(recipeItem.id, {
      steps: updatedSteps.map(step => ({
        ...step,
        imageUrl: step.imageUrl ?? '',
        summary: step.summary,
      })),
    });
    setEditingCell(null);
  };

  const isEditingStep = (orderNum: number) =>
    editingCell?.recipeId === recipeItem.id &&
    editingCell?.field === `step-${orderNum}`;

  return (
    <TableRow>
      <TableCell colSpan={12} className="bg-gray-50 p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">조리 순서</h3>
          {sortedSteps.length > 0 ? (
            <div className="space-y-4">
              {sortedSteps.map(step => (
                <div
                  key={step.orderNum}
                  className="flex gap-4 rounded border bg-white p-4"
                >
                  <div
                    className="relative h-32 w-32 flex-shrink-0 cursor-pointer"
                    onDoubleClick={() =>
                      openModal('image', recipeItem.id, step.orderNum)
                    }
                  >
                    {step.imageUrl ? (
                      <Image
                        src={normalizeImageUrl(step.imageUrl)}
                        alt={`Step ${step.orderNum}`}
                        fill
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-400">
                        더블클릭하여
                        <br />
                        이미지 추가
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 font-semibold">
                      Step {step.orderNum}
                    </div>
                    {isEditingStep(step.orderNum) ? (
                      <EditableTextarea
                        value={step.content ?? step.summary}
                        onSave={value =>
                          handleStepContentSave(step.orderNum, String(value))
                        }
                        onCancel={() => setEditingCell(null)}
                      />
                    ) : (
                      <div
                        onDoubleClick={() =>
                          setEditingCell({
                            field: `step-${step.orderNum}`,
                            recipeId: recipeItem.id,
                          })
                        }
                        className="min-h-[3rem] cursor-pointer rounded p-2 text-sm whitespace-pre-wrap text-gray-700 hover:bg-gray-50"
                      >
                        {(step.content ?? step.summary) || (
                          <span className="text-gray-400">
                            더블클릭하여 입력
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">조리 순서가 없습니다.</div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function EditableTextarea({
  onCancel,
  onSave,
  value,
}: {
  onCancel: () => void;
  onSave: (value: string) => void;
  value: string;
}) {
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSave(editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    onSave(editValue);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={editValue}
      onChange={e => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="min-h-[3rem] resize-none"
      rows={3}
    />
  );
}

export const RecipeRow = RecipeRowProvider;

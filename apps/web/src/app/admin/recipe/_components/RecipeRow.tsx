'use client';

import { useCallback, useMemo } from 'react';
import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { normalizeImageUrl } from '@/lib/url';

import {
  RecipeRowContext,
  useRecipeRowContextWithTable,
} from './RecipeRow/RecipeRowContext';
import { ConditionSelect } from './ConditionSelect';
import { EditableCell } from './EditableCell';
import { useRecipeTableActionsContext } from './RecipeTableActionsContext';
import { useRecipeTableDataContext } from './RecipeTableDataContext';
import { ToolsSelect } from './ToolsSelect';

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
      title: editedData?.title ?? recipeItem.title,
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

  return (
    <RecipeRowContext.Provider value={contextValue}>
      <TableRow
        className={isSelected ? 'bg-blue-50' : ''}
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

  return <TableCell>{recipeItem.id}</TableCell>;
}

function TitleCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { setEditingCell, updateEditedRecipe } = useRecipeTableActionsContext();

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
        />
      </TableCell>
    );
  }

  return (
    <TableCell className="font-medium">
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'title',
            recipeId: recipeItem.id,
          })
        }
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.title}
      </div>
    </TableCell>
  );
}

function ImageCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { openModal } = useRecipeTableActionsContext();

  if (currentValues.imageUrl) {
    return (
      <TableCell className="relative">
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
    <TableCell className="relative">
      <span
        onDoubleClick={() => openModal('image', recipeItem.id)}
        className="cursor-pointer text-gray-400 hover:bg-gray-50"
      >
        -
      </span>
    </TableCell>
  );
}

function DurationCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { setEditingCell, updateEditedRecipe } = useRecipeTableActionsContext();

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
        />
      </TableCell>
    );
  }

  return (
    <TableCell>
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
  const { conditions } = useRecipeTableDataContext();
  const { setEditingCell, updateEditedRecipe } = useRecipeTableActionsContext();

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
    <TableCell className="relative">
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'condition',
            recipeId: recipeItem.id,
          })
        }
        className="cursor-pointer hover:bg-gray-50"
      >
        {conditions.find(c => c.id === currentValues.conditionId)?.name ?? '-'}
      </div>
    </TableCell>
  );
}

function DescriptionCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { setEditingCell, updateEditedRecipe } = useRecipeTableActionsContext();

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
        />
      </TableCell>
    );
  }

  return (
    <TableCell>
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'description',
            recipeId: recipeItem.id,
          })
        }
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.description ?? '-'}
      </div>
    </TableCell>
  );
}

function ToolsCell() {
  const { currentValues, isEditing, recipeItem } =
    useRecipeRowContextWithTable();
  const { availableTools } = useRecipeTableDataContext();
  const { setEditingCell, updateEditedRecipe } = useRecipeTableActionsContext();

  if (isEditing('tools')) {
    return (
      <TableCell className="relative">
        <ToolsSelect
          availableTools={availableTools}
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
    <TableCell className="relative">
      <div
        onDoubleClick={() =>
          setEditingCell({
            field: 'tools',
            recipeId: recipeItem.id,
          })
        }
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.tools.length > 0
          ? availableTools
              .filter(t => currentValues.tools.some(ct => ct.id === t.id))
              .map(t => t.name)
              .join(', ')
          : '-'}
      </div>
    </TableCell>
  );
}

function IngredientsCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { foodList } = useRecipeTableDataContext();
  const { openModal } = useRecipeTableActionsContext();

  return (
    <TableCell>
      <div
        onDoubleClick={() => openModal('ingredients', recipeItem.id)}
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.ingredients.length > 0
          ? foodList
              .filter(f => currentValues.ingredients.some(ci => ci.id === f.id))
              .map(f => f.name)
              .join(', ')
          : '-'}
      </div>
    </TableCell>
  );
}

function IrreplaceableIngredientsCell() {
  const { recipeItem } = useRecipeRowContextWithTable();

  return <TableCell>{recipeItem.irreplaceableIngredients ?? '-'}</TableCell>;
}

function SeasoningsCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { availableSeasonings } = useRecipeTableDataContext();
  const { openModal } = useRecipeTableActionsContext();

  return (
    <TableCell>
      <div
        onDoubleClick={() => openModal('seasonings', recipeItem.id)}
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.seasonings.length > 0
          ? availableSeasonings
              .filter(s => currentValues.seasonings.some(cs => cs.id === s.id))
              .map(s => s.name)
              .join(', ')
          : '-'}
      </div>
    </TableCell>
  );
}

function StepsCell() {
  const { currentValues, recipeItem } = useRecipeRowContextWithTable();
  const { openModal } = useRecipeTableActionsContext();

  return (
    <TableCell>
      <div
        onDoubleClick={() => openModal('steps', recipeItem.id)}
        className="cursor-pointer hover:bg-gray-50"
      >
        {currentValues.steps.length > 0 ? (
          <div className="space-y-1">
            <div className="font-medium">{currentValues.steps.length}단계</div>
            <div className="max-w-xs truncate text-xs text-gray-600">
              {currentValues.steps
                .sort((a, b) => a.orderNum - b.orderNum)
                .map(step => step.summary ?? step.content)
                .filter(Boolean)
                .slice(0, 3)
                .join(' / ')}
              {currentValues.steps.length > 3 && '...'}
            </div>
          </div>
        ) : (
          '-'
        )}
      </div>
    </TableCell>
  );
}

export const RecipeRow = RecipeRowProvider;

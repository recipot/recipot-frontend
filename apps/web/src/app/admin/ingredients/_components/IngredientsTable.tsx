'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  useCategories,
  useCreateIngredients,
  useDeleteIngredients,
  useIngredients,
  useUpdateIngredients,
} from '@/hooks/useIngredients';

import { CategorySelect } from './CategorySelect';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditableCell } from './EditableCell';
import { HealthInfosCell } from './HealthInfoCell';

import type {
  CreateIngredientData,
  Ingredient,
  UpdateIngredientData,
} from 'packages/api/src/ingredientAPI';

interface LocalIngredient extends Ingredient {
  isNew?: boolean;
  isModified?: boolean;
}

export function IngredientsTable() {
  const [localIngredients, setLocalIngredients] = useState<LocalIngredient[]>(
    []
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    id: number | string;
    field: keyof Ingredient;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string | number, string>>({});
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevIngredientsRef = useRef<Ingredient[]>([]);

  const {
    data: ingredients = [],
    isFetching,
    isLoading,
  } = useIngredients({
    limit: 20,
    page,
  });
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateIngredients();
  const updateMutation = useUpdateIngredients();
  const deleteMutation = useDeleteIngredients();

  useEffect(() => {
    const hasChanged =
      ingredients.length !== prevIngredientsRef.current.length ||
      ingredients.some(
        (item, index) => item.id !== prevIngredientsRef.current[index]?.id
      );

    if (hasChanged && ingredients.length > 0) {
      setLocalIngredients(prev => {
        // 새로운 데이터인 경우에만 추가
        const existingIds = new Set(
          prev.filter(i => typeof i.id === 'number').map(i => i.id)
        );
        const newItems = ingredients.filter(i => !existingIds.has(i.id));

        if (page === 1) {
          // 첫 페이지는 교체 (편집 중인 항목은 유지)
          const editingItems = prev.filter(i => i.isNew ?? i.isModified);
          return [...editingItems, ...ingredients];
        } else {
          // 다음 페이지는 추가
          return [...prev, ...newItems];
        }
      });

      // 이전 데이터 참조 업데이트
      prevIngredientsRef.current = ingredients;
    }
  }, [ingredients, page]);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          ingredients.length === 20
        ) {
          setPage(prev => prev + 1);
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
  }, [isFetching, ingredients.length]);

  // Shift+Enter로 새 행 추가
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        addNewRow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addNewRow = () => {
    const newIngredient: LocalIngredient = {
      health_infos: [],
      id: `new-${Date.now()}` as any,
      ingredient_category_id: 0,
      isNew: true,
      name: '',
    };
    setLocalIngredients(prev => [newIngredient, ...prev]);
  };

  // 체크박스 선택
  const toggleSelection = (id: number | string) => {
    if (typeof id === 'string') return;

    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    const existingIngredients = localIngredients.filter(
      i => typeof i.id === 'number'
    );

    if (
      selectedIds.size === existingIngredients.length &&
      existingIngredients.length > 0
    ) {
      setSelectedIds(new Set());
    } else {
      const allIds = existingIngredients.map(i => i.id);
      setSelectedIds(new Set(allIds));
    }
  };

  // 삭제 처리
  const handleDeleteClick = () => {
    if (selectedIds.size === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(Array.from(selectedIds));

      setLocalIngredients(prev =>
        prev.filter(item => !selectedIds.has(item.id))
      );
      setSelectedIds(new Set());
      setIsDeleteModalOpen(false);
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete ingredients:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 셀 편집
  const handleCellDoubleClick = (
    id: number | string,
    field: keyof Ingredient
  ) => {
    if (field === 'id') return;
    setEditingCell({ field, id });
  };

  const handleCellChange = (
    id: number | string,
    field: keyof Ingredient,
    value: any
  ) => {
    setLocalIngredients(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updates: Partial<LocalIngredient> = { [field]: value };

          return {
            ...item,
            ...updates,
            isModified: !item.isNew,
          };
        }
        return item;
      })
    );

    // 에러 제거
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  // 중복 체크
  const checkDuplicateName = (
    name: string,
    currentId: number | string
  ): boolean => {
    return localIngredients.some(
      item => item.name.trim() === name.trim() && item.id !== currentId
    );
  };

  // 저장 처리
  const handleSave = async () => {
    const newErrors: Record<string | number, string> = {};

    // 신규와 수정 항목 분리
    const newItems = localIngredients.filter(item => item.isNew);
    const modifiedItems = localIngredients.filter(item => item.isModified);

    // 유효성 검사
    [...newItems, ...modifiedItems].forEach(item => {
      const itemId = item.id as string | number;

      if (!item.name.trim()) {
        newErrors[itemId] = '재료명은 필수입니다.';
      } else if (checkDuplicateName(item.name, item.id as any)) {
        newErrors[itemId] = `${item.name}이(가) 이미 존재합니다.`;
      } else if (!item.ingredient_category_id) {
        newErrors[itemId] = '대분류는 필수입니다.';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 신규 항목 생성
      if (newItems.length > 0) {
        const createData: CreateIngredientData[] = newItems.map(item => ({
          health_infos: item.health_infos || [], // ✅ 안전한 접근
          ingredient_category_id: item.ingredient_category_id,
          name: item.name,
        }));

        await createMutation.mutateAsync(createData);
      }

      // 수정 항목 업데이트
      if (modifiedItems.length > 0) {
        const updateData: UpdateIngredientData[] = modifiedItems.map(item => ({
          health_infos: item.health_infos || [],
          id: item.id,
          ingredient_category_id: item.ingredient_category_id,
          name: item.name,
        }));

        await updateMutation.mutateAsync(updateData);
      }

      // 로컬 상태에서 저장된 항목 제거
      setLocalIngredients(prev =>
        prev.filter(item => !item.isNew && !item.isModified)
      );

      setErrors({});
      alert('저장되었습니다.');
    } catch (error) {
      console.error('Failed to save ingredients:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const displayIngredients = useMemo(() => {
    return localIngredients.map(item => ({
      ...item,
      categoryName:
        categories.find(c => c.id === item.ingredient_category_id)?.name ?? '',
    }));
  }, [localIngredients, categories]);

  return (
    <div className="space-y-[1.875rem]">
      <div className="sticky top-0 z-20 bg-white pt-14">
        <div className="mr-9 mb-[1.0625rem] flex justify-end gap-[1.6875rem]">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDeleteClick}
            disabled={selectedIds.size === 0 || deleteMutation.isPending}
            className="border-primary h-[2.625rem] w-[3.875rem] rounded-none px-[0.625rem]"
          >
            <Image width={42} height={42} src="/delete.png" alt="삭제 버튼" />
          </Button>
          <Button
            onClick={handleSave}
            className="text-20 h-10 w-[8.3125rem] rounded-none bg-[#A8C67F] px-[1.125rem] py-[0.625rem] text-black hover:bg-[#7a9c57]"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? '저장 중...'
              : '저장'}
          </Button>
        </div>
        <div className="flex h-[3.125rem]">
          <div className="flex w-[4%] items-center justify-center" />
          <div className="bg-primary flex w-[4%] items-center justify-center border border-gray-300 text-white">
            ID
          </div>
          <div className="bg-primary flex w-[15%] items-center justify-center border border-gray-300 text-white">
            재료
          </div>
          <div className="bg-primary flex w-[15%] items-center justify-center border border-gray-300 text-white">
            대분류
          </div>
          <div className="bg-primary flex w-[20%] items-center justify-center border border-gray-300 text-white">
            못 먹는 재료 여부
          </div>
          <div className="bg-primary flex w-[42%] items-center justify-center border border-gray-300 text-white">
            재료 한 줄 카피
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div>
        {/* 테이블 바디 */}
        <Table className="w-full border-collapse">
          <TableBody>
            {displayIngredients.map(ingredient => (
              <TableRow
                key={ingredient.id}
                className={errors[ingredient.id] ? 'bg-red-50' : ''}
              >
                <TableCell
                  className="w-12 border border-gray-300"
                  style={{ width: '4%' }}
                >
                  <Checkbox
                    checked={selectedIds.has(ingredient.id)}
                    onCheckedChange={() => toggleSelection(ingredient.id)}
                    disabled={typeof ingredient.id === 'string'}
                  />
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '4%' }}
                >
                  {ingredient.id}
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '15%' }}
                  onDoubleClick={() =>
                    handleCellDoubleClick(ingredient.id, 'name')
                  }
                >
                  <EditableCell
                    value={ingredient.name}
                    isEditing={
                      editingCell?.id === ingredient.id &&
                      editingCell?.field === 'name'
                    }
                    onChange={value =>
                      handleCellChange(ingredient.id, 'name', value)
                    }
                    onBlur={handleCellBlur}
                    error={errors[ingredient.id]}
                  />
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '15%' }}
                  onDoubleClick={() =>
                    handleCellDoubleClick(
                      ingredient.id,
                      'ingredient_category_id'
                    )
                  }
                >
                  <CategorySelect
                    value={ingredient.ingredient_category_id}
                    categories={categories}
                    isEditing={
                      editingCell?.id === ingredient.id &&
                      editingCell?.field === 'ingredient_category_id'
                    }
                    onChange={value =>
                      handleCellChange(
                        ingredient.id,
                        'ingredient_category_id',
                        value
                      )
                    }
                    onBlur={handleCellBlur}
                  />
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '20%' }}
                  onDoubleClick={() =>
                    handleCellDoubleClick(ingredient.id, 'health_infos')
                  }
                >
                  <select>
                    <option value="">선택</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '42%' }}
                  onDoubleClick={() =>
                    handleCellDoubleClick(ingredient.id, 'health_infos')
                  }
                >
                  <HealthInfosCell
                    value={ingredient.health_infos ?? []}
                    isEditing={
                      editingCell?.id === ingredient.id &&
                      editingCell?.field === 'health_infos'
                    }
                    onChange={value =>
                      handleCellChange(ingredient.id, 'health_infos', value)
                    }
                    onBlur={handleCellBlur}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 로딩 상태 */}
      {(isLoading || isFetching) && (
        <div className="py-4 text-center text-gray-500">로딩 중...</div>
      )}

      {/* 무한 스크롤 트리거 */}
      <div ref={observerTarget} className="h-4" />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        count={selectedIds.size}
      />
    </div>
  );
}

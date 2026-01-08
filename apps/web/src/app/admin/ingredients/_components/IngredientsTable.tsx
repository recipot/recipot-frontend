'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
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
import { EditableCell } from './EditableCell';
import { HealthInfosCell } from './HealthInfoCell';

import type {
  CreateIngredientData,
  Ingredient,
  UpdateIngredientData,
} from 'packages/api/src/ingredientAPI';

// ✅ id를 optional로 변경, categoryId를 nullable로 변경
interface LocalIngredient
  extends Omit<Ingredient, 'id' | 'categoryId' | 'isUserRestricted'> {
  id?: number;
  categoryId: number | null;
  isUserRestricted?: boolean;
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
    id?: number;
    field: keyof LocalIngredient;
  } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{
    id?: number;
    field: keyof LocalIngredient;
  } | null>(null); // ✅ 선택된 셀 추적
  const [errors, setErrors] = useState<Record<number, string>>({});
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
        // ✅ id가 있는 항목만 필터링
        const existingIds = new Set(
          prev.filter(i => i.id !== undefined).map(i => i.id!)
        );
        const newItems = ingredients.filter(i => !existingIds.has(i.id));

        if (page === 1) {
          // 첫 페이지는 교체 (편집 중인 항목은 유지)
          const editingItems = prev.filter(i => i.isNew || i.isModified);
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
    // ✅ id 없이 새 행 추가
    const newIngredient: LocalIngredient = {
      categoryId: null,
      categoryName: '',
      health_infos: [],
      isNew: true,
      isUserRestricted: false,
      name: '',
    };
    setLocalIngredients(prev => [newIngredient, ...prev]);
  };

  // 체크박스 선택
  const toggleSelection = (id?: number) => {
    if (id === undefined) return;

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
      i => i.id !== undefined
    );

    if (
      selectedIds.size === existingIngredients.length &&
      existingIngredients.length > 0
    ) {
      setSelectedIds(new Set());
    } else {
      const allIds = existingIngredients.map(i => i.id!);
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
        prev.filter(item => item.id === undefined || !selectedIds.has(item.id))
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
    id: number | undefined,
    field: keyof LocalIngredient
  ) => {
    if (field === 'id') return;
    setEditingCell({ field, id });
  };

  // ✅ 셀 클릭 핸들러 (단일 클릭)
  const handleCellClick = (
    id: number | undefined,
    field: keyof LocalIngredient
  ) => {
    if (field === 'id') return;
    setSelectedCell({ field, id });
  };

  const handleCellChange = (
    id: number | undefined,
    field: keyof LocalIngredient,
    value: any
  ) => {
    setLocalIngredients(prev =>
      prev.map((item, index) => {
        // ✅ id가 있으면 id로 비교, 없으면 인덱스로 비교
        const isMatch =
          id !== undefined
            ? item.id === id
            : index === prev.findIndex(i => i.id === undefined && i.isNew);

        if (isMatch) {
          const updates: Partial<LocalIngredient> = { [field]: value };

          return {
            ...item,
            ...updates,
            isModified: !item.isNew && item.id !== undefined,
          };
        }
        return item;
      })
    );

    // 에러 제거 (id가 있는 경우만)
    if (id !== undefined && errors[id]) {
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
    currentId: number | undefined,
    currentIndex: number
  ): boolean => {
    return localIngredients.some((item, index) => {
      // ✅ id가 있으면 id로 비교, 없으면 인덱스로 비교
      const isSameItem =
        currentId !== undefined
          ? item.id === currentId
          : index === currentIndex;

      return item.name.trim() === name.trim() && !isSameItem;
    });
  };

  // 저장 처리
  const handleSave = async () => {
    const newErrors: Record<number, string> = {};

    // 신규와 수정 항목 분리
    const newItems = localIngredients.filter(item => item.isNew);
    const modifiedItems = localIngredients.filter(item => item.isModified);

    // 유효성 검사
    [...newItems, ...modifiedItems].forEach((item, index) => {
      // ✅ 새 항목은 임시 ID 사용, 기존 항목은 실제 ID 사용
      const itemKey = item.id ?? -(index + 1);

      if (!item.name.trim()) {
        newErrors[itemKey] = '재료명은 필수입니다.';
      } else if (checkDuplicateName(item.name, item.id, index)) {
        newErrors[itemKey] = `${item.name}이(가) 이미 존재합니다.`;
      } else if (!item.categoryId) {
        newErrors[itemKey] = '대분류는 필수입니다.';
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
          health_infos: item.health_infos || [],
          ingredient_category_id: item.categoryId!,
          name: item.name,
        }));

        await createMutation.mutateAsync(createData);
      }

      // 수정 항목 업데이트
      if (modifiedItems.length > 0) {
        const updateData: UpdateIngredientData[] = modifiedItems.map(item => ({
          health_infos: item.health_infos || [],
          id: item.id!,
          ingredient_category_id: item.categoryId!,
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
      categoryName: categories.find(c => c.id === item.categoryId)?.name ?? '',
    }));
  }, [localIngredients, categories]);

  // ✅ 삭제 모달 메시지 생성
  const deleteModalDescription = useMemo(() => {
    if (selectedIds.size === 1) {
      const selectedId = Array.from(selectedIds)[0];
      const selectedItem = localIngredients.find(
        item => item.id === selectedId
      );
      return selectedItem
        ? `"${selectedItem.name}" 재료를 삭제하시겠습니까?`
        : '선택한 항목을 삭제하시겠습니까?';
    }
    return `선택한 ${selectedIds.size}개의 항목을 삭제하시겠습니까?`;
  }, [selectedIds, localIngredients]);

  return (
    <div>
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
            {displayIngredients.map((ingredient, index) => (
              <TableRow
                key={ingredient.id ?? `new-${index}`}
                className={` ${ingredient.id && errors[ingredient.id] ? 'bg-red-50' : ''} ${selectedCell?.id === ingredient.id ? 'bg-[#A8C67F]' : ''} `}
              >
                <TableCell
                  className="w-12 border border-gray-300"
                  style={{ width: '4%' }}
                >
                  <Checkbox
                    checked={
                      ingredient.id !== undefined &&
                      selectedIds.has(ingredient.id)
                    }
                    onCheckedChange={() => toggleSelection(ingredient.id)}
                    disabled={ingredient.id === undefined}
                  />
                </TableCell>
                <TableCell
                  className="w-12 border border-gray-300"
                  style={{ width: '4%' }}
                >
                  {ingredient.id ?? '-'}
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '15%' }}
                  onClick={() => handleCellClick(ingredient.id, 'name')}
                  onDoubleClick={() =>
                    handleCellDoubleClick(ingredient.id, 'name')
                  }
                >
                  <div
                    className={`${
                      selectedCell?.id === ingredient.id &&
                      selectedCell?.field === 'name'
                        ? 'ring-1 ring-blue-500'
                        : ''
                    }`}
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
                      error={ingredient.id ? errors[ingredient.id] : undefined}
                    />
                  </div>
                </TableCell>
                <TableCell
                  className="border border-gray-300"
                  style={{ width: '15%' }}
                  onClick={() => handleCellClick(ingredient.id, 'categoryId')}
                  onDoubleClick={() =>
                    handleCellDoubleClick(ingredient.id, 'categoryId')
                  }
                >
                  <div
                    className={`${
                      selectedCell?.id === ingredient.id &&
                      selectedCell?.field === 'categoryId'
                        ? 'ring-2 ring-blue-500 ring-inset'
                        : ''
                    }`}
                  >
                    <CategorySelect
                      value={ingredient.categoryId}
                      categories={categories}
                      isEditing={
                        editingCell?.id === ingredient.id &&
                        editingCell?.field === 'categoryId'
                      }
                      onChange={value =>
                        handleCellChange(ingredient.id, 'categoryId', value)
                      }
                      onBlur={handleCellBlur}
                    />
                  </div>
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
                  onClick={() => handleCellClick(ingredient.id, 'health_infos')}
                  onDoubleClick={() =>
                    handleCellDoubleClick(ingredient.id, 'health_infos')
                  }
                >
                  <div
                    className={`${
                      selectedCell?.id === ingredient.id &&
                      selectedCell?.field === 'health_infos'
                        ? 'ring-2 ring-blue-500 ring-inset'
                        : ''
                    }`}
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
                  </div>
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

      {/* ✅ 삭제 확인 모달 - Modal 컴포넌트 사용 */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        description={deleteModalDescription}
        contentGap={24}
      >
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="full"
            shape="square"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleteMutation.isPending}
            className="text-15sb h-10 py-[0.5313rem]"
          >
            취소
          </Button>
          <Button
            size="full"
            shape="square"
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
            className="text-15sb h-10 py-[0.5313rem]"
          >
            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

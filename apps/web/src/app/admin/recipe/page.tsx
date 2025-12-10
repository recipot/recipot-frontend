'use client';

import { useEffect, useRef, useState } from 'react';
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
import { useInfiniteRecipes } from '@/hooks/useInfiniteRecipes';

export default function AdminRecipePage() {
  const { hasNextPage, isLoading, loadMore, recipes } = useInfiniteRecipes();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const observerTarget = useRef<HTMLDivElement>(null);

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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">레시피 DB</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 hover:bg-gray-100">
            <Trash size={20} />
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary-pressed rounded px-4 py-2">
            저장
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map(recipe => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(recipe.id)}
                      onCheckedChange={checked =>
                        handleSelectOne(recipe.id, checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell>{recipe.id}</TableCell>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell>
                    {recipe.imageUrl ? (
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{recipe.duration}</TableCell>
                  <TableCell>{recipe.condition ?? '-'}</TableCell>
                  <TableCell>{recipe.description ?? '-'}</TableCell>
                  <TableCell>
                    {recipe?.tools?.map(tool => tool.name).join(', ') ?? '-'}
                  </TableCell>
                  <TableCell>
                    {recipe.ingredients
                      ?.map(ingredient => ingredient.name)
                      .join(', ') ?? '-'}
                  </TableCell>
                  <TableCell>
                    {recipe.irreplaceableIngredients ?? '-'}
                  </TableCell>
                  <TableCell>
                    {recipe.seasonings
                      ?.map(seasoning => seasoning.name)
                      .join(', ') ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
}

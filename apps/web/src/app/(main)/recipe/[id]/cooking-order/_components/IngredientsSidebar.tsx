'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';
import { IngredientsList } from '@/components/common/IngredientsList';
import { SeasoningsSection } from '@/components/common/SeasoningsSection';
import {
  Sidebar,
  SidebarContent,
  SidebarDescription,
  SidebarHeader,
  SidebarProvider,
  SidebarTitle,
} from '@/components/ui/sidebar';

interface IngredientsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export function IngredientsSidebar({
  isOpen,
  onClose,
  recipe,
}: IngredientsSidebarProps) {
  return (
    <SidebarProvider open={isOpen} onOpenChange={onClose}>
      <Sidebar side="right" className="flex flex-col">
        <SidebarHeader className="mt-4 flex-shrink-0 px-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-18sb text-gray-900">재료</p>
            <div className="flex items-center space-x-2">
              <p className="text-15 text-gray-600">1인분</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="min-h-0 flex-1 px-6">
          <VisuallyHidden asChild>
            <SidebarTitle>재료</SidebarTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <SidebarDescription>
              레시피에 필요한 재료와 양념류 목록을 확인할 수 있습니다.
            </SidebarDescription>
          </VisuallyHidden>
          {/* 보유 재료 */}
          <div className="mb-6">
            <IngredientsList
              ingredients={recipe?.ingredients ?? {}}
              variant="sidebar"
            />
          </div>

          {/* 양념류 */}
          <SeasoningsSection
            seasonings={recipe?.seasonings ?? []}
            variant="sidebar"
            showIcon
          />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

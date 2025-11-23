'use client';

import type { Recipe } from '@recipot/types';
import Title from '@/components/common/RecipeDetails/common/Title';
import { IngredientsList } from '@/components/common/RecipeDetails/IngredientsList';
import { SeasoningsSection } from '@/components/common/RecipeDetails/SeasoningsSection';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
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
        <SidebarContent className="min-h-0 flex-1 space-y-10 px-6 py-4">
          {/* 보유 재료 */}
          <div className="space-y-5">
            <Title title="재료">
              <p className="text-15 text-gray-600">1인분</p>
            </Title>
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

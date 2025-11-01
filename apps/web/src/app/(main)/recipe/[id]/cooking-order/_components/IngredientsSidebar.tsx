'use client';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';
import { IngredientsList } from '@/components/common/IngredientsList';
import { SeasoningsList } from '@/components/common/SeasoningsList';
import { MeasurementGuide } from '@/components/MeasurementGuide';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
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
        <SidebarHeader className="mt-4 flex-shrink-0 px-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-18sb text-gray-900">재료</p>
            <div className="flex items-center space-x-2">
              <p className="text-15 text-gray-600">1인분</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="min-h-0 flex-1 px-6">
          {/* 보유 재료 */}
          <div className="mb-6">
            <IngredientsList
              ingredients={recipe?.ingredients ?? {}}
              variant="sidebar"
            />
          </div>

          {/* 양념류 */}
          <div className="mb-6">
            <div className="mb-3">
              <span className="text-14sb text-gray-900">양념류</span>
            </div>
            <SeasoningsList
              seasonings={recipe?.seasonings ?? []}
              variant="sidebar"
              showIcon={false}
            />

            {/* 계량 가이드 */}
            <div className="mt-5">
              <MeasurementGuide />
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

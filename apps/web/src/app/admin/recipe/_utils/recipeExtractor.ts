import type { AdminRecipe } from '@recipot/api';

interface ExtractedTool {
  id: number;
  name: string;
}

/**
 * 레시피 목록에서 사용 가능한 조리도구 목록 추출
 */
export function extractAvailableTools(recipes: AdminRecipe[]): ExtractedTool[] {
  const toolsMap = new Map<number, ExtractedTool>();

  recipes.forEach(recipe => {
    recipe.tools?.forEach(tool => {
      if (!toolsMap.has(tool.id)) {
        toolsMap.set(tool.id, { id: tool.id, name: tool.name });
      }
    });
  });

  return Array.from(toolsMap.values());
}

/**
 * 레시피 목록에서 사용 가능한 양념 목록 추출
 */
export function extractAvailableSeasonings(
  recipes: AdminRecipe[]
): ExtractedTool[] {
  const seasoningsMap = new Map<number, ExtractedTool>();

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
}

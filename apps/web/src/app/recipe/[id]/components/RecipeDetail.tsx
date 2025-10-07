'use client';

import './RecipeDetail.css';

import React, { useMemo, useRef } from 'react';

import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';
import { useIntersectionScrollSpy } from '@/hooks/useIntersectionScrollSpy';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import RecipeHeader from './RecipeHeader';
import RelatedRecipes from './RelatedRecipes';
import StepSection from './StepSection';
import TabNavigation from './TabNavigation';

import type { RecipeDetailProps, TabId } from '../types/recipe.types';

const RecipeDetail = ({ recipe }: RecipeDetailProps) => {
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const cookwareRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => [ingredientsRef, cookwareRef, stepsRef],
    []
  );

  const { activeSection: activeTab, setActiveSection } =
    useIntersectionScrollSpy({
      initialState: 'ingredients', 
      rootRef: tabContainerRef,
      sectionRefs,
    });

  const handleTabClick = (tabId: TabId) => {
    setActiveSection(tabId);

    let targetRef: React.RefObject<HTMLDivElement> | null = null;

    switch (tabId) {
      case 'ingredients':
        targetRef = ingredientsRef;
        break;
      case 'cookware':
        targetRef = cookwareRef;
        break;
      case 'steps':
        targetRef = stepsRef;
        break;
    }

    if (targetRef?.current && tabContainerRef.current) {
      // 탭 컨테이너 높이를 고려한 정확한 스크롤
      const tabHeight = tabContainerRef.current.offsetHeight;
      const elementTop = targetRef.current.offsetTop - tabHeight - 20;

      window.scrollTo({
        behavior: 'smooth',
        top: Math.max(0, elementTop),
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <RecipeHeader recipe={recipe} />

      <TabNavigation
        activeTab={activeTab as TabId}
        onTabClick={handleTabClick}
        tabContainerRef={tabContainerRef}
      />

      <div className="px-4 pb-24">
        <div className="bg-secondary-light-green border-secondary-soft-green my-4 rounded-2xl border-[1px] p-5">
          <p className="recipe-description text-15sb leading-relaxed">
            {recipe.description}
          </p>
        </div>

        <IngredientsSection
          ingredients={recipe.ingredients}
          seasonings={recipe.seasonings}
          ingredientsRef={ingredientsRef}
        />

        <CookwareSection cookware={recipe.cookware} cookwareRef={cookwareRef} />

        <StepSection steps={recipe.steps} stepsRef={stepsRef} />

        <RelatedRecipes relatedRecipes={recipe.relatedRecipes} />
      </div>

      <div className="fixed right-0 bottom-0 left-0">
        <div className="flex bg-white/50 px-[50px] py-[10px]">
          <Button
            variant="default"
            size="full"
            className="bg-primary px-8 py-[15px]"
          >
            <CookIcon className="mr-[6px] h-6 w-6" color="#ffffff" />
            <p className="text-17sb text-white">요리하러 가기</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

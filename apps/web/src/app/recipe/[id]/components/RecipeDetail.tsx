'use client';

import './RecipeDetail.css';

import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/common/Button';
import { CookIcon } from '@/components/Icons';

import CookwareSection from './CookwareSection';
import IngredientsSection from './IngredientsSection';
import RecipeHeader from './RecipeHeader';
import RelatedRecipes from './RelatedRecipes';
import StepsSection from './StepsSection';
import TabNavigation from './TabNavigation';

import type { RecipeDetailProps, TabId } from '../types/recipe.types';

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const [activeTab, setActiveTab] = useState<TabId>('ingredients');

  const ingredientsRef = useRef<HTMLDivElement>(null);
  const cookwareRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);

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

  // Intersection Observer로 현재 보이는 섹션 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveTab(sectionId as TabId);
            }
          }
        });
      },
      {
        rootMargin: '-100px 0px -50% 0px', // sticky 탭 높이 고려
        threshold: 0.1,
      }
    );

    const sections = [ingredientsRef, cookwareRef, stepsRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <RecipeHeader recipe={recipe} />

      <TabNavigation
        activeTab={activeTab}
        onTabClick={handleTabClick}
        tabContainerRef={tabContainerRef}
      />

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Description */}
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

        <StepsSection steps={recipe.steps} stepsRef={stepsRef} />

        <RelatedRecipes relatedRecipes={recipe.relatedRecipes} />
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed right-0 bottom-0 left-0">
        <div className="h-4 bg-gradient-to-t from-white/50 to-transparent" />
        <div className="bg-white/50 px-4 py-4 backdrop-blur-sm">
          <Button variant="default" size="full" className="bg-primary">
            <CookIcon className="h-6 w-6" color="#ffffff" />
            <p className="text-17sb text-white">요리하러 가기</p>
          </Button>
        </div>
        <div className="h-2 bg-white/50" />
      </div>
    </div>
  );
};

export default RecipeDetail;

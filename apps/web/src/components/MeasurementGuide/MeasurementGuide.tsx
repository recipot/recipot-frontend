import React, { useEffect, useState } from 'react';
import { recipe } from '@recipot/api';

import {
  MeasurementGuideContent,
  MeasurementGuideToggle,
  MeasurementTab,
} from './index';

import type { MeasurementGuideResponse } from '@recipot/api';

interface MeasurementGuideProps {
  /** 계량 가이드 데이터 (선택사항, API에서 가져옴) */
  measurementData?: Record<
    string,
    Array<{
      standard: string;
      imageUrl: string;
      description: string;
    }>
  >;
  /** 초기 활성 탭 (선택사항) */
  initialActiveTab?: string;
  /** 컴포넌트 클래스명 (선택사항) */
  className?: string;
}

/**
 * 재활용 가능한 계량 가이드 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <MeasurementGuide />
 *
 * // 커스텀 데이터와 함께 사용
 * <MeasurementGuide
 *   measurementData={customData}
 *   initialActiveTab="cups"
 *   className="my-custom-class"
 * />
 * ```
 */
export function MeasurementGuide({
  className = '',
  initialActiveTab,
  measurementData: propMeasurementData,
}: MeasurementGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [measurementData, setMeasurementData] = useState({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const fetchMeasurementGuides = React.useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response: MeasurementGuideResponse =
        await recipe.getMeasurementGuides();
      const apiData = response.data.data;

      setMeasurementData(apiData);
      const apiCategories = Object.keys(apiData);
      setCategories(apiCategories);
      if (!activeTab && apiCategories.length > 0) {
        setActiveTab(apiCategories[0]);
      }
    } catch (err) {
      console.error('계량 가이드 데이터를 가져오는데 실패했습니다:', err);
      setError('계량 가이드 데이터를 불러올 수 없습니다.');
      // 에러 발생 시 빈 상태로 설정
      setCategories([]);
      setActiveTab(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, activeTab]);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchMeasurementGuides();
    }
  }, [isOpen, categories.length, fetchMeasurementGuides]);

  useEffect(() => {
    if (propMeasurementData) {
      setMeasurementData(propMeasurementData);
      const propCategories = Object.keys(propMeasurementData);
      setCategories(propCategories);
      // activeTab이 없거나, 현재 activeTab이 새로운 카테고리 목록에 없는 경우 업데이트
      if (!activeTab || (activeTab && !propCategories.includes(activeTab))) {
        if (propCategories.length > 0) {
          setActiveTab(propCategories[0]);
        }
      }
    }
  }, [propMeasurementData, activeTab]);

  // initialActiveTab이 prop으로 전달되면 사용
  useEffect(() => {
    if (initialActiveTab && !activeTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab, activeTab]);

  return (
    <div className={className}>
      <MeasurementGuideToggle isOpen={isOpen} onToggle={handleToggle}>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-gray-500">계량 가이드를 불러오는 중...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <>
              <MeasurementTab
                activeTab={activeTab}
                onTabChange={handleTabChange}
                categories={categories}
              />
              <MeasurementGuideContent
                activeTab={activeTab}
                measurementData={measurementData}
              />
            </>
          )}
        </div>
      </MeasurementGuideToggle>
    </div>
  );
}

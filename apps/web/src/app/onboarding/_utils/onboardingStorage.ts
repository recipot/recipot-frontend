interface OnboardingStepData {
  timestamp: number;
}

interface Step1Data extends OnboardingStepData {
  allergies: number[];
}

interface Step2Data extends OnboardingStepData {
  mood: string;
}

interface Step3Data extends OnboardingStepData {
  selectedFoods: number[];
}

interface OnboardingData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  sessionId: string;
  version: string;
  createdAt: number;
}

export interface CompleteOnboardingData {
  allergies: number[];
  mood: string;
  selectedFoods: number[];
  sessionId: string;
}

class OnboardingStorage {
  private readonly STORAGE_KEY = 'recipot_onboarding_data';
  private readonly SESSION_KEY = 'recipot_onboarding_session';
  private readonly VERSION = '1.0.0';

  /**
   * 스텝 데이터 저장 (localStorage)
   */
  saveStepData(
    step: 1 | 2 | 3,
    data: Omit<Step1Data | Step2Data | Step3Data, 'timestamp'>
  ): void {
    try {
      const existingData = this.getAllData() ?? this.createEmptyData();

      const stepData = {
        ...data,
        timestamp: Date.now(),
      };

      existingData[`step${step}`] = stepData as any;

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
      console.info(`✅ Step ${step} 데이터가 로컬에 저장되었습니다.`, stepData);
    } catch (error) {
      console.error(`❌ Step ${step} 데이터 저장 실패:`, error);
      throw new Error(`Step ${step} 데이터 저장에 실패했습니다.`);
    }
  }

  /**
   * 모든 온보딩 데이터 조회
   */
  getAllData(): OnboardingData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;

      const parsedData = JSON.parse(data) as OnboardingData;

      // 버전 호환성 체크
      if (parsedData.version !== this.VERSION) {
        console.warn(
          '⚠️ 온보딩 데이터 버전이 다릅니다. 데이터를 초기화합니다.'
        );
        this.clearData();
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error('❌ 온보딩 데이터 조회 실패:', error);
      this.clearData(); // 손상된 데이터 정리
      return null;
    }
  }

  /**
   * 특정 스텝 데이터 조회
   */
  getStepData(step: 1): Step1Data | null;
  getStepData(step: 2): Step2Data | null;
  getStepData(step: 3): Step3Data | null;
  getStepData(step: 1 | 2 | 3): Step1Data | Step2Data | Step3Data | null {
    const allData = this.getAllData();
    return allData?.[`step${step}`] ?? null;
  }

  /**
   * 온보딩 완료 여부 확인
   */
  isOnboardingComplete(): boolean {
    const data = this.getAllData();
    return !!(data?.step1 && data?.step2 && data?.step3);
  }

  /**
   * 통합 온보딩 데이터 생성 (최종 API 전송용)
   */
  getCompleteOnboardingData(): CompleteOnboardingData | null {
    const data = this.getAllData();

    if (!data?.step1 || !data?.step2 || !data?.step3) {
      console.warn('⚠️ 온보딩 데이터가 불완전합니다.', {
        step1: !!data?.step1,
        step2: !!data?.step2,
        step3: !!data?.step3,
      });
      return null;
    }

    return {
      allergies: data.step1.allergies,
      mood: data.step2.mood,
      selectedFoods: data.step3.selectedFoods,
      sessionId: data.sessionId,
    };
  }

  /**
   * 진행 상황 복구 정보
   */
  restoreProgress(): {
    currentStep: number;
    hasData: boolean;
    completedSteps: number[];
  } {
    const data = this.getAllData();

    if (!data || !this.isDataValid()) {
      return { completedSteps: [], currentStep: 1, hasData: false };
    }

    // 완료된 스텝들 찾기
    const completedSteps: number[] = [];
    let lastCompletedStep = 0;

    if (data.step1) {
      completedSteps.push(1);
      lastCompletedStep = 1;
    }
    if (data.step2) {
      completedSteps.push(2);
      lastCompletedStep = 2;
    }
    if (data.step3) {
      completedSteps.push(3);
      lastCompletedStep = 3;
    }

    return {
      completedSteps,
      currentStep: lastCompletedStep === 3 ? 3 : lastCompletedStep + 1,
      hasData: completedSteps.length > 0,
    };
  }

  /**
   * 데이터 유효성 검증
   */
  isDataValid(): boolean {
    const data = this.getAllData();
    if (!data) return false;

    // 7일 만료 체크
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const createdAt = data.createdAt || 0;

    if (Date.now() - createdAt > SEVEN_DAYS) {
      console.info('📅 온보딩 데이터가 만료되었습니다. (7일 경과)');
      return false;
    }

    return true;
  }

  /**
   * 모든 데이터 정리
   */
  clearData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      console.info('🧹 온보딩 데이터가 정리되었습니다.');
    } catch (error) {
      console.error('❌ 데이터 정리 실패:', error);
    }
  }

  /**
   * 빈 데이터 구조 생성
   */
  private createEmptyData(): OnboardingData {
    return {
      createdAt: Date.now(),
      sessionId: this.generateSessionId(),
      version: this.VERSION,
    };
  }

  /**
   * 세션 ID 생성
   */
  private generateSessionId(): string {
    return `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 디버깅용 데이터 출력
   */
  debugInfo(): void {
    const data = this.getAllData();
    console.group('🔍 OnboardingStorage Debug Info');
    console.log('전체 데이터:', data);
    console.log('완료 여부:', this.isOnboardingComplete());
    console.log('유효성:', this.isDataValid());
    console.log('진행 상황:', this.restoreProgress());
    console.groupEnd();
  }
}

// 싱글톤 인스턴스 export
export const onboardingStorage = new OnboardingStorage();

// 타입들도 export
export type { OnboardingData, Step1Data, Step2Data, Step3Data };

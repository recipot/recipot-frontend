import { createApiInstance } from './createApiInstance';

const healthSurveyApi = createApiInstance({ apiName: 'HealthSurvey' });

export interface HealthSurveyPreparationOption {
  code: string;
  codeName: string;
}

export interface HealthSurveyPreparationResponse {
  persistentIssueOption: HealthSurveyPreparationOption[];
  effectOptions: HealthSurveyPreparationOption[];
}

export interface HealthSurveyEligibilityResponse {
  isEligible: boolean;
  recentCompletionCount: number;
}

export interface HealthSurveyRequest {
  persistentIssueCode: string;
  effectCodes: string[];
  additionalNote: string;
}

export interface HealthSurveySubmitResponse {
  status: number;
  data: {
    surveyId: number;
  };
}

export const healthSurvey = {
  getEligibility: async (): Promise<HealthSurveyEligibilityResponse> => {
    const response = await healthSurveyApi.get(`/v1/health-survey/eligibility`);
    const data = response.data?.data ?? response.data;
    return {
      isEligible: data?.isEligible ?? false,
      recentCompletionCount: data?.recentCompletionCount ?? 0,
    };
  },

  getPreparation: async (): Promise<HealthSurveyPreparationResponse> => {
    const response = await healthSurveyApi.get(`/v1/health-survey/preparation`);
    return response.data?.data ?? response.data;
  },

  submit: async (
    payload: HealthSurveyRequest
  ): Promise<HealthSurveySubmitResponse> => {
    const response = await healthSurveyApi.post(`/v1/health-survey`, payload);
    return response.data;
  },
};

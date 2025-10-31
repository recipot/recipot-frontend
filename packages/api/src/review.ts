import { createApiInstance } from './createApiInstance';

const reviewReminderApi = createApiInstance({
  apiName: 'ReviewReminder',
  baseURL: '',
});

export interface PendingReviewItem {
  completedRecipeIds: number[];
  totalCount: number;
}

export interface PendingReviewsResponse {
  status: number;
  data: PendingReviewItem;
}

export const reviewReminder = {
  getPendingReviews: async (): Promise<PendingReviewsResponse> => {
    const response = await reviewReminderApi.get(`/v1/users/pending-reviews`);
    return response.data;
  },
};

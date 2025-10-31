import { createApiInstance } from './createApiInstance';

const reviewReminderApi = createApiInstance({
  apiName: 'ReviewReminder',
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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

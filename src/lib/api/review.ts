// services/reviewService.ts
import apiClient from "./apiHelper";

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  // other review fields
}

interface CreateReviewParams {
  productId: string;
  rating: number;
  comment: string;
}

interface UpdateReviewParams {
  rating?: number;
  comment?: string;
}

export const ReviewService = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    return apiClient.get(`/reviews/product/${productId}`);
  },

  getUserReviews: async (): Promise<Review[]> => {
    return apiClient.get("/reviews/user");
  },

  createReview: async (data: CreateReviewParams): Promise<Review> => {
    return apiClient.post("/reviews", data);
  },

  updateReview: async (id: string, data: UpdateReviewParams): Promise<Review> => {
    return apiClient.put(`/reviews/${id}`, data);
  },

  deleteReview: async (id: string): Promise<void> => {
    return apiClient.delete(`/reviews/${id}`);
  },
};

export type { Review, CreateReviewParams, UpdateReviewParams };

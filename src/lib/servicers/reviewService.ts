import { ReviewService, UpdateReviewParams } from "../api/review";

// Get product reviews
const getProductReviews = async (productId: string) => {
  try {
    const reviews = await ReviewService.getProductReviews(productId);
    console.log('Product reviews:', reviews);
  } catch (error) {
    console.error('Product reviews error:', error);
  }
};

// Get user reviews
const getUserReviews = async () => {
  try {
    const reviews = await ReviewService.getUserReviews();
    console.log('User reviews:', reviews);
  } catch (error) {
    console.error('User reviews error:', error);
  }
};

// Create review
const createProductReview = async () => {
  try {
    const newReview = await ReviewService.createReview({
      productId: 'prod123',
      rating: 5,
      comment: 'Excellent product quality!'
    });
    console.log('Review created:', newReview);
  } catch (error) {
    console.error('Review creation error:', error);
  }
};

// Update review
const updateReview = async (reviewId: string, data: UpdateReviewParams) => {
  try {
    const updatedReview = await ReviewService.updateReview(reviewId, data);
    console.log('Review updated:', updatedReview);
  } catch (error) {
    console.error('Review update error:', error);
  }
};

// Delete review
const deleteReview = async (reviewId: string) => {
  try {
    await ReviewService.deleteReview(reviewId);
    console.log('Review deleted successfully');
  } catch (error) {
    console.error('Review deletion error:', error);
  }
};

export { createProductReview, updateReview, getProductReviews, getUserReviews, deleteReview };
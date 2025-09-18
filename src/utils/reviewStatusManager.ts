// Review approval status manager - localStorage persistence for review approvals
const STORAGE_KEY = 'approved-reviews';

export const reviewStatusManager = {
  getApprovedReviews: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  approveReview: (reviewId: string): void => {
    try {
      const approved = reviewStatusManager.getApprovedReviews();
      if (!approved.includes(reviewId)) {
        approved.push(reviewId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(approved));
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  },

  rejectReview: (reviewId: string): void => {
    try {
      const approved = reviewStatusManager.getApprovedReviews();
      const updated = approved.filter(id => id !== reviewId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  },

  isApproved: (reviewId: string): boolean => {
    return reviewStatusManager.getApprovedReviews().includes(reviewId);
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear approvals:', error);
    }
  }
};

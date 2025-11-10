export type FilterStrategy = 'per-user' | 'per-user-per-product';

export function filterUniqueUserFeedbacks<T extends { 
  user_ID?: number | null; 
  product_item_ID?: number | null;
  feedback_date?: Date | string | null 
}>(
  feedbacks: T[],
  strategy: FilterStrategy = 'per-user-per-product'
): T[] {
  if (strategy === 'per-user') {
    // One feedback per user (latest)
    const userLatestFeedback = new Map<number, T>();

    for (const fb of feedbacks) {
      const userId = fb.user_ID;
      
      if (userId !== null && userId !== undefined) {
        const existingFeedback = userLatestFeedback.get(userId);
        
        if (!existingFeedback) {
          userLatestFeedback.set(userId, fb);
        } else {
          const currentDate = fb.feedback_date ? new Date(fb.feedback_date) : new Date(0);
          const existingDate = existingFeedback.feedback_date ? new Date(existingFeedback.feedback_date) : new Date(0);
          
          if (currentDate > existingDate) {
            userLatestFeedback.set(userId, fb);
          }
        }
      }
    }

    return Array.from(userLatestFeedback.values());
  } else {
    // the default: per-user-per-product (current behavior)
    const seen = new Map<string, T>();

    for (const fb of feedbacks) {
      const userId = fb.user_ID ?? 0;
      const productId = fb.product_item_ID ?? 0;
      const key = `${userId}_${productId}`; 

      if (!seen.has(key)) {
        seen.set(key, fb);
      }
    }

    return Array.from(seen.values());
  }
}
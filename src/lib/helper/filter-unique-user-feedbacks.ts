export function filterUniqueUserFeedbacks<T extends { user_ID?: number | null }>(feedbacks: T[]): T[] {
    const seen = new Map<number, T>();
  
    for (const fb of feedbacks) {
      const userId = fb.user_ID ?? 0; 
      if (!seen.has(userId)) {
        seen.set(userId, fb); 
      }
    }
  
    return Array.from(seen.values());
  }
  
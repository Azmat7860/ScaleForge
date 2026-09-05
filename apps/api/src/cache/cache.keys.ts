export const CACHE_KEYS = {
  userProfile: (userId: string): string => `user:profile:${userId}`
} as const;

const usageCache = new Map<string, { totalUsed: number; timestamp: number }>();

export function getCachedUsage(userId: string) {
  const cached = usageCache.get(userId);
  if (!cached) return null;

  const now = Date.now();
  const threeHoursInMs = 1000 * 60 * 60 * 3;

  // If the cache is older than a day or past reset time, invalidate
  if (now - cached.timestamp > 1000 * 60 * 60 * 24) {
    usageCache.delete(userId);
    return null;
  }

  return cached;
}

export function setCachedUsage(userId: string, totalUsed: number) {
  usageCache.set(userId, {
    totalUsed,
    timestamp: Date.now(),
  });
}

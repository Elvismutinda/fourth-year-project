const usageCache = new Map<string, { totalUsed: number; timestamp: number }>();

export function getCachedUsage(userId: string, role: "USER" | "PREMIUM") {
  const cached = usageCache.get(userId);
  if (!cached) return null;

  const now = Date.now();
  const oneDay = 1000 * 60 * 60 * 24;
  const thirtyOneDays = 1000 * 60 * 60 * 24 * 31;

  const maxAge = role === "PREMIUM" ? thirtyOneDays : oneDay;

  if (now - cached.timestamp > maxAge) {
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

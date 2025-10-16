const recentByUser = new Map<number, { id: number; at: number }>();

export function setRecentContract(userId: number, contractId: number) {
  recentByUser.set(userId, { id: contractId, at: Date.now() });
}

export function getRecentContract(
  userId: number,
  ttlMs = 5 * 60 * 1000
): number | null {
  const v = recentByUser.get(userId);
  if (!v) return null;
  if (Date.now() - v.at > ttlMs) return null;
  return v.id;
}

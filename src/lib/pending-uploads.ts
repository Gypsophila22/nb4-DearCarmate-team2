// src/lib/pending-uploads.ts
type PendingDoc = { id: number; at: number };
const pendingByUser = new Map<number, PendingDoc[]>();

export function addPendingUpload(userId: number, docId: number) {
  const list = pendingByUser.get(userId) ?? [];
  list.push({ id: docId, at: Date.now() });
  pendingByUser.set(userId, list);
}
export function takeRecentPendingUploads(
  userId: number,
  ttlMs = 2 * 60 * 1000
): number[] {
  const now = Date.now();
  const list = pendingByUser.get(userId) ?? [];
  const fresh = list.filter((d) => now - d.at <= ttlMs);
  const stale = list.filter((d) => now - d.at > ttlMs);
  pendingByUser.set(userId, stale);
  return fresh.map((d) => d.id);
}

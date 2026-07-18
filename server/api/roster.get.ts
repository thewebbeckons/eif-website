import type { RosterResponse } from "../../shared/types/roster";
import type { CachedRosterSnapshot } from "../utils/roster-cache";

async function persistBuiltRosterSnapshot(
  snapshot: CachedRosterSnapshot,
): Promise<void> {
  try {
    await Promise.all([
      setCachedRosterSnapshot(snapshot),
      setRosterRefreshStatus({
        lastAttemptAt: snapshot.generatedAt,
        lastSuccessAt: snapshot.generatedAt,
        lastFailureAt: null,
        lastFailureMessage: null,
      }),
    ]);
  } catch (error) {
    logWorkerError("roster.cache.seed_failed", error);
  }
}

async function buildAndCacheRosterSnapshot(): Promise<CachedRosterSnapshot> {
  const snapshot = await buildRosterSnapshot();
  await persistBuiltRosterSnapshot(snapshot);
  return snapshot;
}

export default defineEventHandler(async (): Promise<RosterResponse> => {
  try {
    const cachedSnapshot = await getCachedRosterSnapshot();
    if (cachedSnapshot) {
      return cachedSnapshot.data;
    }
  } catch (error) {
    logWorkerError("roster.cache.read_failed", error);
  }

  try {
    const snapshot = await buildAndCacheRosterSnapshot();
    return snapshot.data;
  } catch (error) {
    logWorkerError("roster.snapshot.build_failed", error);

    throw createError({
      statusCode: 503,
      statusMessage: "Roster unavailable",
    });
  }
});

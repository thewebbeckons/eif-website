import type { RosterResponse } from "../../shared/types/roster";
import type { CachedRosterSnapshot } from "../utils/roster-cache";

const CACHE_BUILD_WAIT_ATTEMPTS = 8;
const CACHE_BUILD_WAIT_MS = 500;

async function persistBuiltRosterSnapshot(
  snapshot: CachedRosterSnapshot,
): Promise<void> {
  try {
    await setCachedRosterSnapshot(snapshot);
  } catch (error) {
    logWorkerError("roster.cache.seed_failed", error);
  }
}

async function buildAndCacheRosterSnapshot(): Promise<CachedRosterSnapshot> {
  const snapshot = await buildRosterSnapshot();
  await persistBuiltRosterSnapshot(snapshot);
  return snapshot;
}

async function waitForConcurrentRosterBuild(): Promise<CachedRosterSnapshot | null> {
  for (let attempt = 0; attempt < CACHE_BUILD_WAIT_ATTEMPTS; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, CACHE_BUILD_WAIT_MS));

    try {
      const snapshot = await getCachedRosterSnapshot();
      if (snapshot) return snapshot;
    } catch (error) {
      logWorkerError("roster.cache.concurrent_read_failed", error, { attempt });
    }
  }

  return null;
}

export default defineEventHandler(async (event): Promise<RosterResponse> => {
  try {
    const cachedSnapshot = await getCachedRosterSnapshot();
    if (cachedSnapshot) {
      return cachedSnapshot.data;
    }
  } catch (error) {
    logWorkerError("roster.cache.read_failed", error);
  }

  try {
    const environment = getCloudflareEnvironment(event);
    const buildLimiter = getRateLimitBinding(
      environment,
      "ROSTER_BUILD_RATE_LIMITER",
    );

    if (buildLimiter) {
      const { success: canBuild } = await buildLimiter.limit({
        key: "roster-snapshot",
      });

      if (!canBuild) {
        const concurrentSnapshot = await waitForConcurrentRosterBuild();
        if (concurrentSnapshot) return concurrentSnapshot.data;

        throw new Error("Concurrent roster build did not populate the cache.");
      }
    }

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

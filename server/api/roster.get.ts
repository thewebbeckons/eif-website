import type { H3Event } from "h3";

import type { RosterResponse } from "../../shared/types/roster";
import type { RequestCoordinator } from "../durable-objects/request-coordinator";
import type { CachedRosterSnapshot } from "../utils/roster-cache";

const CACHE_BUILD_WAIT_ATTEMPTS = 8;
const CACHE_BUILD_WAIT_MS = 500;
const ROSTER_BUILD_LEASE_MS = 5 * 60 * 1_000;

let inFlightRosterBuild: Promise<CachedRosterSnapshot> | null = null;

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

function buildRosterSnapshotSingleFlight(): Promise<CachedRosterSnapshot> {
  if (!inFlightRosterBuild) {
    const build = buildAndCacheRosterSnapshot();
    const trackedBuild = build.finally(() => {
      if (inFlightRosterBuild === trackedBuild) inFlightRosterBuild = null;
    });
    inFlightRosterBuild = trackedBuild;
  }

  return inFlightRosterBuild;
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

async function releaseRosterBuild(
  coordinator: DurableObjectStub<RequestCoordinator>,
  ownerToken: string,
): Promise<void> {
  try {
    await coordinator.releaseRosterBuild(ownerToken);
  } catch (error) {
    logWorkerError("roster.build_lease.release_failed", error);
  }
}

async function buildWithDistributedCoordination(
  event: H3Event,
): Promise<CachedRosterSnapshot> {
  const environment = getCloudflareEnvironment(event);
  const coordinatorNamespace = getRequestCoordinatorNamespace(environment);

  if (!coordinatorNamespace) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("REQUEST_COORDINATOR binding is unavailable.");
    }

    return buildRosterSnapshotSingleFlight();
  }

  const coordinator = coordinatorNamespace.getByName("roster-snapshot");
  const ownerToken = crypto.randomUUID();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const acquired = await coordinator.tryAcquireRosterBuild(
      ownerToken,
      Date.now(),
      ROSTER_BUILD_LEASE_MS,
    );

    if (acquired) {
      try {
        return await buildRosterSnapshotSingleFlight();
      } finally {
        await releaseRosterBuild(coordinator, ownerToken);
      }
    }

    const concurrentSnapshot = await waitForConcurrentRosterBuild();
    if (concurrentSnapshot) return concurrentSnapshot;
  }

  throw new Error("Concurrent roster build did not populate the cache.");
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
    const snapshot = await buildWithDistributedCoordination(event);
    return snapshot.data;
  } catch (error) {
    logWorkerError("roster.snapshot.build_failed", error);

    throw createError({
      statusCode: 503,
      statusMessage: "Roster unavailable",
    });
  }
});

import type { RosterResponse } from "../../shared/types/roster";
import type { CachedRosterSnapshot } from "../utils/roster-cache";

const ROSTER_BUILD_LOCK_KEY = "roster:snapshot:build";
const ROSTER_BUILD_LOCK_TTL_MS = 20_000;

let inFlightRosterSnapshotBuild:
  | {
      key: string;
      startedAt: number;
      promise: Promise<CachedRosterSnapshot>;
    }
  | null = null;

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
    console.error("Failed to seed cached roster snapshot", error);
  }
}

async function getOrCreateRosterSnapshotBuild(): Promise<CachedRosterSnapshot> {
  const now = Date.now();

  if (
    inFlightRosterSnapshotBuild &&
    inFlightRosterSnapshotBuild.key === ROSTER_BUILD_LOCK_KEY &&
    now - inFlightRosterSnapshotBuild.startedAt < ROSTER_BUILD_LOCK_TTL_MS
  ) {
    return inFlightRosterSnapshotBuild.promise;
  }

  const promise = (async () => {
    const snapshot = await buildRosterSnapshot();
    await persistBuiltRosterSnapshot(snapshot);
    return snapshot;
  })();

  inFlightRosterSnapshotBuild = {
    key: ROSTER_BUILD_LOCK_KEY,
    startedAt: now,
    promise,
  };

  try {
    return await promise;
  } finally {
    if (inFlightRosterSnapshotBuild?.promise === promise) {
      inFlightRosterSnapshotBuild = null;
    }
  }
}

export default defineEventHandler(async (): Promise<RosterResponse> => {
  try {
    const cachedSnapshot = await getCachedRosterSnapshot();
    if (cachedSnapshot) {
      return cachedSnapshot.data;
    }
  } catch (error) {
    console.error("Failed to read cached roster snapshot", error);
  }

  try {
    const snapshot = await getOrCreateRosterSnapshotBuild();
    return snapshot.data;
  } catch (error) {
    console.error("Failed to build roster snapshot", error);

    throw createError({
      statusCode: 503,
      statusMessage: "Roster unavailable",
    });
  }
});

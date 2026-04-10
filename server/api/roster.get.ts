import type { RosterResponse } from "../../shared/types/roster";

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
    const snapshot = await buildRosterSnapshot();

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

    return snapshot.data;
  } catch (error) {
    console.error("Failed to build roster snapshot", error);

    throw createError({
      statusCode: 503,
      statusMessage: "Roster unavailable",
    });
  }
});

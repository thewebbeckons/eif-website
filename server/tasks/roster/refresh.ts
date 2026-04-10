import { defineTask } from "nitropack/runtime";

import type { RosterRefreshStatus } from "../../utils/roster-cache";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

const persistRosterRefreshStatus = async (
  statusUpdate: Partial<RosterRefreshStatus>,
) => {
  try {
    await setRosterRefreshStatus(statusUpdate);
  } catch (error) {
    console.error("Failed to persist roster refresh status", error);
  }
};

export default defineTask({
  meta: {
    description: "Refresh Raider.IO roster data into NuxtHub KV.",
  },
  async run() {
    const attemptedAt = new Date().toISOString();

    await persistRosterRefreshStatus({
      lastAttemptAt: attemptedAt,
    });

    try {
      const snapshot = await buildRosterSnapshot();
      await setCachedRosterSnapshot(snapshot);
      await persistRosterRefreshStatus({
        lastAttemptAt: attemptedAt,
        lastSuccessAt: snapshot.generatedAt,
        lastFailureAt: null,
        lastFailureMessage: null,
      });

      return {
        result: {
          generatedAt: snapshot.generatedAt,
          playerCount: snapshot.data.players.length,
        },
      };
    } catch (error) {
      const failedAt = new Date().toISOString();

      await persistRosterRefreshStatus({
        lastAttemptAt: attemptedAt,
        lastFailureAt: failedAt,
        lastFailureMessage: getErrorMessage(error),
      });

      console.error("Roster refresh task failed", error);
      throw error;
    }
  },
});

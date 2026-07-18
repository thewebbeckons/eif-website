import { defineTask } from "nitropack/runtime";

import type { RosterRefreshStatus } from "../../utils/roster-cache";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const persistRosterRefreshStatus = async (
  statusUpdate: Partial<RosterRefreshStatus>,
) => {
  try {
    await setRosterRefreshStatus(statusUpdate);
  } catch (error) {
    logWorkerError("roster.refresh.status_write_failed", error);
  }
};

export default defineTask({
  meta: {
    description: "Refresh Raider.IO roster data into NuxtHub KV.",
  },
  async run() {
    const attemptedAt = new Date().toISOString();
    const startedAt = Date.now();

    logWorkerInfo("roster.refresh.started", { attemptedAt });

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

      const failedPlayerCount = snapshot.data.players.filter(
        (player) => player.lookup_status === "lookup_failed",
      ).length;

      logWorkerInfo("roster.refresh.succeeded", {
        attemptedAt,
        durationMs: Date.now() - startedAt,
        generatedAt: snapshot.generatedAt,
        playerCount: snapshot.data.players.length,
        failedPlayerCount,
      });

      return {
        result: {
          generatedAt: snapshot.generatedAt,
          playerCount: snapshot.data.players.length,
          failedPlayerCount,
        },
      };
    } catch (error) {
      const failedAt = new Date().toISOString();

      await persistRosterRefreshStatus({
        lastAttemptAt: attemptedAt,
        lastFailureAt: failedAt,
        lastFailureMessage: getErrorMessage(error),
      });

      logWorkerError("roster.refresh.failed", error, {
        attemptedAt,
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  },
});

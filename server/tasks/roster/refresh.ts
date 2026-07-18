import { defineTask } from "nitropack/runtime";

export default defineTask({
  meta: {
    description: "Refresh Raider.IO roster data into NuxtHub KV.",
  },
  async run() {
    const attemptedAt = new Date().toISOString();
    const startedAt = Date.now();

    logWorkerInfo("roster.refresh.started", { attemptedAt });

    try {
      const snapshot = await buildRosterSnapshot();
      await setCachedRosterSnapshot(snapshot);

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
      logWorkerError("roster.refresh.failed", error, {
        attemptedAt,
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  },
});

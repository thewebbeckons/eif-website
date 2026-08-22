import type { RosterResponse } from "../../shared/types/roster";

export default defineCachedEventHandler(
  async (): Promise<RosterResponse> => {
    try {
      return await buildRosterSnapshot();
    } catch (error) {
      console.error("Failed to build roster snapshot", error);

      throw createError({
        statusCode: 503,
        statusMessage: "Roster unavailable",
      });
    }
  },
  {
    name: "roster",
    getKey: () => "roster",
    maxAge: 60 * 10,
    swr: true,
  },
);

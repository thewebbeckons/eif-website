import type { Team } from "../../../../shared/types/members";

export default defineEventHandler(async (event): Promise<Team> => {
  const { user, db } = await requireUser(event);
  return loadTeam(db, user.id, requireParam(event, "id"));
});

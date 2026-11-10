import type { TeamListResponse } from "../../../shared/types/members";

export default defineEventHandler(async (event): Promise<TeamListResponse> => {
  const { user, db } = await requireUser(event);
  const isMember =
    "t.id IN (SELECT team_id FROM team_members WHERE user_id = ?)";
  const isInvited =
    "t.id IN (SELECT team_id FROM team_joins WHERE user_id = ? AND kind = 'invite')";

  const [mine, invited, recruiting] = await Promise.all([
    loadTeams(db, user.id, isMember, [user.id]),
    loadTeams(db, user.id, isInvited, [user.id]),
    loadTeams(
      db,
      user.id,
      `t.recruiting = 1 AND NOT ${isMember} AND NOT ${isInvited}`,
      [user.id, user.id],
    ),
  ]);

  return { mine, invited, recruiting };
});

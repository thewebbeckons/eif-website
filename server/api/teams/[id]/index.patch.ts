import type { Team } from "../../../../shared/types/members";

export default defineEventHandler(async (event): Promise<Team> => {
  const { user, db } = await requireUser(event);
  const team = await loadOwnedTeam(db, user.id, requireParam(event, "id"));
  const body = await parseBody(event, teamInputSchema);

  await db
    .prepare(
      `UPDATE teams SET name = ?, description = ?, timezone = ?, schedule = ?,
         recruiting = ?, need_tank = ?, need_healer = ?, need_dps = ?,
         recruitment_note = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      body.name,
      body.description,
      body.timezone,
      JSON.stringify(body.schedule),
      body.recruiting ? 1 : 0,
      body.needs.tank,
      body.needs.healer,
      body.needs.dps,
      body.recruitmentNote,
      new Date().toISOString(),
      team.id,
    )
    .run();

  return loadTeam(db, user.id, team.id);
});

export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const team = await loadOwnedTeam(db, user.id, requireParam(event, "id"));

  // Members and pending joins go with it (ON DELETE CASCADE).
  await db.prepare("DELETE FROM teams WHERE id = ?").bind(team.id).run();
  return { ok: true };
});

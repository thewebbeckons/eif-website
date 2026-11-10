export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);

  const deleted = await db
    .prepare("DELETE FROM characters WHERE id = ? AND user_id = ?")
    .bind(requireParam(event, "id"), user.id)
    .run();
  if (!deleted.meta.changes) throw fail(404, "Character not found.");

  await invalidateRosterCache();
  return { ok: true };
});

// Removes a member: the owner can remove anyone else, and members can leave.
export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const team = await loadTeam(db, user.id, requireParam(event, "id"));
  const targetId = requireParam(event, "userId");

  if (targetId !== user.id && !team.viewer.isOwner) {
    throw fail(403, "Only the team owner can remove other members.");
  }
  if (targetId === team.ownerId) {
    throw fail(400, "The owner cannot leave the team. Delete the team instead.");
  }

  const removed = await db
    .prepare("DELETE FROM team_members WHERE team_id = ? AND user_id = ?")
    .bind(team.id, targetId)
    .run();
  if (!removed.meta.changes) throw fail(404, "They are not on this team.");

  return { ok: true };
});

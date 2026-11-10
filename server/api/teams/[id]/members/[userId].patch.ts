// Lets a member change the role and character they bring to the team.
export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const teamId = requireParam(event, "id");
  if (requireParam(event, "userId") !== user.id) {
    throw fail(403, "You can only change your own spot on a team.");
  }
  const body = await parseBody(event, joinDetailsSchema);
  const characterId = await assertOwnCharacter(db, user.id, body.characterId);

  const updated = await db
    .prepare(
      "UPDATE team_members SET role = ?, character_id = ? WHERE team_id = ? AND user_id = ?",
    )
    .bind(body.role, characterId, teamId, user.id)
    .run();
  if (!updated.meta.changes) throw fail(404, "You are not on this team.");

  return { ok: true };
});

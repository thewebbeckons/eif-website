import { z } from "zod";

const schema = z.object({ userId: z.string().min(1) });

export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const team = await loadOwnedTeam(db, user.id, requireParam(event, "id"));
  const { userId } = await parseBody(event, schema);

  if (team.members.some((member) => member.userId === userId)) {
    throw fail(409, "They are already on the team.");
  }
  if (team.joins?.some((join) => join.userId === userId)) {
    throw fail(409, "They already have a pending invite or request.");
  }
  const invitee = await db
    .prepare("SELECT id FROM users WHERE id = ?")
    .bind(userId)
    .first();
  if (!invitee) throw fail(404, "That member could not be found.");

  await db
    .prepare(
      `INSERT INTO team_joins (team_id, user_id, kind, created_at)
       VALUES (?, ?, 'invite', ?) ON CONFLICT DO NOTHING`,
    )
    .bind(team.id, userId, new Date().toISOString())
    .run();

  return { ok: true };
});

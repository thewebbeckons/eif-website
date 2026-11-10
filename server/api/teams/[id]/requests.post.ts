import { z } from "zod";

const schema = joinDetailsSchema.extend({
  message: z.string().trim().max(300).default(""),
});

export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const team = await loadTeam(db, user.id, requireParam(event, "id"));
  const body = await parseBody(event, schema);

  if (team.viewer.isMember) throw fail(409, "You are already on this team.");
  if (team.viewer.pending === "invite") {
    throw fail(409, "You already have an invite to this team. Accept it instead.");
  }
  if (team.viewer.pending === "request") {
    throw fail(409, "You have already asked to join this team.");
  }
  if (!team.recruiting) throw fail(409, "This team is not recruiting right now.");

  const characterId = await assertOwnCharacter(db, user.id, body.characterId);
  await db
    .prepare(
      `INSERT INTO team_joins (team_id, user_id, kind, role, character_id, message, created_at)
       VALUES (?, ?, 'request', ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
    )
    .bind(
      team.id,
      user.id,
      body.role,
      characterId,
      body.message,
      new Date().toISOString(),
    )
    .run();

  return { ok: true };
});

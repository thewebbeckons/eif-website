import { z } from "zod";

import type { TeamRole } from "../../../../../shared/types/members";

const schema = z.object({
  action: z.enum(["accept", "decline"]),
  // Required when accepting an invite; a request already carries them.
  role: roleSchema.optional(),
  characterId: z.string().nullish(),
});

interface JoinRecord {
  kind: "invite" | "request";
  role: TeamRole | null;
  character_id: string | null;
}

// Resolves a pending invite or request. Owners answer requests and can
// withdraw invites; the invited or requesting member answers for themself.
export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const team = await loadTeam(db, user.id, requireParam(event, "id"));
  const targetId = requireParam(event, "userId");
  const body = await parseBody(event, schema);
  const isSelf = targetId === user.id;

  if (!isSelf && !team.viewer.isOwner) {
    throw fail(403, "Only the team owner can do that.");
  }
  const join = await db
    .prepare(
      "SELECT kind, role, character_id FROM team_joins WHERE team_id = ? AND user_id = ?",
    )
    .bind(team.id, targetId)
    .first<JoinRecord>();
  if (!join) throw fail(404, "That invite or request is no longer pending.");

  const removeJoin = db
    .prepare("DELETE FROM team_joins WHERE team_id = ? AND user_id = ?")
    .bind(team.id, targetId);

  if (body.action === "decline") {
    await removeJoin.run();
    return { ok: true };
  }

  // Accepting is done by whoever was asked: the owner for a request, the
  // invited member for an invite.
  let role = join.role;
  let characterId = join.character_id;
  if (join.kind === "request") {
    if (!team.viewer.isOwner) {
      throw fail(403, "Only the team owner can accept a request.");
    }
  } else {
    if (!isSelf) throw fail(403, "Only the invited member can accept an invite.");
    if (!body.role) throw fail(400, "Pick a role: tank, healer or DPS.");
    role = body.role;
    characterId = await assertOwnCharacter(db, user.id, body.characterId);
  }
  if (!role) throw fail(400, "Pick a role: tank, healer or DPS.");
  if (team.members.length >= MAX_TEAM_MEMBERS) {
    throw fail(409, `This team is full (${MAX_TEAM_MEMBERS} members).`);
  }

  // Filling a spot lowers the matching need, and closes recruitment once
  // every advertised spot is taken.
  const needs = { ...team.needs, [role]: Math.max(team.needs[role] - 1, 0) };
  const stillRecruiting =
    team.recruiting && needs.tank + needs.healer + needs.dps > 0;
  const now = new Date().toISOString();

  await db.batch([
    db
      .prepare(
        "INSERT INTO team_members (team_id, user_id, character_id, role, joined_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(team.id, targetId, characterId, role, now),
    removeJoin,
    db
      .prepare(
        `UPDATE teams SET need_tank = ?, need_healer = ?, need_dps = ?,
           recruiting = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(
        needs.tank,
        needs.healer,
        needs.dps,
        stillRecruiting ? 1 : 0,
        now,
        team.id,
      ),
  ]);

  return { ok: true };
});

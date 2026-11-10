import type { Team } from "../../../shared/types/members";

// Creating a team also adds the creator as its first member, so the form
// carries their role and (optionally) the character they will bring.
const schema = teamInputSchema.and(joinDetailsSchema);

export default defineEventHandler(async (event): Promise<Team> => {
  const { user, db } = await requireUser(event);
  const body = await parseBody(event, schema);

  const owned = await db
    .prepare("SELECT COUNT(*) AS count FROM teams WHERE owner_id = ?")
    .bind(user.id)
    .first<{ count: number }>();
  if ((owned?.count ?? 0) >= MAX_OWNED_TEAMS) {
    throw fail(400, `You can own up to ${MAX_OWNED_TEAMS} teams.`);
  }
  const characterId = await assertOwnCharacter(db, user.id, body.characterId);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare(
        `INSERT INTO teams
           (id, owner_id, name, description, timezone, schedule, recruiting,
            need_tank, need_healer, need_dps, recruitment_note, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        user.id,
        body.name,
        body.description,
        body.timezone,
        JSON.stringify(body.schedule),
        body.recruiting ? 1 : 0,
        body.needs.tank,
        body.needs.healer,
        body.needs.dps,
        body.recruitmentNote,
        now,
        now,
      ),
    db
      .prepare(
        "INSERT INTO team_members (team_id, user_id, character_id, role, joined_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(id, user.id, characterId, body.role, now),
  ]);

  return loadTeam(db, user.id, id);
});

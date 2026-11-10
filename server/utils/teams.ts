import { z } from "zod";

import type {
  Team,
  TeamCharacterSummary,
  TeamJoin,
  TeamMember,
  TeamRole,
  TeamSlot,
} from "../../shared/types/members";
import type { D1Db } from "./db";

export const MAX_TEAM_MEMBERS = 10;
export const MAX_OWNED_TEAMS = 10;
// D1 allows 100 bound parameters per query and loadTeams binds one per team.
const MAX_LISTED_TEAMS = 50;

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const isTimeZone = (value: string) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
};

const needSchema = z.number().int().min(0).max(5);

export const roleSchema = z.enum(["tank", "healer", "dps"], {
  error: "Pick a role: tank, healer or DPS.",
});

export const teamInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Team name must be at least 3 characters.")
      .max(40, "Team name must be 40 characters or fewer."),
    description: z.string().trim().max(500).default(""),
    timezone: z.string().refine(isTimeZone, "Pick a valid timezone."),
    schedule: z
      .array(
        z.object({
          day: z.number().int().min(0).max(6),
          start: z.string().regex(TIME, "Use a valid start time."),
          end: z.string().regex(TIME, "Use a valid end time."),
        }),
      )
      .max(14, "A team can have up to 14 run times."),
    recruiting: z.boolean(),
    needs: z.object({ tank: needSchema, healer: needSchema, dps: needSchema }),
    recruitmentNote: z.string().trim().max(500).default(""),
  })
  .refine(
    (team) =>
      !team.recruiting ||
      team.needs.tank + team.needs.healer + team.needs.dps > 0,
    "Say which roles you are looking for before opening recruitment.",
  );

export const joinDetailsSchema = z.object({
  role: roleSchema,
  characterId: z.string().nullish(),
});

export interface TeamRow {
  id: string;
  owner_id: string;
  owner_name: string;
  name: string;
  description: string;
  timezone: string;
  schedule: string;
  recruiting: number;
  need_tank: number;
  need_healer: number;
  need_dps: number;
  recruitment_note: string;
}

interface PersonRow {
  team_id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  role: TeamRole | null;
  character_name: string | null;
  character_realm: string | null;
  character_region: string | null;
  character_class: string | null;
}

interface JoinRow extends PersonRow {
  kind: "invite" | "request";
  message: string;
}

const PERSON_COLUMNS = `x.team_id, x.user_id, x.role, u.display_name, u.avatar_url,
  c.name AS character_name, c.realm AS character_realm,
  c.region AS character_region, c.class AS character_class`;
const PERSON_JOINS = `JOIN users u ON u.id = x.user_id
  LEFT JOIN characters c ON c.id = x.character_id`;

function toCharacterSummary(row: PersonRow): TeamCharacterSummary | null {
  return row.character_name
    ? {
        name: row.character_name,
        realm: row.character_realm || "",
        region: row.character_region || "",
        class: row.character_class || "",
      }
    : null;
}

function parseSchedule(value: string): TeamSlot[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Loads teams matching `where` (a clause over `t`, the teams table) with their
 * members and how the viewer relates to each. Owners also get pending joins.
 */
export async function loadTeams(
  db: D1Db,
  viewerId: string,
  where: string,
  binds: unknown[] = [],
): Promise<Team[]> {
  const { results: rows } = await db
    .prepare(
      `SELECT t.*, o.display_name AS owner_name
       FROM teams t JOIN users o ON o.id = t.owner_id
       WHERE ${where}
       ORDER BY t.updated_at DESC LIMIT ${MAX_LISTED_TEAMS}`,
    )
    .bind(...binds)
    .all<TeamRow>();
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(",");
  const [{ results: memberRows }, { results: joinRows }] = await Promise.all([
    db
      .prepare(
        `SELECT ${PERSON_COLUMNS} FROM team_members x ${PERSON_JOINS}
         WHERE x.team_id IN (${placeholders}) ORDER BY x.joined_at`,
      )
      .bind(...ids)
      .all<PersonRow>(),
    db
      .prepare(
        `SELECT ${PERSON_COLUMNS}, x.kind, x.message FROM team_joins x ${PERSON_JOINS}
         WHERE x.team_id IN (${placeholders}) ORDER BY x.created_at`,
      )
      .bind(...ids)
      .all<JoinRow>(),
  ]);

  return rows.map((row): Team => {
    const isOwner = row.owner_id === viewerId;
    const members = memberRows
      .filter((member) => member.team_id === row.id)
      .map(
        (member): TeamMember => ({
          userId: member.user_id,
          displayName: member.display_name,
          avatarUrl: member.avatar_url,
          role: member.role || "dps",
          isOwner: member.user_id === row.owner_id,
          character: toCharacterSummary(member),
        }),
      );
    const joins = joinRows.filter((join) => join.team_id === row.id);

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      timezone: row.timezone,
      schedule: parseSchedule(row.schedule),
      recruiting: row.recruiting === 1,
      needs: {
        tank: row.need_tank,
        healer: row.need_healer,
        dps: row.need_dps,
      },
      recruitmentNote: row.recruitment_note,
      members,
      viewer: {
        isOwner,
        isMember: members.some((member) => member.userId === viewerId),
        pending: joins.find((join) => join.user_id === viewerId)?.kind ?? null,
      },
      // Other people's invites and requests are only the owner's business.
      ...(isOwner
        ? {
            joins: joins.map(
              (join): TeamJoin => ({
                userId: join.user_id,
                displayName: join.display_name,
                avatarUrl: join.avatar_url,
                kind: join.kind,
                role: join.role,
                message: join.message,
                character: toCharacterSummary(join),
              }),
            ),
          }
        : {}),
    };
  });
}

export async function loadTeam(
  db: D1Db,
  viewerId: string,
  teamId: string,
): Promise<Team> {
  const [team] = await loadTeams(db, viewerId, "t.id = ?", [teamId]);
  if (!team) throw fail(404, "Team not found.");
  return team;
}

/** Loads a team the viewer owns, or throws. */
export async function loadOwnedTeam(
  db: D1Db,
  viewerId: string,
  teamId: string,
): Promise<Team> {
  const team = await loadTeam(db, viewerId, teamId);
  if (!team.viewer.isOwner) {
    throw fail(403, "Only the team owner can do that.");
  }
  return team;
}

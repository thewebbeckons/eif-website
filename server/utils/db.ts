import type { H3Event } from "h3";
import type { z } from "zod";

// The slice of the D1 API this app uses, so the project does not need the
// full Workers type package.
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes?: number } }>;
}

export interface D1Db {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
}

// Every statement is idempotent: the schema is applied once per isolate on
// first use, so a fresh database (local or deployed) needs no migration step.
// Additive changes go at the end as new IF NOT EXISTS / ALTER statements.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    avatar_url TEXT,
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    player_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    realm TEXT NOT NULL,
    region TEXT NOT NULL,
    class TEXT NOT NULL,
    race TEXT NOT NULL,
    thumbnail_url TEXT,
    show_on_roster INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS characters_user ON characters(user_id)`,
  `CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    timezone TEXT NOT NULL,
    schedule TEXT NOT NULL DEFAULT '[]',
    recruiting INTEGER NOT NULL DEFAULT 0,
    need_tank INTEGER NOT NULL DEFAULT 0,
    need_healer INTEGER NOT NULL DEFAULT 0,
    need_dps INTEGER NOT NULL DEFAULT 0,
    recruitment_note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS team_members (
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id TEXT REFERENCES characters(id) ON DELETE SET NULL,
    role TEXT NOT NULL,
    joined_at TEXT NOT NULL,
    PRIMARY KEY (team_id, user_id)
  )`,
  `CREATE INDEX IF NOT EXISTS team_members_user ON team_members(user_id)`,
  `CREATE TABLE IF NOT EXISTS team_joins (
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    role TEXT,
    character_id TEXT REFERENCES characters(id) ON DELETE SET NULL,
    message TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    PRIMARY KEY (team_id, user_id)
  )`,
  `CREATE INDEX IF NOT EXISTS team_joins_user ON team_joins(user_id)`,
];

let schemaReady: Promise<unknown> | null = null;

export function getCloudflareEnv(event: H3Event): Record<string, unknown> {
  return (
    event.context._platform?.cloudflare?.env ??
    event.context.cloudflare?.env ??
    {}
  );
}

/** The D1 binding with the schema applied, or null when it is not bound. */
export async function getDb(env: Record<string, unknown>): Promise<D1Db | null> {
  const candidate = env.EIF_DB as D1Db | undefined;
  if (!candidate || typeof candidate.prepare !== "function") return null;

  schemaReady ??= candidate
    .batch(SCHEMA.map((statement) => candidate.prepare(statement)))
    .catch((error) => {
      schemaReady = null;
      throw error;
    });
  await schemaReady;

  return candidate;
}

export async function useDb(event: H3Event): Promise<D1Db> {
  const db = await getDb(getCloudflareEnv(event));
  if (!db) {
    throw fail(503, "The member database is not available.");
  }
  return db;
}

/** An error whose message is safe to show to the user as-is. */
export function fail(statusCode: number, message: string) {
  return createError({ statusCode, statusMessage: message, message });
}

export async function parseBody<T extends z.ZodType>(
  event: H3Event,
  schema: T,
): Promise<z.infer<T>> {
  const result = schema.safeParse(await readBody(event).catch(() => null));
  if (!result.success) {
    throw fail(400, result.error.issues[0]?.message || "Invalid request.");
  }
  return result.data;
}

export function requireParam(event: H3Event, name: string): string {
  const value = getRouterParam(event, name);
  if (!value) throw fail(400, "Invalid request.");
  return value;
}

import { z } from "zod";

import { rosterPlayerConfigSchema, type RosterConfig } from "./roster";

const ROSTER_KEY = "roster:active-mythic-plus:v1";
const RAIDER_IO_API = "https://raider.io/api/v1";
const PROFILE_CONCURRENCY = 4;

const guildMembersSchema = z.object({
  members: z.array(
    z.object({
      character: z.object({
        name: z.string().min(1),
        region: z.string().min(1),
        realm: z.string().min(1),
        class: z.string().min(1),
        race: z.string().min(1),
      }),
    }),
  ),
});

const characterScoreSchema = z.object({
  mythic_plus_scores_by_season: z
    .array(
      z.object({
        scores: z.object({ all: z.number().finite() }),
      }),
    )
    .optional(),
});

const activeRosterSchema = z.object({
  updatedAt: z.iso.datetime(),
  players: z.array(rosterPlayerConfigSchema),
});

export interface RosterKv {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export function getRosterBindings(value: unknown): {
  kv: RosterKv | null;
  raiderIoKey?: string;
} {
  if (!value || typeof value !== "object") {
    return { kv: null };
  }

  const env = value as Record<string, unknown>;
  const candidate = env.EIF_KV;
  const kv =
    candidate &&
    typeof candidate === "object" &&
    "get" in candidate &&
    typeof candidate.get === "function" &&
    "put" in candidate &&
    typeof candidate.put === "function"
      ? (candidate as RosterKv)
      : null;

  return {
    kv,
    raiderIoKey:
      typeof env.RAIDER_IO_KEY === "string" && env.RAIDER_IO_KEY
        ? env.RAIDER_IO_KEY
        : undefined,
  };
}

function playerId(name: string, realm: string): string {
  return `${name.toLowerCase().trim().replace(/\s+/g, "-")}-${realm.toLowerCase().trim().replace(/\s+/g, "-")}`;
}

function retryDelay(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) {
      return Math.max(seconds * 1_000, 0);
    }

    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) {
      return Math.max(date - Date.now(), 0);
    }
  }

  return 1_000 * 2 ** attempt;
}

async function fetchRaiderIo(
  path: string,
  query: Record<string, string>,
  raiderIoKey?: string,
): Promise<unknown> {
  const url = new URL(`${RAIDER_IO_API}${path}`);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  if (raiderIoKey) {
    url.searchParams.set("access_key", raiderIoKey);
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1_000 * 2 ** attempt));
      continue;
    }
    if (response.ok) {
      return response.json();
    }
    await response.body?.cancel();

    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      const delay = retryDelay(response, attempt);
      if (delay > 60_000) {
        throw new Error(`Raider.IO ${path} requested a retry after ${delay}ms`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    throw new Error(`Raider.IO ${path} returned HTTP ${response.status}`);
  }

  throw new Error(`Raider.IO ${path} retries exhausted`);
}

export async function readActiveRoster(
  kv: RosterKv,
): Promise<z.infer<typeof activeRosterSchema> | null> {
  const stored = await kv.get(ROSTER_KEY);
  return stored ? activeRosterSchema.parse(JSON.parse(stored)) : null;
}

export async function syncActiveRoster(input: {
  guild: RosterConfig["guild"];
  kv: RosterKv;
  raiderIoKey?: string;
}): Promise<{ guildMembers: number; activePlayers: number }> {
  const guild = guildMembersSchema.parse(
    await fetchRaiderIo(
      "/guilds/profile",
      {
        region: input.guild.region,
        realm: input.guild.realm,
        name: input.guild.name,
        fields: "members",
      },
      input.raiderIoKey,
    ),
  );

  if (guild.members.length === 0) {
    throw new Error("Raider.IO returned an empty guild membership list");
  }

  const members = new Map<string, (typeof guild.members)[number]["character"]>();
  for (const { character } of guild.members) {
    members.set(playerId(character.name, character.realm), character);
  }

  const characters = [...members.values()];
  const activePlayers: RosterConfig["players"] = [];
  let nextIndex = 0;
  let failure: unknown;

  async function checkScores(): Promise<void> {
    while (nextIndex < characters.length && !failure) {
      const character = characters[nextIndex++];
      if (!character) continue;

      try {
        const profile = characterScoreSchema.parse(
          await fetchRaiderIo(
            "/characters/profile",
            {
              region: character.region,
              realm: character.realm,
              name: character.name,
              fields: "mythic_plus_scores_by_season:current",
            },
            input.raiderIoKey,
          ),
        );

        if ((profile.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0) > 0) {
          activePlayers.push({
            id: playerId(character.name, character.realm),
            name: character.name,
            region: character.region,
            realm: character.realm,
            class: character.class,
            race: character.race,
          });
        }
      } catch (error) {
        failure = error;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(PROFILE_CONCURRENCY, characters.length) }, () =>
      checkScores(),
    ),
  );
  if (failure) throw failure;

  activePlayers.sort((a, b) => a.name.localeCompare(b.name));
  const snapshot = activeRosterSchema.parse({
    updatedAt: new Date().toISOString(),
    players: activePlayers,
  });
  await input.kv.put(ROSTER_KEY, JSON.stringify(snapshot));

  return {
    guildMembers: characters.length,
    activePlayers: activePlayers.length,
  };
}

import type { H3Event } from "h3";

import type { MemberCharacter } from "../../shared/types/members";
import type { D1Db } from "./db";
import type { RosterConfig } from "./roster";
import { getRosterBindings, playerId } from "./roster-sync";

export const MAX_CHARACTERS = 20;

interface CharacterRow {
  id: string;
  name: string;
  realm: string;
  region: string;
  class: string;
  race: string;
  thumbnail_url: string | null;
  show_on_roster: number;
}

const CHARACTER_COLUMNS =
  "id, name, realm, region, class, race, thumbnail_url, show_on_roster";

function toCharacter(row: CharacterRow): MemberCharacter {
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    region: row.region,
    class: row.class,
    race: row.race,
    thumbnailUrl: row.thumbnail_url,
    showOnRoster: row.show_on_roster === 1,
  };
}

export async function listCharacters(
  db: D1Db,
  userId: string,
): Promise<MemberCharacter[]> {
  const { results } = await db
    .prepare(
      `SELECT ${CHARACTER_COLUMNS} FROM characters WHERE user_id = ? ORDER BY created_at`,
    )
    .bind(userId)
    .all<CharacterRow>();
  return results.map(toCharacter);
}

/** Throws unless `characterId` is null or one of the user's own characters. */
export async function assertOwnCharacter(
  db: D1Db,
  userId: string,
  characterId: string | null | undefined,
): Promise<string | null> {
  if (!characterId) return null;
  const row = await db
    .prepare("SELECT id FROM characters WHERE id = ? AND user_id = ?")
    .bind(characterId, userId)
    .first();
  if (!row) throw fail(400, "Pick one of your own characters.");
  return characterId;
}

/** Confirms the character exists on Raider.IO and returns its canonical details. */
export async function lookupCharacter(
  event: H3Event,
  input: { name: string; realm: string; region: string },
) {
  const { raiderIoKey: bindingKey } = getRosterBindings(getCloudflareEnv(event));
  const raiderIoKey = bindingKey || process.env.RAIDER_IO_KEY || undefined;

  try {
    const data = await $fetch<{
      name: string;
      class: string;
      race: string;
      thumbnail_url?: string;
    }>("https://raider.io/api/v1/characters/profile", {
      query: {
        ...input,
        ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
      },
      timeout: 8_000,
    });
    return {
      name: data.name,
      class: data.class,
      race: data.race,
      thumbnailUrl: data.thumbnail_url || null,
    };
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    if (status === 400 || status === 404) {
      throw fail(404, "Raider.IO could not find that character. Check the name and realm.");
    }
    console.error("Raider.IO character lookup failed", error);
    throw fail(502, "Raider.IO is not responding. Try again in a minute.");
  }
}

/** Characters members have opted in to showing on the public roster. */
export async function listRosterOptIns(
  db: D1Db,
): Promise<RosterConfig["players"]> {
  const { results } = await db
    .prepare(
      `SELECT ${CHARACTER_COLUMNS} FROM characters WHERE show_on_roster = 1 ORDER BY name`,
    )
    .all<CharacterRow>();
  return results.map((row) => ({
    id: playerId(row.name, row.realm),
    name: row.name,
    region: row.region,
    realm: row.realm,
    class: row.class,
    race: row.race,
  }));
}

/** Drops the cached /api/roster response so a roster change shows right away. */
export async function invalidateRosterCache(): Promise<void> {
  try {
    await useStorage("cache").removeItem("nitro:handlers:roster:roster.json");
  } catch (error) {
    console.error("Failed to invalidate the roster cache", error);
  }
}

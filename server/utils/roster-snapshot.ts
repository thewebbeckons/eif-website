import { z } from "zod";

import type { RosterGuild, RosterPlayer } from "../../shared/types/roster";
import type { CachedRosterSnapshot } from "./roster-cache";
import type { RosterConfig } from "./roster";

const RAIDER_IO_CONCURRENCY = 6;
const RAIDER_IO_RETRY_COUNT = 2;

const guildProfileSchema = z.object({
  raid_progression: z
    .record(z.string(), z.object({ summary: z.string() }).passthrough())
    .optional(),
});

const rosterBestRunSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    short_name: z.string().optional(),
    mythic_level: z.number().optional(),
    background_image_url: z.string().optional(),
  })
  .passthrough();

const characterProfileSchema = z.object({
  class: z.string().optional(),
  race: z.string().optional(),
  thumbnail_url: z.string().nullable().optional(),
  mythic_plus_scores_by_season: z
    .array(
      z.object({
        scores: z.object({ all: z.number().optional() }).optional(),
      }),
    )
    .optional(),
  mythic_plus_best_runs: z.array(rosterBestRunSchema).optional(),
});

interface GuildLookupResult {
  guild: RosterGuild;
  errorMessage: string | null;
}

interface PlayerLookupResult {
  player: RosterPlayer;
  errorMessage: string | null;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

async function mapWithConcurrency<TItem, TResult>(
  items: TItem[],
  concurrency: number,
  mapper: (item: TItem) => Promise<TResult>,
): Promise<TResult[]> {
  const results: TResult[] = [];

  for (let index = 0; index < items.length; index += concurrency) {
    const batch = items.slice(index, index + concurrency);
    results.push(...(await Promise.all(batch.map(mapper))));
  }

  return results;
}

const GUILD_PROFILE_FIELDS = "raid_progression:current-tier";
const CHARACTER_PROFILE_FIELDS =
  "class,race,thumbnail_url,mythic_plus_scores_by_season:current,mythic_plus_best_runs";

async function buildRosterGuild(
  guildConfig: RosterConfig["guild"],
  raiderIoKey?: string,
): Promise<GuildLookupResult> {
  const guild: RosterGuild = {
    ...guildConfig,
  };

  try {
    const guildProfileResponse = await $fetch(
      "https://raider.io/api/v1/guilds/profile",
      {
        query: {
          region: guildConfig.region,
          realm: guildConfig.realm,
          name: guildConfig.name,
          fields: GUILD_PROFILE_FIELDS,
          ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
        },
        timeout: 8_000,
        retry: RAIDER_IO_RETRY_COUNT,
        retryDelay: 500,
      },
    );
    const guildProfile = guildProfileSchema.parse(guildProfileResponse);

    if (guildProfile.raid_progression) {
      guild.raid_progression = guildProfile.raid_progression;
    }

    return { guild, errorMessage: null };
  } catch (error) {
    return { guild, errorMessage: getErrorMessage(error) };
  }
}

async function buildRosterPlayer(
  playerConfig: RosterConfig["players"][number],
  raiderIoKey?: string,
): Promise<PlayerLookupResult> {
  const player = createBaseRosterPlayer(playerConfig);

  try {
    const response = await $fetch(
      "https://raider.io/api/v1/characters/profile",
      {
        query: {
          region: playerConfig.region,
          realm: playerConfig.realm,
          name: playerConfig.name,
          fields: CHARACTER_PROFILE_FIELDS,
          ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
        },
        timeout: 8_000,
        retry: RAIDER_IO_RETRY_COUNT,
        retryDelay: 500,
      },
    );
    const data = characterProfileSchema.parse(response);

    const liveScore = data.mythic_plus_scores_by_season?.[0]?.scores?.all;

    return {
      player: {
        ...player,
        class: data.class || player.class,
        race: data.race || player.race,
        thumbnail_url: data.thumbnail_url || null,
        mythic_plus_score:
          typeof liveScore === "number" ? Math.round(liveScore) : null,
        mythic_plus_best_runs: data.mythic_plus_best_runs ?? null,
        lookup_status:
          typeof liveScore === "number" ? "ok" : "missing_score",
      },
      errorMessage: null,
    };
  } catch (error) {
    return {
      player,
      errorMessage: getErrorMessage(error),
    };
  }
}

export async function buildRosterSnapshot(): Promise<CachedRosterSnapshot> {
  const runtimeConfig = useRuntimeConfig();
  const rosterConfig = getRosterConfig();
  const raiderIoKey =
    typeof runtimeConfig.raiderIoKey === "string"
      ? runtimeConfig.raiderIoKey
      : undefined;

  const [guildResult, playerResults] = await Promise.all([
    buildRosterGuild(rosterConfig.guild, raiderIoKey),
    mapWithConcurrency(
      rosterConfig.players,
      RAIDER_IO_CONCURRENCY,
      (playerConfig) => buildRosterPlayer(playerConfig, raiderIoKey),
    ),
  ]);
  const failedPlayers = playerResults.filter((result) => result.errorMessage);

  if (
    failedPlayers.length === playerResults.length &&
    playerResults.length > 0
  ) {
    throw new Error(
      `Raider.IO lookups failed for all ${playerResults.length} roster players.`,
    );
  }

  if (guildResult.errorMessage || failedPlayers.length > 0) {
    logWorkerWarning("roster.snapshot.degraded", {
      guildLookupError: guildResult.errorMessage,
      failedPlayerCount: failedPlayers.length,
      failedPlayers: failedPlayers
        .slice(0, 10)
        .map(({ player, errorMessage }) => ({
          name: player.name,
          error: errorMessage,
        })),
      totalPlayerCount: playerResults.length,
    });
  }

  const players = playerResults.map((result) => result.player);

  return {
    generatedAt: new Date().toISOString(),
    data: createRosterResponse({
      guild: guildResult.guild,
      players,
      teams: rosterConfig.teams,
    }),
  };
}

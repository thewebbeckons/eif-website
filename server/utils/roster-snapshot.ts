import type {
  RosterGuild,
  RosterPlayer,
} from "../../shared/types/roster";
import type { CachedRosterSnapshot } from "./roster-cache";
import type { RosterConfig } from "./roster";

const GUILD_PROFILE_FIELDS = "raid_progression:current-tier";
const CHARACTER_PROFILE_FIELDS =
  "class,race,thumbnail_url,mythic_plus_scores_by_season:current,mythic_plus_best_runs";

async function buildRosterGuild(
  guildConfig: RosterConfig["guild"],
  raiderIoKey?: string,
): Promise<RosterGuild> {
  const guild: RosterGuild = {
    ...guildConfig,
  };

  try {
    const guildProfile = await $fetch<any>(
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
      },
    );

    if (guildProfile?.raid_progression) {
      guild.raid_progression = guildProfile.raid_progression;
    }
  } catch (error) {
    console.error("Failed to fetch guild progression", error);
  }

  return guild;
}

async function buildRosterPlayer(
  playerConfig: RosterConfig["players"][number],
  raiderIoKey?: string,
): Promise<RosterPlayer> {
  const player = createBaseRosterPlayer(playerConfig);

  try {
    const data = await $fetch<any>("https://raider.io/api/v1/characters/profile", {
      query: {
        region: playerConfig.region,
        realm: playerConfig.realm,
        name: playerConfig.name,
        fields: CHARACTER_PROFILE_FIELDS,
        ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
      },
      timeout: 5_000,
    });

    const liveScore = data?.mythic_plus_scores_by_season?.[0]?.scores?.all;

    return {
      ...player,
      class: data?.class || player.class,
      race: data?.race || player.race,
      thumbnail_url: data?.thumbnail_url || null,
      mythic_plus_score:
        typeof liveScore === "number" ? Math.round(liveScore) : null,
      mythic_plus_best_runs: Array.isArray(data?.mythic_plus_best_runs)
        ? data.mythic_plus_best_runs
        : null,
      lookup_status: typeof liveScore === "number" ? "ok" : "missing_score",
    };
  } catch (error) {
    console.error(`Failed to fetch score for ${playerConfig.name}`, error);
    return player;
  }
}

export async function buildRosterSnapshot(): Promise<CachedRosterSnapshot> {
  const runtimeConfig = useRuntimeConfig();
  const rosterConfig = getRosterConfig();
  const raiderIoKey =
    typeof runtimeConfig.raiderIoKey === "string"
      ? runtimeConfig.raiderIoKey
      : undefined;

  const guild = await buildRosterGuild(rosterConfig.guild, raiderIoKey);
  const players = await Promise.all(
    rosterConfig.players.map((playerConfig) =>
      buildRosterPlayer(playerConfig, raiderIoKey),
    ),
  );

  return {
    generatedAt: new Date().toISOString(),
    data: createRosterResponse({
      guild,
      players,
      teams: rosterConfig.teams,
    }),
  };
}

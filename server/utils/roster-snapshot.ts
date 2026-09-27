import type { H3Event } from "h3";
import type {
  RosterGuild,
  RosterPlayer,
  RosterResponse,
} from "../../shared/types/roster";
import type { RosterConfig } from "./roster";
import { getRosterBindings, readActiveRoster } from "./roster-sync";

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

export async function buildRosterSnapshot(
  event: H3Event,
): Promise<RosterResponse> {
  const rosterConfig = getRosterConfig();
  const { kv, raiderIoKey: bindingKey } = getRosterBindings(
    event.context._platform?.cloudflare?.env ?? event.context.cloudflare?.env,
  );
  const raiderIoKey = bindingKey || process.env.RAIDER_IO_KEY || undefined;

  let playerConfigs = rosterConfig.players;
  if (kv) {
    try {
      const synced = await readActiveRoster(kv);
      if (synced) {
        const labels = new Map(
          rosterConfig.players
            .filter((player) => player.label)
            .map((player) => [player.id, player.label]),
        );
        playerConfigs = synced.players.map((player) => ({
          ...player,
          ...(labels.has(player.id) ? { label: labels.get(player.id) } : {}),
        }));
      }
    } catch (error) {
      console.error("Failed to read synced roster; using bundled fallback", error);
    }
  }

  const guild = await buildRosterGuild(rosterConfig.guild, raiderIoKey);
  const players = await Promise.all(
    playerConfigs.map((playerConfig) =>
      buildRosterPlayer(playerConfig, raiderIoKey),
    ),
  );

  return createRosterResponse({
    guild,
    players,
    teams: rosterConfig.teams,
  });
}

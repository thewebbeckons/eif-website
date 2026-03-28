import type {
  RosterGuild,
  RosterPlayer,
  RosterResponse,
} from "../../shared/types/roster";

export default defineCachedEventHandler(
  async (): Promise<RosterResponse> => {
    const raiderIoKey = process.env.RAIDER_IO_KEY;
    const rosterConfig = getRosterConfig();

    const guild: RosterGuild = {
      ...rosterConfig.guild,
    };

    try {
      const guildProfile = await $fetch<any>(
        "https://raider.io/api/v1/guilds/profile",
        {
          query: {
            region: rosterConfig.guild.region,
            realm: rosterConfig.guild.realm,
            name: rosterConfig.guild.name,
            fields: "raid_progression:current-tier",
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

    const players = await Promise.all(
      rosterConfig.players.map(async (playerConfig): Promise<RosterPlayer> => {
        const player = createBaseRosterPlayer(playerConfig);

        try {
          const data = await $fetch<any>(
            "https://raider.io/api/v1/characters/profile",
            {
              query: {
                region: playerConfig.region,
                realm: playerConfig.realm,
                name: playerConfig.name,
                fields:
                  "class,race,thumbnail_url,mythic_plus_scores_by_season:current,mythic_plus_best_runs",
                ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
              },
              timeout: 5_000,
            },
          );

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
            lookup_status:
              typeof liveScore === "number" ? "ok" : "missing_score",
          };
        } catch (error) {
          console.error(`Failed to fetch score for ${playerConfig.name}`, error);
          return player;
        }
      }),
    );

    return createRosterResponse({
      guild,
      players,
      teams: rosterConfig.teams,
    });
  },
  {
    maxAge: 600,
    name: "roster",
    getKey: () => "roster",
  },
);

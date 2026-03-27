export default defineCachedEventHandler(
  async (event): Promise<{ guild: any; members: any[] }> => {
    const raiderIoKey = process.env.RAIDER_IO_KEY;

    // 1. Fetch guild data
    const guild = await $fetch<any>("https://raider.io/api/v1/guilds/profile", {
      query: {
        region: "us",
        realm: "illidan",
        name: "exercise in futility",
        fields: "members,raid_progression:current-tier",
        ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
      },
      timeout: 8_000,
    });

    if (!guild?.members) {
      return { guild, members: [] };
    }

    // 2. Filter members - get only those with rank < 5
    let filteredMembers = guild.members
      .filter((m: any) => m.rank < 5)
      .map((m: any) => ({
        name: m.character.name,
        race: m.character.race,
        class: m.character.class,
        mythic_plus_score: 0,
        mythic_plus_best_runs: null,
        thumbnail_url: null,
      }));

    // 3. Fetch all character data in parallel (with per-request timeout)
    const scorePromises = filteredMembers.map(async (member: any) => {
      try {
        const data = await $fetch<any>(
          "https://raider.io/api/v1/characters/profile",
          {
            query: {
              region: "us",
              realm: "illidan",
              name: member.name,
              fields:
                "mythic_plus_scores_by_season:current,mythic_plus_best_runs",
              ...(raiderIoKey ? { access_key: raiderIoKey } : {}),
            },
            timeout: 5_000,
          },
        );

        if (data?.mythic_plus_scores_by_season?.[0]?.scores?.all) {
          member.mythic_plus_score = Math.round(
            data.mythic_plus_scores_by_season[0].scores.all,
          );
          member.mythic_plus_best_runs = data.mythic_plus_best_runs;
          member.thumbnail_url = data.thumbnail_url;
        }
      } catch (e) {
        console.error(`Failed to fetch score for ${member.name}`, e);
      }
    });

    await Promise.allSettled(scorePromises);

    // 4. Filter out members with 0 score
    const members = filteredMembers.filter(
      (m: any) => (m.mythic_plus_score || 0) > 0,
    );

    return {
      guild,
      members,
    };
  },
  {
    // Cache for 10 minutes server-side. Unlike SWR route rules on Vercel,
    // defineCachedEventHandler only caches successful responses — a failed
    // revalidation won't leave stale data stuck indefinitely.
    maxAge: 600,
    name: "roster",
    getKey: () => "roster",
  },
);

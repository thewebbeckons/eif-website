import { z } from "zod";

import rosterConfig from "../assets/roster.json";
import type {
  RosterGuild,
  RosterPlayer,
  RosterResponse,
  RosterTeam,
} from "../../shared/types/roster";

const rosterPlayerConfigSchema = z.object({
  id: z.string().min(1, "Player id is required."),
  name: z.string().min(1, "Player name is required."),
  label: z.string().min(1).optional(),
  region: z.string().min(1, "Player region is required."),
  realm: z.string().min(1, "Player realm is required."),
  class: z.string().min(1, "Player class fallback is required."),
  race: z.string().min(1, "Player race fallback is required."),
});

const rosterTeamConfigSchema = z.object({
  id: z.string().min(1, "Team id is required."),
  name: z.string().min(1, "Team name is required."),
  memberIds: z.array(z.string().min(1)).default([]),
});

const rosterConfigSchema = z
  .object({
    guild: z.object({
      name: z.string().min(1, "Guild name is required."),
      realm: z.string().min(1, "Guild realm is required."),
      region: z.string().min(1, "Guild region is required."),
    }),
    players: z.array(rosterPlayerConfigSchema),
    teams: z.array(rosterTeamConfigSchema),
  })
  .superRefine((config, ctx) => {
    const playerIds = new Set<string>();
    const teamIds = new Set<string>();

    config.players.forEach((player, index) => {
      if (playerIds.has(player.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["players", index, "id"],
          message: `Duplicate player id "${player.id}".`,
        });
      }
      playerIds.add(player.id);
    });

    config.teams.forEach((team, index) => {
      if (teamIds.has(team.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teams", index, "id"],
          message: `Duplicate team id "${team.id}".`,
        });
      }
      teamIds.add(team.id);

      team.memberIds.forEach((memberId, memberIndex) => {
        if (!playerIds.has(memberId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["teams", index, "memberIds", memberIndex],
            message: `Unknown player id "${memberId}" referenced by team "${team.name}".`,
          });
        }
      });
    });
  });

export type RosterConfig = z.infer<typeof rosterConfigSchema>;

const rosterConfigResult = rosterConfigSchema.safeParse(rosterConfig);

const formatRosterConfigError = (issues: z.ZodIssue[]) =>
  issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");

export function getRosterConfig(): RosterConfig {
  if (rosterConfigResult.success) {
    return rosterConfigResult.data;
  }

  const details = formatRosterConfigError(rosterConfigResult.error.issues);
  console.error("Invalid roster config:", details);

  throw createError({
    statusCode: 500,
    statusMessage: import.meta.dev
      ? `Invalid roster config: ${details}`
      : "Invalid roster config.",
  });
}

export function createBaseRosterPlayer(
  player: RosterConfig["players"][number],
): RosterPlayer {
  return {
    id: player.id,
    name: player.name,
    label: player.label,
    region: player.region,
    realm: player.realm,
    class: player.class,
    race: player.race,
    thumbnail_url: null,
    mythic_plus_score: null,
    mythic_plus_best_runs: null,
    lookup_status: "lookup_failed",
  };
}

export function buildRosterTeams(
  teamConfigs: RosterConfig["teams"],
  players: RosterPlayer[],
): RosterTeam[] {
  const playersById = new Map(players.map((player) => [player.id, player]));

  return teamConfigs.map((team) => {
    const members = team.memberIds
      .map((memberId) => playersById.get(memberId))
      .filter((member): member is RosterPlayer => Boolean(member));

    const scoredMembers = members.filter(
      (member) => typeof member.mythic_plus_score === "number",
    );
    const scoredMemberCount = scoredMembers.length;
    const totalScore = scoredMembers.reduce(
      (sum, member) => sum + (member.mythic_plus_score ?? 0),
      0,
    );

    return {
      id: team.id,
      name: team.name,
      members,
      team_score:
        scoredMemberCount > 0 ? Math.round(totalScore / scoredMemberCount) : null,
      scored_member_count: scoredMemberCount,
      total_member_count: members.length,
    };
  });
}

export function createRosterResponse(input: {
  guild: RosterGuild;
  players: RosterPlayer[];
  teams: RosterConfig["teams"];
}): RosterResponse {
  return {
    guild: input.guild,
    players: input.players,
    teams: buildRosterTeams(input.teams, input.players),
  };
}

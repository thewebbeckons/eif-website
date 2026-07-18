import { createClient } from "@prismicio/client";
import { z } from "zod";

import prismicConfig from "../../prismic.config.json";
import type { HallOfFameDocument } from "../../prismicio-types";
import type {
  HallOfFameContent,
  HallOfFameMember,
  HallOfFameSeason,
} from "../../shared/types/hall-of-fame";
import fallbackSeasonsJson from "../assets/hall-of-fame.json";

const nullableTextSchema = z.string().nullable().optional();
const imageSchema = z
  .object({
    url: z.string().nullable().optional(),
    alt: z.string().nullable().optional(),
  })
  .passthrough();
const linkSchema = z
  .object({
    url: z.string().nullable().optional(),
  })
  .passthrough();

const prismicMemberSchema = z.object({
  name: nullableTextSchema,
  class_name: nullableTextSchema,
  specialization: nullableTextSchema,
  role: z.enum(["TANK", "HEALER", "DPS"]).nullable().optional(),
  avatar: imageSchema.nullable().optional(),
  profile_url: linkSchema.nullable().optional(),
  region: nullableTextSchema,
  realm: nullableTextSchema,
});

const championSeasonSliceSchema = z.object({
  slice_type: z.literal("champion_season"),
  primary: z.object({
    season_id: nullableTextSchema,
    season_name: nullableTextSchema,
    team_name: nullableTextSchema,
    score: z.number().nullable().optional(),
    members: z.array(prismicMemberSchema).optional(),
  }),
  items: z.array(prismicMemberSchema).optional(),
});

const hallOfFameDocumentSchema = z.object({
  data: z.object({
    title: nullableTextSchema,
    introduction: nullableTextSchema,
    active_season_name: nullableTextSchema,
    active_season_description: nullableTextSchema,
    slices: z.array(z.unknown()).default([]),
  }),
});

const fallbackSeasonSchema = z.object({
  seasonId: z.string(),
  seasonName: z.string(),
  teamName: z.string(),
  score: z.number(),
  members: z.array(
    z.object({
      name: z.string(),
      class: z.string(),
      spec: z.string(),
      role: z.enum(["TANK", "HEALER", "DPS"]),
      thumbnail_url: z.string().nullable(),
      realm: z.string(),
      region: z.string(),
    }),
  ),
});

const createRaiderIoUrl = (input: {
  name: string;
  region?: string | null;
  realm?: string | null;
}) => {
  if (!input.region || !input.realm) return null;

  return `https://raider.io/characters/${encodeURIComponent(input.region)}/${encodeURIComponent(input.realm)}/${encodeURIComponent(input.name)}`;
};

const createSeasonId = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const mapPrismicMember = (
  member: z.infer<typeof prismicMemberSchema>,
): HallOfFameMember | null => {
  if (!member.name || !member.class_name || !member.role) return null;

  return {
    name: member.name,
    className: member.class_name,
    specialization: member.specialization || "Unknown spec",
    role: member.role,
    avatarUrl: member.avatar?.url || null,
    avatarAlt: member.avatar?.alt || `${member.name} avatar`,
    profileUrl:
      member.profile_url?.url ||
      createRaiderIoUrl({
        name: member.name,
        region: member.region,
        realm: member.realm,
      }),
  };
};

const mapChampionSeasonSlice = (
  value: unknown,
): HallOfFameSeason | null => {
  const parsed = championSeasonSliceSchema.safeParse(value);
  if (!parsed.success) return null;

  const { primary } = parsed.data;
  if (!primary.season_name || !primary.team_name) return null;

  const members = (primary.members || parsed.data.items || [])
    .map(mapPrismicMember)
    .filter((member): member is HallOfFameMember => member !== null);

  return {
    id: primary.season_id || createSeasonId(primary.season_name),
    name: primary.season_name,
    teamName: primary.team_name,
    score: primary.score ?? null,
    members,
  };
};

const getFallbackContent = (): HallOfFameContent => {
  const fallbackSeasons = z
    .array(fallbackSeasonSchema)
    .parse(fallbackSeasonsJson);

  return {
    title: "Hall of Fame",
    introduction:
      "Immortalizing our champion Mythic+ squads across the seasons.",
    activeSeason: {
      name: "Midnight Season 1",
      description:
        "The race is underway. When the season closes, our highest-rated team will join the archive below.",
    },
    seasons: fallbackSeasons.map(
      (season): HallOfFameSeason => ({
        id: season.seasonId,
        name: season.seasonName,
        teamName: season.teamName,
        score: season.score,
        members: season.members.map(
          (member): HallOfFameMember => ({
            name: member.name,
            className: member.class,
            specialization: member.spec,
            role: member.role,
            avatarUrl: member.thumbnail_url,
            avatarAlt: `${member.name} avatar`,
            profileUrl: createRaiderIoUrl(member),
          }),
        ),
      }),
    ),
  };
};

const getPrismicContent = async (): Promise<HallOfFameContent> => {
  const client = createClient<HallOfFameDocument>(
    prismicConfig.repositoryName,
  );
  const response = await client.getSingle("hall_of_fame");
  const document = hallOfFameDocumentSchema.parse(response);
  const seasons = document.data.slices
    .map(mapChampionSeasonSlice)
    .filter((season): season is HallOfFameSeason => season !== null);

  return {
    title: document.data.title || "Hall of Fame",
    introduction:
      document.data.introduction ||
      "Immortalizing our champion Mythic+ squads across the seasons.",
    activeSeason: document.data.active_season_name
      ? {
          name: document.data.active_season_name,
          description:
            document.data.active_season_description ||
            "The race for this season's place in the archive is underway.",
        }
      : null,
    seasons,
  };
};

export default defineCachedEventHandler(
  async (): Promise<HallOfFameContent> => {
    try {
      return await getPrismicContent();
    } catch (error) {
      logWorkerWarning("hall_of_fame.prismic_fallback", {
        reason: error instanceof Error ? error.message : String(error),
      });

      return getFallbackContent();
    }
  },
  {
    maxAge: 300,
    swr: true,
  },
);

import { z } from "zod";

import type {
  HallOfFameContent,
  HallOfFameGuru,
  HallOfFameMember,
  HallOfFameSeason,
} from "../../shared/types/hall-of-fame";
import hallOfFameJson from "../assets/hall-of-fame.json";

const playerSchema = z.object({
  name: z.string().min(1),
  class: z.string().min(1),
  spec: z.string().min(1),
  role: z.enum(["TANK", "HEALER", "DPS"]),
  thumbnailUrl: z.string().url().nullable(),
  realm: z.string().min(1),
  region: z.string().min(1),
});

const hallOfFameSchema = z.object({
  title: z.string().min(1),
  introduction: z.string().min(1),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaImageUrl: z.string().nullable(),
  metaImageAlt: z.string().min(1),
  activeSeason: z
    .object({
      name: z.string().min(1),
      description: z.string().min(1),
    })
    .nullable(),
  seasons: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      championTeam: z.object({
        name: z.string().min(1),
        score: z.number().nonnegative().nullable(),
        members: z.array(playerSchema),
      }),
      mythicPlusGuru: playerSchema
        .extend({ score: z.number().nonnegative().nullable() })
        .nullable(),
    }),
  ),
});

const hallOfFameContent = hallOfFameSchema.parse(hallOfFameJson);

const createRaiderIoUrl = (input: {
  name: string;
  region?: string | null;
  realm?: string | null;
}) => {
  if (!input.region || !input.realm) return null;

  return `https://raider.io/characters/${encodeURIComponent(input.region)}/${encodeURIComponent(input.realm)}/${encodeURIComponent(input.name)}`;
};

const mapPlayer = (
  player: z.infer<typeof playerSchema>,
): HallOfFameMember => {
  return {
    name: player.name,
    className: player.class,
    specialization: player.spec,
    role: player.role,
    avatarUrl: player.thumbnailUrl,
    avatarAlt: `${player.name} avatar`,
    profileUrl: createRaiderIoUrl(player),
  };
};

const mapSeason = (
  season: z.infer<typeof hallOfFameSchema>["seasons"][number],
): HallOfFameSeason => {
  return {
    id: season.id,
    name: season.name,
    championTeam: {
      name: season.championTeam.name,
      score: season.championTeam.score,
      members: season.championTeam.members.map(mapPlayer),
    },
    mythicPlusGuru: season.mythicPlusGuru
      ? ({
          ...mapPlayer(season.mythicPlusGuru),
          score: season.mythicPlusGuru.score,
        } satisfies HallOfFameGuru)
      : null,
  };
};

const getHallOfFameContent = (): HallOfFameContent => {
  return {
    ...hallOfFameContent,
    seasons: hallOfFameContent.seasons.map(mapSeason),
  };
};

export default defineEventHandler((): HallOfFameContent =>
  getHallOfFameContent(),
);

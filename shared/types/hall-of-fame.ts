export type HallOfFameRole = "TANK" | "HEALER" | "DPS";

export interface HallOfFameMember {
  name: string;
  className: string;
  specialization: string;
  role: HallOfFameRole;
  avatarUrl: string | null;
  avatarAlt: string;
  profileUrl: string | null;
}

export interface HallOfFameGuru extends HallOfFameMember {
  score: number;
}

export interface HallOfFameTeam {
  name: string;
  score: number | null;
  members: HallOfFameMember[];
}

export interface HallOfFameSeason {
  id: string;
  name: string;
  championTeam: HallOfFameTeam;
  mythicPlusGuru: HallOfFameGuru | null;
}

export interface HallOfFameContent {
  title: string;
  introduction: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaImageUrl: string | null;
  metaImageAlt: string;
  activeSeason: {
    name: string;
    description: string;
  } | null;
  seasons: HallOfFameSeason[];
}

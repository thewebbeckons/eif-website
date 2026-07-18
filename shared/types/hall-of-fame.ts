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

export interface HallOfFameSeason {
  id: string;
  name: string;
  teamName: string;
  score: number | null;
  members: HallOfFameMember[];
}

export interface HallOfFameContent {
  title: string;
  introduction: string;
  activeSeason: {
    name: string;
    description: string;
  } | null;
  seasons: HallOfFameSeason[];
}

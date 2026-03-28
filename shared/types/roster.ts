export interface RosterGuild {
  name: string;
  realm: string;
  region: string;
  raid_progression?: Record<string, { summary: string }>;
}

export interface RosterBestRun {
  id?: string | number;
  short_name?: string;
  mythic_level?: number;
  background_image_url?: string;
}

export type RosterLookupStatus = "ok" | "missing_score" | "lookup_failed";

export interface RosterPlayer {
  id: string;
  name: string;
  label?: string;
  region: string;
  realm: string;
  class: string;
  race: string;
  thumbnail_url: string | null;
  mythic_plus_score: number | null;
  mythic_plus_best_runs: RosterBestRun[] | null;
  lookup_status: RosterLookupStatus;
}

export interface RosterTeam {
  id: string;
  name: string;
  members: RosterPlayer[];
  team_score: number | null;
  scored_member_count: number;
  total_member_count: number;
}

export interface RosterResponse {
  guild: RosterGuild;
  players: RosterPlayer[];
  teams: RosterTeam[];
}

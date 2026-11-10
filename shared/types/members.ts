export type TeamRole = "tank" | "healer" | "dps";

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface MemberCharacter {
  id: string;
  name: string;
  realm: string;
  region: string;
  class: string;
  race: string;
  thumbnailUrl: string | null;
  showOnRoster: boolean;
}

export interface MemberProfile {
  user: SessionUser;
  characters: MemberCharacter[];
}

export interface MemberSearchResult {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

/** A weekly run slot. `day` is 0 (Sunday) to 6; times are 24h "HH:MM" in the team's timezone. */
export interface TeamSlot {
  day: number;
  start: string;
  end: string;
}

export type TeamNeeds = Record<TeamRole, number>;

export interface TeamCharacterSummary {
  name: string;
  realm: string;
  region: string;
  class: string;
}

export interface TeamMember {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: TeamRole;
  isOwner: boolean;
  character: TeamCharacterSummary | null;
}

/** A pending invite (owner asked the user) or request (user asked the owner). */
export interface TeamJoin {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  kind: "invite" | "request";
  role: TeamRole | null;
  message: string;
  character: TeamCharacterSummary | null;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  timezone: string;
  schedule: TeamSlot[];
  recruiting: boolean;
  needs: TeamNeeds;
  recruitmentNote: string;
  members: TeamMember[];
  viewer: {
    isOwner: boolean;
    isMember: boolean;
    pending: "invite" | "request" | null;
  };
  /** Pending invites and requests. Only present for the team owner. */
  joins?: TeamJoin[];
}

export interface TeamInput {
  name: string;
  description: string;
  timezone: string;
  schedule: TeamSlot[];
  recruiting: boolean;
  needs: TeamNeeds;
  recruitmentNote: string;
}

export interface TeamListResponse {
  mine: Team[];
  invited: Team[];
  recruiting: Team[];
}

import { kv } from "hub:kv";

import type { RosterResponse } from "../../shared/types/roster";

export const ROSTER_SNAPSHOT_KEY = "roster:snapshot:v1";

export interface CachedRosterSnapshot {
  generatedAt: string;
  data: RosterResponse;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCachedRosterSnapshot = (
  value: unknown,
): value is CachedRosterSnapshot => {
  return (
    isRecord(value) &&
    typeof value.generatedAt === "string" &&
    isRecord(value.data) &&
    isRecord(value.data.guild) &&
    Array.isArray(value.data.players) &&
    Array.isArray(value.data.teams)
  );
};

export async function getCachedRosterSnapshot(): Promise<CachedRosterSnapshot | null> {
  const snapshot = await kv.get<CachedRosterSnapshot>(ROSTER_SNAPSHOT_KEY);
  return isCachedRosterSnapshot(snapshot) ? snapshot : null;
}

export async function setCachedRosterSnapshot(
  snapshot: CachedRosterSnapshot,
): Promise<void> {
  await kv.set(ROSTER_SNAPSHOT_KEY, snapshot);
}

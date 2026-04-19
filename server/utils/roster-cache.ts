import { kv } from "hub:kv";

import type { RosterResponse } from "../../shared/types/roster";

export const ROSTER_SNAPSHOT_KEY = "roster:snapshot:v1";
export const ROSTER_STATUS_KEY = "roster:status:v1";

export interface CachedRosterSnapshot {
  generatedAt: string;
  data: RosterResponse;
}

export interface RosterRefreshStatus {
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastFailureMessage: string | null;
}

const createDefaultRosterRefreshStatus = (): RosterRefreshStatus => ({
  lastAttemptAt: null,
  lastSuccessAt: null,
  lastFailureAt: null,
  lastFailureMessage: null,
});

let rosterRefreshStatusWriteQueue = Promise.resolve();

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

const isRosterRefreshStatus = (
  value: unknown,
): value is RosterRefreshStatus => {
  return (
    isRecord(value) &&
    (typeof value.lastAttemptAt === "string" || value.lastAttemptAt === null) &&
    (typeof value.lastSuccessAt === "string" || value.lastSuccessAt === null) &&
    (typeof value.lastFailureAt === "string" || value.lastFailureAt === null) &&
    (typeof value.lastFailureMessage === "string" ||
      value.lastFailureMessage === null)
  );
};

const normalizeRosterRefreshStatus = (value: unknown): RosterRefreshStatus =>
  isRosterRefreshStatus(value) ? value : createDefaultRosterRefreshStatus();

export async function getCachedRosterSnapshot(): Promise<CachedRosterSnapshot | null> {
  const snapshot = await kv.get<CachedRosterSnapshot>(ROSTER_SNAPSHOT_KEY);
  return isCachedRosterSnapshot(snapshot) ? snapshot : null;
}

export async function setCachedRosterSnapshot(
  snapshot: CachedRosterSnapshot,
): Promise<void> {
  await kv.set(ROSTER_SNAPSHOT_KEY, snapshot);
}

export async function getRosterRefreshStatus(): Promise<RosterRefreshStatus> {
  const status = await kv.get<RosterRefreshStatus>(ROSTER_STATUS_KEY);
  return normalizeRosterRefreshStatus(status);
}

export async function setRosterRefreshStatus(
  statusUpdate: Partial<RosterRefreshStatus>,
): Promise<RosterRefreshStatus> {
  const runUpdate = async (): Promise<RosterRefreshStatus> => {
    const currentStatus = normalizeRosterRefreshStatus(
      await kv.get<RosterRefreshStatus>(ROSTER_STATUS_KEY),
    );

    const nextStatus = {
      ...currentStatus,
      ...statusUpdate,
    } satisfies RosterRefreshStatus;

    await kv.set(ROSTER_STATUS_KEY, nextStatus);

    return nextStatus;
  };

  const result = rosterRefreshStatusWriteQueue.then(runUpdate, runUpdate);
  rosterRefreshStatusWriteQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}

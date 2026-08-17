import { DurableObject } from "cloudflare:workers";

const RECRUITMENT_ATTEMPTS_TABLE = "recruitment_attempts";
const ROSTER_LEASES_TABLE = "roster_leases";

export class RequestCoordinator extends DurableObject {
  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS ${RECRUITMENT_ATTEMPTS_TABLE} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          submitted_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS ${ROSTER_LEASES_TABLE} (
          name TEXT PRIMARY KEY,
          owner_token TEXT NOT NULL,
          expires_at INTEGER NOT NULL
        );
      `);
    });
  }

  consumeRecruitmentAttempt(
    now: number,
    maximumAttempts: number,
    windowMs: number,
  ): boolean {
    return this.ctx.storage.transactionSync(() => {
      this.ctx.storage.sql.exec(
        `DELETE FROM ${RECRUITMENT_ATTEMPTS_TABLE} WHERE submitted_at <= ?`,
        now - windowMs,
      );
      const { count } = this.ctx.storage.sql
        .exec<{ count: number }>(
          `SELECT COUNT(*) AS count FROM ${RECRUITMENT_ATTEMPTS_TABLE}`,
        )
        .one();

      if (count >= maximumAttempts) return false;

      this.ctx.storage.sql.exec(
        `INSERT INTO ${RECRUITMENT_ATTEMPTS_TABLE} (submitted_at) VALUES (?)`,
        now,
      );
      return true;
    });
  }

  tryAcquireRosterBuild(
    ownerToken: string,
    now: number,
    leaseMs: number,
  ): boolean {
    return this.ctx.storage.transactionSync(() => {
      const existingLease = this.ctx.storage.sql
        .exec<{ expires_at: number }>(
          `SELECT expires_at FROM ${ROSTER_LEASES_TABLE} WHERE name = ?`,
          "snapshot",
        )
        .toArray()[0];

      if (existingLease && existingLease.expires_at > now) return false;

      this.ctx.storage.sql.exec(
        `INSERT INTO ${ROSTER_LEASES_TABLE} (name, owner_token, expires_at)
         VALUES (?, ?, ?)
         ON CONFLICT(name) DO UPDATE SET
           owner_token = excluded.owner_token,
           expires_at = excluded.expires_at`,
        "snapshot",
        ownerToken,
        now + leaseMs,
      );
      return true;
    });
  }

  releaseRosterBuild(ownerToken: string): boolean {
    return this.ctx.storage.transactionSync(() => {
      const result = this.ctx.storage.sql.exec(
        `DELETE FROM ${ROSTER_LEASES_TABLE}
         WHERE name = ? AND owner_token = ?`,
        "snapshot",
        ownerToken,
      );
      return result.rowsWritten > 0;
    });
  }
}

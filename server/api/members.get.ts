import type { MemberSearchResult } from "../../shared/types/members";

// Finds signed-up members by name so a team owner can invite them.
export default defineEventHandler(
  async (event): Promise<MemberSearchResult[]> => {
    const { user, db } = await requireUser(event);
    const q = String(getQuery(event).q || "").trim().slice(0, 32);
    if (q.length < 2) return [];

    const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    const { results } = await db
      .prepare(
        `SELECT id, display_name, avatar_url FROM users
         WHERE id != ? AND (display_name LIKE ? ESCAPE '\\' OR username LIKE ? ESCAPE '\\')
         ORDER BY display_name LIMIT 8`,
      )
      .bind(user.id, pattern, pattern)
      .all<{ id: string; display_name: string; avatar_url: string | null }>();

    return results.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    }));
  },
);

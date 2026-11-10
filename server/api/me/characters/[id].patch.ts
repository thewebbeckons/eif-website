import { z } from "zod";

const schema = z.object({ showOnRoster: z.boolean() });

export default defineEventHandler(async (event) => {
  const { user, db } = await requireUser(event);
  const { showOnRoster } = await parseBody(event, schema);

  const updated = await db
    .prepare("UPDATE characters SET show_on_roster = ? WHERE id = ? AND user_id = ?")
    .bind(showOnRoster ? 1 : 0, requireParam(event, "id"), user.id)
    .run();
  if (!updated.meta.changes) throw fail(404, "Character not found.");

  await invalidateRosterCache();
  return { ok: true };
});

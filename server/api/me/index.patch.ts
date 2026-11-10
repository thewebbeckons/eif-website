import { z } from "zod";

import type { SessionUser } from "../../../shared/types/members";

const schema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(32, "Display name must be 32 characters or fewer."),
});

export default defineEventHandler(async (event): Promise<SessionUser> => {
  const { user, db } = await requireUser(event);
  const { displayName } = await parseBody(event, schema);

  await db
    .prepare("UPDATE users SET display_name = ?, updated_at = ? WHERE id = ?")
    .bind(displayName, new Date().toISOString(), user.id)
    .run();

  return { ...user, displayName };
});

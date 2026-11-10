import type { SessionUser } from "../../../shared/types/members";

export default defineEventHandler(
  async (event): Promise<{ user: SessionUser | null }> => {
    setResponseHeader(event, "Cache-Control", "no-store");
    const signedIn = await getSessionUser(event);
    return { user: signedIn?.user ?? null };
  },
);

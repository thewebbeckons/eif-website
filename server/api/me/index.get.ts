import type { MemberProfile } from "../../../shared/types/members";

export default defineEventHandler(async (event): Promise<MemberProfile> => {
  const { user, db } = await requireUser(event);
  return { user, characters: await listCharacters(db, user.id) };
});

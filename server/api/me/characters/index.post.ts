import { z } from "zod";

import type { MemberCharacter } from "../../../../shared/types/members";
import { playerId } from "../../../utils/roster-sync";

const schema = z.object({
  name: z.string().trim().min(2, "Enter a character name.").max(24),
  realm: z.string().trim().min(2, "Enter a realm.").max(40),
  region: z.enum(["us", "eu", "kr", "tw"]).default("us"),
});

export default defineEventHandler(async (event): Promise<MemberCharacter> => {
  const { user, db } = await requireUser(event);
  const body = await parseBody(event, schema);

  const owned = await db
    .prepare("SELECT COUNT(*) AS count FROM characters WHERE user_id = ?")
    .bind(user.id)
    .first<{ count: number }>();
  if ((owned?.count ?? 0) >= MAX_CHARACTERS) {
    throw fail(400, `You can add up to ${MAX_CHARACTERS} characters.`);
  }

  // Raider.IO addresses realms by slug: "Area 52" -> "area-52", "Mal'Ganis" -> "malganis".
  const realm = body.realm
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\s+/g, "-");
  const found = await lookupCharacter(event, {
    name: body.name,
    realm,
    region: body.region,
  });

  const character: MemberCharacter = {
    id: crypto.randomUUID(),
    name: found.name,
    realm,
    region: body.region,
    class: found.class,
    race: found.race,
    thumbnailUrl: found.thumbnailUrl,
    showOnRoster: false,
  };

  const inserted = await db
    .prepare(
      `INSERT INTO characters
         (id, user_id, player_key, name, realm, region, class, race, thumbnail_url, show_on_roster, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
       ON CONFLICT(player_key) DO NOTHING`,
    )
    .bind(
      character.id,
      user.id,
      `${body.region}:${playerId(found.name, realm)}`,
      character.name,
      character.realm,
      character.region,
      character.class,
      character.race,
      character.thumbnailUrl,
      new Date().toISOString(),
    )
    .run();
  if (!inserted.meta.changes) {
    throw fail(409, "That character has already been added.");
  }

  return character;
});

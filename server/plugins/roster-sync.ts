import { getRosterBindings, syncActiveRoster } from "../utils/roster-sync";
import { getRosterConfig } from "../utils/roster";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("cloudflare:scheduled", async ({ env }) => {
    const { kv, raiderIoKey } = getRosterBindings(env);
    if (!kv) {
      throw new Error("EIF_KV binding is required for the roster sync");
    }

    const result = await syncActiveRoster({
      guild: getRosterConfig().guild,
      kv,
      raiderIoKey: raiderIoKey || process.env.RAIDER_IO_KEY || undefined,
    });
    console.info("Roster sync completed", result);
  });
});

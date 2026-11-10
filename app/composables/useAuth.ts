import type { SessionUser } from "../../shared/types/members";

// Session state is loaded in the browser only (see plugins/auth.client.ts):
// most pages are prerendered or cached, so the server never renders a
// signed-in view. `ready` flips once the first session check has finished.
export const useAuth = () => {
  const user = useState<SessionUser | null>("auth:user", () => null);
  const ready = useState("auth:ready", () => false);

  const refresh = async () => {
    try {
      const session = await $fetch<{ user: SessionUser | null }>(
        "/api/auth/session",
      );
      user.value = session.user;
    } catch {
      user.value = null;
    } finally {
      ready.value = true;
    }
  };

  const signOut = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    user.value = null;
    await navigateTo("/");
  };

  return { user, ready, refresh, signOut, signInUrl: "/api/auth/discord" };
};

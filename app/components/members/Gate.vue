<script setup lang="ts">
// Wraps members-only content: shows it once signed in, otherwise a sign-in
// prompt (with the reason, when Discord sign-in just failed).
const { user, ready, signInUrl } = useAuth();
const route = useRoute();

const SIGN_IN_ERRORS: Record<string, string> = {
  "not-member":
    "That Discord account is not in the Exercise in Futility server. Join our Discord, then sign in again.",
  denied: "Sign in was cancelled on the Discord side.",
  expired: "That sign in attempt expired. Give it another go.",
  discord: "Discord did not respond. Try again in a minute.",
  config: "Sign in has not been set up on this site yet.",
};

const signInError = computed(() => {
  const code = route.query.error;
  return typeof code === "string" ? SIGN_IN_ERRORS[code] : undefined;
});
</script>

<template>
  <MembersPanel v-if="!ready">
    <p
      class="py-10 text-center text-xl font-black uppercase tracking-widest text-white"
    >
      Loading...
    </p>
  </MembersPanel>

  <MembersPanel v-else-if="!user">
    <div class="mx-auto max-w-xl py-10 text-center">
      <p class="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
        Members Only
      </p>
      <h2 class="mt-3 text-3xl font-heading font-black uppercase text-white">
        Sign in with Discord
      </h2>
      <p class="mt-3 text-lg font-bold text-stone-300">
        This area is for members of our Discord server. We only use Discord to
        check that you are one of us.
      </p>
      <p
        v-if="signInError"
        role="alert"
        class="mt-6 border-2 border-rose-500 bg-rose-500/10 px-4 py-3 text-left font-bold text-rose-200"
      >
        {{ signInError }}
      </p>
      <UButton
        :to="signInUrl"
        external
        size="xl"
        label="Sign in with Discord"
        icon="i-lucide-log-in"
        class="mt-8 bg-purple-500 text-white hover:bg-purple-600"
      />
    </div>
  </MembersPanel>

  <slot v-else :user="user" />
</template>

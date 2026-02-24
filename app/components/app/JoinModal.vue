<script setup lang="ts">
const { isOpen, close } = useJoinModal();

const form = reactive({
  characterInfo: "",
  discordTag: "",
  message: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");

const submitApplication = async () => {
  if (!form.characterInfo || !form.discordTag) {
    errorMessage.value = "Character Info and Discord Tag are required.";
    return;
  }

  if (!form.message.trim()) {
    errorMessage.value =
      "The void demands a sacrifice... of words. Tell us about yourself!";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await $fetch("/api/apply", {
      method: "POST",
      body: {
        characterInfo: form.characterInfo,
        discordTag: form.discordTag,
        message: form.message,
      },
    });

    isSuccess.value = true;

    // Auto close and reset
    setTimeout(() => {
      close();
      setTimeout(() => {
        isSuccess.value = false;
        form.characterInfo = "";
        form.discordTag = "";
        form.message = "";
      }, 300);
    }, 2000);
  } catch (error) {
    errorMessage.value =
      "Something went wrong sending your application. The void ate it.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content:
        'sm:max-w-md p-8 bg-zinc-900 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]',
    }"
  >
    <template #content>
      <div class="relative">
        <h3
          class="text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0_black] mb-2"
        >
          Join the Chaos
        </h3>
        <p class="text-zinc-400 font-bold mb-6">
          Drop your info below and an officer will reach out on Discord.
        </p>

        <div
          v-if="isSuccess"
          class="bg-lime-400 border-4 border-black p-6 flex flex-col items-center justify-center text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-1"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="w-12 h-12 text-black mb-2"
          />
          <h4 class="text-xl font-black uppercase text-black">
            Application Sent!
          </h4>
          <p class="text-black font-bold">We will be in touch soon.</p>
        </div>

        <form v-else @submit.prevent="submitApplication" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-sm font-black uppercase text-zinc-300"
              >Character Name & Server *</label
            >
            <input
              v-model="form.characterInfo"
              type="text"
              placeholder="e.g. Thrall - Illidan"
              class="w-full bg-white border-4 border-black px-4 py-3 font-black placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-purple-400 transition-all text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-black uppercase text-zinc-300"
              >Discord Tag *</label
            >
            <input
              v-model="form.discordTag"
              type="text"
              placeholder="e.g. thrall#1234 or thrall"
              class="w-full bg-white border-4 border-black px-4 py-3 font-black placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-purple-400 transition-all text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-black uppercase text-zinc-300"
              >Message *</label
            >
            <textarea
              v-model="form.message"
              rows="3"
              placeholder="Tell us a bit about yourself or link logs..."
              class="w-full bg-white border-4 border-black px-4 py-3 font-bold placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-purple-400 transition-all text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none"
            ></textarea>
          </div>

          <p
            v-if="errorMessage"
            class="text-red-400 font-bold text-sm bg-red-950/50 p-2 border-2 border-red-500"
          >
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-primary-500 hover:bg-primary-400 text-black border-4 border-black py-4 mt-4 font-black uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <UIcon
              v-if="isSubmitting"
              name="i-lucide-loader-circle"
              class="w-5 h-5 animate-spin"
            />
            <span v-else>Submit Application</span>
          </button>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const roles = ref([
  { name: "Tanks", icon: "i-lucide-shield", status: "Disabled" },
  { name: "Healers", icon: "i-lucide-plus", status: "Disabled" },
  { name: "Melee", icon: "i-lucide-swords", status: "Disabled" },
  { name: "Ranged", icon: "i-lucide-target", status: "Disabled" },
]);
</script>

<template>
  <section
    class="bg-purple-900 border-8 border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_#06b6d4] my-24 md:my-40 pointer-events-auto relative"
  >
    <div
      class="absolute -top-12 -left-6 bg-zinc-900 border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-5deg] z-10"
    >
      <span
        class="text-3xl md:text-4xl font-black uppercase tracking-wider text-white drop-shadow-[2px_2px_0_black]"
        >Who We Need</span
      >
    </div>

    <div class="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
      <div class="flex-1">
        <h3
          class="text-4xl lg:text-5xl font-black uppercase leading-none text-white drop-shadow-[2px_2px_0_black] mb-6"
        >
          Ready to embrace the
          <span class="text-cyan-400 underline decoration-8 underline-offset-8"
            >chaos?</span
          >
        </h3>
        <p
          class="text-xl md:text-2xl font-mono font-medium drop-shadow-[2px_2px_0px_black]"
        >
          Exercise in Futility is looking for fresh meat... I mean, dedicated
          raiders who enjoy wiping repeatedly while claiming we "almost had it".
          If you have a questionable sense of humor and too much free time, you
          belong here.
        </p>
      </div>

      <div class="flex-1 w-full max-w-2xl mx-auto">
        <div class="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto">
          <div
            v-for="role in roles"
            :key="role.name"
            :class="[
              'border-4 p-4 md:p-6 flex flex-col items-center justify-center transition-transform',
              role.status === 'Active'
                ? 'bg-zinc-800 border-white shadow-[4px_4px_0px_0px_#a855f7] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#a855f7]'
                : 'bg-zinc-900 border-zinc-700 text-zinc-500 opacity-60 grayscale shadow-[4px_4px_0px_0px_#3f3f46]',
            ]"
          >
            <UIcon :name="role.icon" class="w-8 h-8 md:w-12 md:h-12 mb-3" />
            <h3 class="text-lg md:text-2xl font-black uppercase mb-2">
              {{ role.name }}
            </h3>
            <div
              :class="[
                'px-3 py-0.5 text-xs md:text-sm font-bold uppercase border-2',
                role.status === 'Active'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                  : 'border-zinc-500 text-zinc-500 bg-zinc-800',
              ]"
            >
              {{ role.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

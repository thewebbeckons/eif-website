<script setup lang="ts">
import type { HallOfFameSeason } from "../../../shared/types/hall-of-fame";

defineProps<{
  season: HallOfFameSeason;
  index: number;
}>();
</script>

<template>
  <article
    class="group relative border-4 border-black bg-stone-900 p-6 shadow-[8px_8px_0_0_#000] transition-transform duration-200 hover:-translate-y-1 md:p-8"
  >
    <span
      class="absolute -top-5 right-5 border-4 border-black bg-cyan-300 px-3 py-1 font-mono text-xs font-black text-black shadow-[3px_3px_0_0_#000]"
      aria-hidden="true"
    >
      ARCHIVE {{ String(index + 1).padStart(2, "0") }}
    </span>

    <header
      class="flex flex-col gap-4 border-b-4 border-black pb-6 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p
          class="text-xs font-black uppercase tracking-[0.3em] text-cyan-300"
        >
          Completed season
        </p>
        <h2
          class="mt-2 text-3xl font-heading font-black uppercase text-white md:text-4xl"
        >
          {{ season.name }}
        </h2>
      </div>

      <div
        v-if="season.championTeam.score !== null"
        class="flex items-baseline gap-3"
      >
        <span
          class="text-xs font-black uppercase tracking-wider text-stone-400"
        >
          Team score
        </span>
        <span
          class="font-heading text-4xl font-black text-purple-400 drop-shadow-[2px_2px_0_#000]"
        >
          {{ season.championTeam.score.toLocaleString() }}
        </span>
      </div>
    </header>

    <div
      :class="[
        'mt-6 grid gap-8',
        season.mythicPlusGuru
          ? 'lg:grid-cols-[minmax(0,1fr)_18rem]'
          : 'grid-cols-1',
      ]"
    >
      <section>
        <p class="text-xs font-black uppercase tracking-widest text-stone-400">
          Champion team
        </p>
        <h3
          class="mt-1 text-2xl font-heading font-black uppercase tracking-tight text-white transition-colors group-hover:text-purple-300"
        >
          {{ season.championTeam.name }}
        </h3>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <component
            :is="member.profileUrl ? 'a' : 'div'"
            v-for="member in season.championTeam.members"
            :key="`${season.id}-${member.name}`"
            :href="member.profileUrl || undefined"
            :target="member.profileUrl ? '_blank' : undefined"
            :rel="member.profileUrl ? 'noreferrer' : undefined"
            class="flex flex-col border-2 border-black bg-stone-950 p-4 shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-1 hover:bg-stone-800 hover:shadow-[6px_6px_0_0_#000]"
          >
            <UAvatar
              :src="member.avatarUrl || undefined"
              :alt="member.avatarAlt"
              size="xl"
              class="mx-auto rounded-none border-2 border-black bg-stone-800 shadow-[2px_2px_0_0_#000]"
            />

            <div class="mt-4 text-center">
              <h4
                class="font-heading text-lg font-black uppercase tracking-tight text-white"
              >
                {{ member.name }}
              </h4>
              <p
                class="mt-1 text-xs font-black uppercase tracking-wider text-stone-400"
              >
                {{ member.specialization }}
              </p>
              <p
                :class="[
                  'text-xs font-bold uppercase tracking-wider',
                  getWowClassTextColor(member.className),
                ]"
              >
                {{ member.className }}
              </p>
            </div>

            <div class="mt-4 flex justify-center">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 border-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
                  getWowRoleBadgeClass(member.role),
                ]"
              >
                <UIcon :name="getWowRoleIcon(member.role)" class="size-3" />
                {{ member.role }}
              </span>
            </div>
          </component>
        </div>
      </section>

      <component
        :is="season.mythicPlusGuru.profileUrl ? 'a' : 'div'"
        v-if="season.mythicPlusGuru"
        :href="season.mythicPlusGuru.profileUrl || undefined"
        :target="season.mythicPlusGuru.profileUrl ? '_blank' : undefined"
        :rel="season.mythicPlusGuru.profileUrl ? 'noreferrer' : undefined"
        class="relative flex flex-col items-center overflow-hidden border-4 border-black bg-purple-300 p-5 text-center text-black shadow-[6px_6px_0_0_#000] transition-transform hover:-translate-y-1"
      >
        <div
          class="absolute -right-10 -top-10 size-28 rounded-full bg-white/30 blur-2xl"
        />
        <p
          class="relative flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.2em]"
        >
          <UIcon name="i-lucide-key-round" class="size-4" />
          Mythic+ Guru
        </p>

        <UAvatar
          :src="season.mythicPlusGuru.avatarUrl || undefined"
          :alt="season.mythicPlusGuru.avatarAlt"
          size="3xl"
          class="relative mt-5 rounded-none border-4 border-black bg-stone-800 shadow-[4px_4px_0_0_#000]"
        />

        <h3
          class="relative mt-5 font-heading text-2xl font-black uppercase tracking-tight"
        >
          {{ season.mythicPlusGuru.name }}
        </h3>
        <p class="relative mt-1 text-xs font-black uppercase tracking-wider">
          {{ season.mythicPlusGuru.specialization }}
          {{ season.mythicPlusGuru.className }}
        </p>

        <div
          v-if="season.mythicPlusGuru.score !== null"
          class="relative mt-5 border-t-2 border-black/30 pt-4"
        >
          <p class="text-[10px] font-black uppercase tracking-[0.2em]">
            Player score
          </p>
          <p class="font-heading text-4xl font-black">
            {{ season.mythicPlusGuru.score.toLocaleString() }}
          </p>
        </div>

        <div class="relative mt-4 flex justify-center">
          <span
            :class="[
              'inline-flex items-center gap-1.5 border-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
              getWowRoleBadgeClass(season.mythicPlusGuru.role),
            ]"
          >
            <UIcon
              :name="getWowRoleIcon(season.mythicPlusGuru.role)"
              class="size-3"
            />
            {{ season.mythicPlusGuru.role }}
          </span>
        </div>
      </component>
    </div>
  </article>
</template>

<script lang="ts" setup>
import StreamCard from "~/components/streams/StreamCard.vue";

export interface Stream {
  id: string;
  streamerName: string;
  twitchUrl: string;
  title: string;
  game: string;
  viewers: number;
  thumbnailUrl: string;
  avatarUrl: string;
  isLive: boolean;
}

const { data: streams, status } = await useFetch<Stream[]>("/api/streams", {
  getCachedData: () => undefined,
});

const liveStreams = computed(
  () => streams.value?.filter((s) => s.isLive) || [],
);
const offlineStreams = computed(
  () => streams.value?.filter((s) => !s.isLive) || [],
);
</script>

<template>
  <div class="pt-32 pb-24 min-h-screen">
    <UContainer>
      <!-- Page Header -->
      <div
        class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <h1
            class="text-5xl md:text-6xl font-heading font-black text-white tracking-tight mb-2 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] [-webkit-text-stroke:2px_black] uppercase"
          >
            Live Streams
          </h1>
          <p
            class="text-xl font-body text-white font-bold bg-black inline-block px-4 py-2 mt-2 -skew-x-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(216,180,254,1)]"
          >
            Exercise in Futility
          </p>
        </div>

        <div
          class="bg-secondary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-4 flex flex-col items-center transform transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] duration-200"
        >
          <span
            class="text-sm font-black text-white uppercase tracking-widest mb-1"
            >Active Streamers</span
          >
          <span
            v-if="status === 'pending'"
            class="text-3xl font-heading font-black text-white"
            ><USkeleton
              class="bg-black/20 w-8 h-8 rounded-none border border-black"
          /></span>
          <span v-else class="text-3xl font-heading font-black text-white">{{
            liveStreams.length
          }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="status === 'pending'" class="mt-12">
        <h2
          class="text-3xl font-heading font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3"
        >
          <span
            class="w-3 h-3 bg-red-600 rounded-full animate-pulse border border-black shadow-[1px_1px_0_rgba(0,0,0,1)]"
          ></span>
          Loading Streams...
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-stone-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full rounded-none overflow-hidden"
          >
            <USkeleton class="bg-stone-800 w-full aspect-video rounded-none" />
            <div class="p-4 flex gap-4">
              <USkeleton
                class="bg-stone-800 w-12 h-12 rounded-full border-2 border-black shrink-0"
              />
              <div class="flex-1 space-y-2">
                <USkeleton class="bg-stone-800 h-5 w-3/4" />
                <USkeleton class="bg-stone-800 h-4 w-1/2" />
                <USkeleton class="bg-stone-800 h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Streams Section -->
      <div v-else-if="liveStreams.length > 0" class="mt-12">
        <h2
          class="text-3xl font-heading font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3"
        >
          <span
            class="w-3 h-3 bg-red-600 rounded-full animate-pulse border border-black shadow-[1px_1px_0_rgba(0,0,0,1)]"
          ></span>
          Live Now
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StreamCard
            v-for="stream in liveStreams"
            :key="stream.id"
            :stream="stream"
          />
        </div>
      </div>

      <!-- Empty State for Live -->
      <div
        v-else-if="status === 'success'"
        class="mt-12 bg-stone-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center"
      >
        <h3 class="text-3xl font-heading font-black text-white uppercase mb-4">
          No Guild members are currently live
        </h3>
        <p class="text-stone-400 font-body font-bold text-lg">
          Check back later or join our Discord to see when we go live.
        </p>
      </div>

      <!-- Offline Streams Section -->
      <div
        v-if="status === 'success' && offlineStreams.length > 0"
        class="mt-20"
      >
        <h2
          class="text-3xl font-heading font-black text-stone-400 uppercase tracking-wider mb-6 flex items-center gap-3 opacity-80"
        >
          <span
            class="w-3 h-3 bg-stone-500 rounded-full border border-black"
          ></span>
          Offline Streamers
        </h2>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90"
        >
          <StreamCard
            v-for="stream in offlineStreams"
            :key="stream.id"
            :stream="stream"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

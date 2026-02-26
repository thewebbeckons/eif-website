<script lang="ts" setup>
const props = defineProps<{
  stream: {
    id: string
    streamerName: string
    twitchUrl: string
    title: string
    game: string
    viewers: number
    thumbnailUrl: string
    avatarUrl: string
    isLive: boolean
  }
}>()

const formattedViewers = computed(() => {
  return new Intl.NumberFormat('en-US').format(props.stream.viewers)
})

const rootTag = computed(() => (props.stream.isLive ? 'a' : 'div'))

const rootProps = computed(() => {
  if (!props.stream.isLive) {
    return {}
  }

  return {
    href: props.stream.twitchUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `Watch ${props.stream.streamerName} on Twitch`,
  }
})
</script>

<template>
  <component
    :is="rootTag"
    v-bind="rootProps"
    class="group relative block bg-stone-900 border-4 border-black rounded-none overflow-hidden transform transition-all duration-300"
    :class="stream.isLive 
      ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:border-[#d8b4fe]' 
      : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-80 hover:opacity-100 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'"
  >
    <!-- Thumbnail Area -->
    <div 
      class="relative w-full aspect-video border-b-4 border-black transition-colors duration-300"
      :class="stream.isLive ? 'group-hover:border-[#d8b4fe]' : 'group-hover:border-stone-500'"
    >
      <img 
        :src="stream.thumbnailUrl" 
        :alt="`${stream.streamerName}'s stream thumbnail`" 
        class="w-full h-full object-cover transition-all duration-300"
        :class="stream.isLive ? 'brightness-75 group-hover:brightness-100' : 'brightness-50 grayscale group-hover:grayscale-0 group-hover:brightness-75'"
      />
      
      <!-- Live / Offline Badge -->
      <div v-if="stream.isLive" class="absolute top-3 left-3 bg-red-600 text-white font-black text-xs uppercase px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 z-10">
        <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
        Live
      </div>
      <div v-else class="absolute top-3 left-3 bg-stone-700 text-stone-200 font-black text-xs uppercase px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 z-10">
        Offline
      </div>

      <!-- Viewer Count (Only when Live) -->
      <div v-if="stream.isLive" class="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white font-bold text-xs px-2 py-1 border border-black flex items-center gap-1.5 z-10">
        <UIcon name="i-heroicons-user-group" class="w-3.5 h-3.5 text-stone-300" />
        {{ formattedViewers }}
      </div>
    </div>

    <!-- Info Area -->
    <div class="p-5 flex gap-4 bg-stone-900 group-hover:bg-stone-800 transition-colors duration-300">
      <div class="shrink-0">
        <UAvatar 
          :src="stream.avatarUrl" 
          :alt="stream.streamerName"
          size="md"
          class="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none translate-y-1"
          :class="!stream.isLive ? 'grayscale group-hover:grayscale-0' : ''"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-heading font-black text-xl text-white truncate drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
          {{ stream.streamerName }}
        </h3>
        <p class="text-sm font-bold truncate mt-0.5" :class="stream.isLive ? 'text-stone-300' : 'text-stone-500'" :title="stream.title">
          {{ stream.isLive ? stream.title : 'Last seen streaming ' + stream.game }}
        </p>
        <p class="text-xs font-bold mt-2 uppercase tracking-wide" :class="stream.isLive ? 'text-purple-400' : 'text-stone-400'">
          {{ stream.game }}
        </p>
      </div>
    </div>
  </component>
</template>

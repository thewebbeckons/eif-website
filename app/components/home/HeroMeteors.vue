<script setup lang="ts">
import { onMounted, ref } from 'vue'

type MeteorIcon = {
  iconName: string
  colorClass: string
}

type Meteor = {
  id: number
  iconName: string
  colorClass: string
  top: string
  left: string
  delay: string
  duration: string
  sizeClass: string
}

const props = defineProps({
  count: {
    type: Number,
    default: 20,
  },
})

const iconPool: MeteorIcon[] = [
  { iconName: 'i-lucide-shield', colorClass: 'text-gray-200' },
  { iconName: 'i-lucide-heart', colorClass: 'text-paladin-pink' },
  { iconName: 'i-lucide-sword', colorClass: 'text-gray-900' },
  { iconName: 'i-lucide-scroll', colorClass: 'text-legendary-gold' },
  { iconName: 'i-lucide-cat', colorClass: 'text-druid-orange' },
  { iconName: 'i-lucide-gamepad-2', colorClass: 'text-mage-blue' },
  { iconName: 'i-lucide-trophy', colorClass: 'text-legendary-gold' },
  { iconName: 'i-lucide-sparkles', colorClass: 'text-mage-blue' },
  { iconName: 'i-lucide-coins', colorClass: 'text-loot-purple' },
  { iconName: 'i-lucide-paw-print', colorClass: 'text-druid-orange' },
  { iconName: 'i-lucide-flask-conical', colorClass: 'text-monk-green' },
  { iconName: 'i-lucide-skull', colorClass: 'text-gray-400' },
]

const sizeClasses = ['text-lg', 'text-xl', 'text-2xl']

const meteors = ref<Meteor[]>([])

const getRandomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

const buildMeteors = () => {
  meteors.value = Array.from({ length: props.count }, (_, index) => {
    const icon = getRandomItem(iconPool)
    return {
      id: index,
      iconName: icon.iconName,
      colorClass: icon.colorClass,
      top: `${Math.floor(Math.random() * 85)}%`,
      left: `${Math.floor(Math.random() * 140) - 20}%`,
      delay: `${(Math.random() * 0.6 + 0.2).toFixed(2)}s`,
      duration: `${Math.floor(Math.random() * 8) + 4}s`,
      sizeClass: getRandomItem(sizeClasses),
    }
  })
}

onMounted(buildMeteors)
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <span
      v-for="meteor in meteors"
      :key="`meteor-${meteor.id}`"
      class="animate-meteor-effect absolute flex items-center gap-2 opacity-70"
      :class="meteor.colorClass"
      :style="{
        top: meteor.top,
        left: meteor.left,
        animationDelay: meteor.delay,
        animationDuration: meteor.duration,
      }"
    >
      <span
        class="relative flex items-center before:absolute before:left-full before:top-1/2 before:h-px before:w-20 before:-translate-y-1/2 before:bg-gradient-to-r before:from-current before:to-transparent before:opacity-60"
        :class="meteor.sizeClass"
      >
        <UIcon :name="meteor.iconName" class="drop-shadow-sm rotate-180" />
      </span>
    </span>
  </div>
</template>

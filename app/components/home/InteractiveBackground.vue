<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const COLORS = ['#d8b4fe', '#a855f7', '#3b82f6', '#ec4899', '#6366f1']
const ICONS = [
  'i-lucide-swords',
  'i-lucide-heart',
  'i-lucide-gamepad-2',
  'i-lucide-scroll',
  'i-lucide-star'
]

interface Element {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  icon: string
  rotation: number
  rv: number
}

const elements = ref<Element[]>([])
let requestRef: number
let nextId = 0

onMounted(() => {
  const initialIcons = Array.from({ length: 22 }).map(() => ({
    id: nextId++,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 1.0,
    vy: (Math.random() - 0.5) * 1.0,
    size: 24 + Math.random() * 32,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
    icon: ICONS[Math.floor(Math.random() * ICONS.length)] as string,
    rotation: Math.random() * 360,
    rv: (Math.random() - 0.5) * 1.2
  }))
  elements.value = initialIcons
  
  const update = () => {
    elements.value = elements.value.map(el => {
      let nx = el.x + el.vx
      let ny = el.y + el.vy
      let nvx = el.vx
      let nvy = el.vy
      if (nx < -50 || nx > window.innerWidth + 50) nvx *= -1
      if (ny < -50 || ny > window.innerHeight + 50) nvy *= -1
      return { ...el, x: nx, y: ny, vx: nvx, vy: nvy, rotation: el.rotation + el.rv }
    })
    
    requestRef = requestAnimationFrame(update)
  }
  
  requestRef = requestAnimationFrame(update)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(requestRef)
})
</script>

<template>
  <div class="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none bg-[#0a0a1a]">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#0a0a1a_100%)] opacity-60" />
    <div 
      v-for="el in elements" 
      :key="'el-' + el.id" 
      class="absolute opacity-40 transition-opacity duration-500 blur-[0.5px]" 
      :style="{ transform: `translate(${el.x}px, ${el.y}px) rotate(${el.rotation}deg)`, color: el.color, filter: `drop-shadow(0 0 8px ${el.color})` }"
    >
      <UIcon :name="el.icon" :style="{ width: el.size + 'px', height: el.size + 'px' }" />
    </div>
  </div>
</template>

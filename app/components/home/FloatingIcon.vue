<template>
  <div 
    class="absolute text-2xl md:text-4xl drop-shadow-md pointer-events-none select-none"
    :style="{ 
      top: top, 
      left: left, 
      right: right, 
      bottom: bottom,
      zIndex: 0
    }"
  >
    <!-- Rotation Wrapper -->
    <div :style="{ transform: `rotate(${rotation}deg)` }">
      <!-- Float Wrapper -->
      <div 
        class="animate-float" 
        :style="{ animationDelay: delay }"
      >
        <!-- Glitch Wrapper (Randomized Delay) -->
        <div 
          class="animate-glitch" 
          :style="{ animationDelay: `${Math.random() * 5}s` }"
        >
          <UIcon :name="iconName" :class="colorClass" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconName: string
  colorClass?: string
  top?: string
  left?: string
  right?: string
  bottom?: string
  rotation?: number
  delay?: string
}>()
</script>

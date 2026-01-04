<template>
  <div class="relative flex items-center justify-center animate-float" :style="{ animationDelay: delay }">
    <!-- Body -->
    <div 
      :class="[
        'w-32 h-32 md:w-48 md:h-48 transition-all duration-500 shadow-xl backdrop-blur-sm rounded-full',
        type === 'voidwalker' ? 'bg-linear-to-br from-mage-blue to-cyan-500/80' : 'bg-linear-to-tl from-monk-green to-lime-400'
      ]"
    >
      <!-- Stick Figure SVG (Based on Type) -->
      <div class="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none text-white drop-shadow-md">
        
        <!-- Pose 1: Handstand (Voidwalker) -->
        <svg v-if="type === 'voidwalker'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 md:w-24 md:h-24">
           <!-- Head (Bottom) -->
           <circle cx="12" cy="18" r="2.5" />
           <!-- Body -->
           <path d="M12 15v-7" />
           <!-- Arms (Planting on ground) -->
           <path d="M12 15l-3 4" />
           <path d="M12 15l3 4" />
           <!-- Legs (Split V) -->
           <path d="M12 8l-4 -4" />
           <path d="M12 8l4 -4" />
        </svg>

        <!-- Pose 2: Cartwheel/Dynamic (Slime) -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 md:w-24 md:h-24">
            <!-- Head (Top Right) -->
            <circle cx="16" cy="7" r="2.5" />
            <!-- Body (Diagonal) -->
            <path d="M14 9l-4 6" />
            <!-- Arms (Flailing) -->
            <path d="M14 9l-3 -3" />
            <path d="M14 9l4 2" />
            <!-- Legs (Running/Air) -->
            <path d="M10 15l-3 4" />
            <path d="M10 15l4 2" />
        </svg>

      </div>
    </div>
    
    <!-- Glow/Reflections -->
    <div class="absolute -top-4 -right-4 w-10 h-10 bg-white/20 rounded-full blur-xl"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'voidwalker' | 'slime'
  delay?: string
}>()
</script>

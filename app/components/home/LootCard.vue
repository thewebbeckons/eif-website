<template>
  <div
    class="w-full max-w-sm bg-purple-700 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-float-1"
  >
    <div class="flex items-center gap-3 mb-2">
      <UIcon name="i-lucide-trophy" class="text-yellow-300 w-6 h-6 shrink-0" />
      <span class="text-white font-black uppercase text-sm tracking-widest"
        >Epic Loot Found!</span
      >
    </div>
    <div class="bg-zinc-100 border-2 border-black p-3 text-black">
      <p class="font-bold text-sm">
        <span class="text-purple-700 font-black">[Void-Touched Sock]</span>
        looted by <span class="text-purple-900">SplintQT</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes float-hero-1 {
  0%,
  100% {
    transform: translateY(0px) rotate(3deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
.animate-float-1 {
  animation: float-hero-1 4s ease-in-out infinite;
}
</style>

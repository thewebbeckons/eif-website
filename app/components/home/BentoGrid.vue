<template>
  <UContainer>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(320px,auto)]">
      
      <!-- Friendliness (Tall, Left) -->
      <div class="md:row-span-2 group relative rounded-3xl bg-pink-100/70 flex flex-col overflow-hidden transition-colors">
        <!-- UI Mockup: Chat -->
        <div class="flex-1 bg-white/40 relative overflow-hidden p-6 flex flex-col justify-end">
             <div class="space-y-4 w-full relative z-10">
                <!-- Message 1 (Left) -->
                <div class="flex flex-col gap-1 items-start transform transition-transform group-hover:translate-x-1 duration-500 w-[90%]">
                   <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full border-2 border-black bg-pink-200 flex items-center justify-center text-[10px] font-bold">GM</div>
                      <span class="text-xs font-bold text-gray-500">Guild Master</span>
                   </div>
                   <div class="bg-white border-2 border-black rounded-2xl rounded-tl-none p-3 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                      <div class="h-2 w-32 bg-gray-200 rounded-full mb-2"></div>
                      <div class="h-2 w-48 bg-gray-100 rounded-full"></div>
                   </div>
                </div>

                <!-- Message 2 (Right) -->
                 <div class="flex flex-col gap-1 items-end self-end transform transition-transform group-hover:-translate-x-1 duration-500 delay-100 w-[85%] ml-auto">
                   <div class="bg-blue-100 border-2 border-black rounded-2xl rounded-tr-none p-3 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                      <div class="h-2 w-40 bg-blue-200 rounded-full"></div>
                   </div>
                </div>

                 <!-- Message 3 (Left) -->
                <div class="flex flex-col gap-1 items-start transform transition-transform group-hover:translate-x-1 duration-500 delay-200 w-[90%]">
                   <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full border-2 border-black bg-green-200 flex items-center justify-center text-[10px] font-bold">H</div>
                      <span class="text-xs font-bold text-gray-500">Healer</span>
                   </div>
                   <div class="bg-white border-2 border-black rounded-2xl rounded-tl-none p-3 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                      <div class="h-2 w-full bg-gray-200 rounded-full text-xs text-gray-400">👋 Welcome to the family!</div>
                   </div>
                </div>

                <!-- Message 4 (Right) -->
                <div class="hidden md:flex flex-col gap-1 items-end self-end transform transition-transform group-hover:-translate-x-1 duration-500 delay-300 w-[80%] ml-auto">
                   <div class="bg-purple-100 border-2 border-black rounded-2xl rounded-tr-none p-3 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                      <div class="h-2 w-36 bg-purple-200 rounded-full mb-2"></div>
                      <div class="h-2 w-28 bg-purple-200/70 rounded-full"></div>
                   </div>
                </div>

                <!-- Message 5 (Left) -->
                <div class="hidden md:flex flex-col gap-1 items-start transform transition-transform group-hover:translate-x-1 duration-500 delay-400 w-[88%]">
                   <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full border-2 border-black bg-yellow-200 flex items-center justify-center text-[10px] font-bold">D</div>
                      <span class="text-xs font-bold text-gray-500">DPS</span>
                   </div>
                   <div class="bg-white border-2 border-black rounded-2xl rounded-tl-none p-3 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                      <div class="h-2 w-40 bg-gray-200 rounded-full mb-2"></div>
                      <div class="h-2 w-28 bg-gray-100 rounded-full"></div>
                   </div>
                </div>
             </div>
             
             <!-- Decorative Background Patterns -->
             <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 16px 16px;">
             </div>
        </div>
        
        <!-- Content -->
        <div class="p-6 bg-transparent z-20 relative">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 border-black bg-pink-100 mb-4 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
             <UIcon name="i-lucide-heart" class="w-6 h-6 text-black" />
          </div>
          <h3 class="font-heading font-black text-2xl uppercase mb-2">Unmatched Friendliness</h3>
          <p class="text-gray-600 font-medium leading-relaxed">
            A toxicity-free environment where veterans and new players alike find a warm welcome and supportive family.
          </p>
        </div>
      </div>

      <!-- AOTC Raiding -->
      <div class="group relative rounded-3xl bg-orange-100/70 flex flex-col overflow-hidden transition-colors">
         <!-- UI Mockup: Achievement -->
         <div class="flex-1 bg-white/40 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent">
            <div class="relative transform group-hover:scale-110 transition-transform duration-300">
                <!-- Toast Card -->
                <div class="flex items-center gap-4 bg-white border-2 border-black rounded-full px-5 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                   <div class="w-10 h-10 rounded-full bg-yellow-300 border-2 border-black flex items-center justify-center">
                      <UIcon name="i-lucide-trophy" class="w-5 h-5 text-black" />
                   </div>
                   <div class="flex flex-col">
                      <span class="text-[10px] font-black uppercase text-gray-500 tracking-wider">Achievement Unlocked</span>
                      <span class="text-sm font-bold">Ahead of the Curve</span>
                   </div>
                </div>
                <!-- Particles -->
                <UIcon name="i-lucide-sparkles" class="absolute -top-6 -right-4 w-6 h-6 text-yellow-500 animate-pulse" />
                <UIcon name="i-lucide-star" class="absolute -bottom-4 -left-2 w-4 h-4 text-orange-400 animate-bounce" />
            </div>
         </div>
         
         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2">AOTC Raiding</h3>
            <p class="text-gray-600 font-medium text-sm">
               Consistent Heroic clears on a relaxed 2-night schedule.
            </p>
         </div>
      </div>

      <!-- M+ Groups -->
      <div class="group relative rounded-3xl bg-blue-100/70 flex flex-col overflow-hidden transition-colors">
         <!-- UI Mockup: Keys -->
         <div class="flex-1 bg-white/40 p-6 flex flex-col justify-center gap-3 relative overflow-hidden">
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/50 to-transparent pointer-events-none z-10"></div>
            
            <!-- Key 1 -->
            <div class="flex items-center gap-3 bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] transform translate-x-4 group-hover:translate-x-0 transition-transform duration-300">
                <div class="w-8 h-8 rounded bg-blue-200 border-2 border-black flex items-center justify-center font-black text-xs">13</div>
                <span class="font-bold text-sm truncate">Ara-Kara</span>
            </div>
             <!-- Key 2 -->
            <div class="flex items-center gap-3 bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] transform translate-x-8 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                <div class="w-8 h-8 rounded bg-purple-200 border-2 border-black flex items-center justify-center font-black text-xs">9</div>
                <span class="font-bold text-sm truncate">City of Threads</span>
            </div>
             <!-- Key 3 -->
            <div class="flex items-center gap-3 bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] transform translate-x-12 group-hover:translate-x-4 transition-transform duration-300 delay-150">
                <div class="w-8 h-8 rounded bg-gray-200 border-2 border-black flex items-center justify-center font-black text-xs text-gray-500">?</div>
                <span class="font-bold text-sm truncate text-gray-500">Grim Batol</span>
            </div>
         </div>
         
         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2">M+ Groups</h3>
            <p class="text-gray-600 font-medium text-sm">
               Daily keys ranging from KSM to high push levels.
            </p>
         </div>
      </div>

       <!-- Weekly Streams -->
      <div class="group relative rounded-3xl bg-purple-100/70 flex flex-col overflow-hidden transition-colors">
         <!-- UI Mockup: Stream Card -->
         <div class="flex-1 bg-white/40 p-6 flex items-center justify-center">
             <div class="relative bg-white border-2 border-black rounded-xl p-4 w-full max-w-[220px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <div class="flex items-center justify-between mb-3">
                   <span class="text-[10px] font-black uppercase text-purple-600">Weekly Stream</span>
                   <span class="text-[10px] font-black uppercase text-gray-500">Live</span>
                </div>
                <div class="text-center border-2 border-dashed border-gray-200 rounded-lg p-3">
                   <div class="text-lg font-black leading-tight mb-2">Raid Night Recap</div>
                   <div class="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded">Friday 9PM</div>
                </div>
                <div class="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500">
                   <span class="h-2 w-2 rounded-full bg-red-500"></span>
                   <span>Streaming on Twitch</span>
                </div>
             </div>
         </div>
         
         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2">Weekly Streams</h3>
            <p class="text-gray-600 font-medium text-sm">
               Catch weekly raid recaps, highlights, and chill hangouts.
            </p>
         </div>
      </div>


      <!-- Cats -->
      <div class="group relative rounded-3xl bg-red-100/70 flex flex-col overflow-hidden transition-colors">
         <!-- UI Mockup: Avatars -->
         <div class="flex-1 bg-white/40 p-6 flex items-center justify-center">
             <div class="flex -space-x-4 items-center pl-4">
                <div class="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl relative z-30 transform hover:-translate-y-2 transition-transform duration-300 shadow-sm">🐱</div>
                <div class="w-14 h-14 rounded-full border-2 border-black bg-orange-100 flex items-center justify-center text-2xl relative z-20 transform hover:-translate-y-2 transition-transform duration-300 delay-75 shadow-sm">🐈</div>
                <div class="w-14 h-14 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center text-2xl relative z-10 transform hover:-translate-y-2 transition-transform duration-300 delay-150 shadow-sm">🐈‍⬛</div>
                <div class="w-12 h-12 rounded-full border-2 border-black bg-black text-white flex items-center justify-center text-xs font-bold relative z-0">+12</div>
             </div>
         </div>
         
         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2">We Love Cats</h3>
            <p class="text-gray-600 font-medium text-sm">
              50% strategy, 50% cat photos. It's basically a requirement.
            </p>
         </div>
      </div>

    </div>
  </UContainer>
</template>

<script setup lang="ts">
// No script needed for this static layout yet
</script>

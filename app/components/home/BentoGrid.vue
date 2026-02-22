<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[minmax(320px,auto)]">

      <!-- Friendliness (Tall, Left) -->
      <div class="md:row-span-2 group relative rounded-3xl border-2 border-black dark:border-stone-600 bg-pink-100/70 dark:bg-pink-950/40 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <!-- UI Mockup: Chat -->
        <div class="flex-1 bg-white/40 dark:bg-white/5 relative overflow-hidden p-6 flex flex-col justify-end">
             <div class="space-y-4 w-full relative z-10">
                <!-- Message 1 (Left) -->
                <div class="flex flex-col gap-1 items-start transform transition-transform group-hover:translate-x-1 duration-500 w-[90%]">
                   <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full border-2 border-black bg-pink-200 dark:bg-pink-300 flex items-center justify-center text-[10px] font-bold">GM</div>
                      <span class="text-xs font-bold text-gray-500 dark:text-stone-400">Guild Master</span>
                   </div>
                   <div class="bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-2xl rounded-tl-none p-3 shadow-xs">
                      <div class="h-2 w-32 bg-gray-200 dark:bg-stone-700 rounded-full mb-2"></div>
                      <div class="h-2 w-48 bg-gray-100 dark:bg-stone-600 rounded-full"></div>
                   </div>
                </div>

                <!-- Message 2 (Right) -->
                 <div class="flex flex-col gap-1 items-end self-end transform transition-transform group-hover:-translate-x-1 duration-500 delay-100 w-[85%] ml-auto">
                   <div class="bg-blue-100 dark:bg-blue-900/40 border-2 border-black dark:border-stone-500 rounded-2xl rounded-tr-none p-3 shadow-xs">
                      <div class="h-2 w-40 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                   </div>
                </div>

                 <!-- Message 3 (Left) -->
                <div class="flex flex-col gap-1 items-start transform transition-transform group-hover:translate-x-1 duration-500 delay-200 w-[90%]">
                   <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full border-2 border-black bg-green-200 dark:bg-green-300 flex items-center justify-center text-[10px] font-bold">H</div>
                      <span class="text-xs font-bold text-gray-500 dark:text-stone-400">Healer</span>
                   </div>
                   <div class="bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-2xl rounded-tl-none p-3 shadow-xs">
                      <span class="text-xs text-gray-600 dark:text-stone-300">Welcome to the family!</span>
                   </div>
                </div>

                <!-- Message 4 (Right) -->
                <div class="hidden md:flex flex-col gap-1 items-end self-end transform transition-transform group-hover:-translate-x-1 duration-500 delay-300 w-[80%] ml-auto">
                   <div class="bg-purple-100 dark:bg-purple-900/30 border-2 border-black dark:border-stone-500 rounded-2xl rounded-tr-none p-3 shadow-xs">
                      <div class="h-2 w-36 bg-purple-200 dark:bg-purple-800 rounded-full mb-2"></div>
                      <div class="h-2 w-28 bg-purple-200 dark:bg-purple-800 rounded-full"></div>
                   </div>
                </div>

                <!-- Message 5 (Left) -->
                <div class="hidden md:flex flex-col gap-1 items-start transform transition-transform group-hover:translate-x-1 duration-500 delay-400 w-[88%]">
                   <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full border-2 border-black bg-yellow-200 dark:bg-yellow-300 flex items-center justify-center text-[10px] font-bold">D</div>
                      <span class="text-xs font-bold text-gray-500 dark:text-stone-400">DPS</span>
                   </div>
                   <div class="bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-2xl rounded-tl-none p-3 shadow-xs">
                      <div class="h-2 w-40 bg-gray-200 dark:bg-stone-700 rounded-full mb-2"></div>
                      <div class="h-2 w-28 bg-gray-100 dark:bg-stone-600 rounded-full"></div>
                   </div>
                </div>
             </div>

             <!-- Decorative Background Patterns -->
             <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
                  style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 16px 16px;">
             </div>
        </div>

        <!-- Content -->
        <div class="p-6 bg-transparent z-20 relative">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 border-black dark:border-stone-500 bg-pink-200 dark:bg-pink-900/50 mb-4 shadow-sm">
             <UIcon name="i-lucide-heart" class="w-6 h-6 text-black dark:text-stone-100" />
          </div>
          <h3 class="font-heading font-black text-2xl uppercase mb-2 text-gray-900 dark:text-stone-100">Unmatched Friendliness</h3>
          <p class="text-gray-600 dark:text-stone-400 font-medium leading-relaxed">
            A toxicity-free environment where veterans and new players alike find a warm welcome and supportive family.
          </p>
        </div>
      </div>

      <!-- AOTC Raiding -->
      <div class="group relative rounded-3xl border-2 border-black dark:border-stone-600 bg-orange-100/70 dark:bg-orange-950/30 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
         <!-- UI Mockup: Achievement -->
         <div class="flex-1 bg-white/40 dark:bg-white/5 flex items-center justify-center p-6">
            <div class="relative transform group-hover:scale-110 transition-transform duration-300">
                <!-- Toast Card -->
                <div class="flex items-center gap-4 bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-full px-5 py-3 shadow-md">
                   <div class="w-10 h-10 rounded-full bg-yellow-300 dark:bg-yellow-400 border-2 border-black flex items-center justify-center">
                      <UIcon name="i-lucide-trophy" class="w-5 h-5 text-black" />
                   </div>
                   <div class="flex flex-col">
                      <span class="text-[10px] font-black uppercase text-gray-500 dark:text-stone-400 tracking-wider">Achievement Unlocked</span>
                      <span class="text-sm font-bold text-gray-900 dark:text-stone-100">Ahead of the Curve</span>
                   </div>
                </div>
                <!-- Particles -->
                <UIcon name="i-lucide-sparkles" class="absolute -top-6 -right-4 w-6 h-6 text-yellow-500 animate-pulse" />
                <UIcon name="i-lucide-star" class="absolute -bottom-4 -left-2 w-4 h-4 text-orange-400 animate-bounce" />
            </div>
         </div>

         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-stone-100">AOTC Raiding</h3>
            <p class="text-gray-600 dark:text-stone-400 font-medium text-sm">
               Consistent Heroic clears on a relaxed 2-night schedule.
            </p>
         </div>
      </div>

      <!-- M+ Groups -->
      <div class="group relative rounded-3xl border-2 border-black dark:border-stone-600 bg-blue-100/70 dark:bg-blue-950/30 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
         <!-- UI Mockup: Keys -->
         <div class="flex-1 bg-white/40 dark:bg-white/5 p-6 flex flex-col justify-center gap-3 relative overflow-hidden">
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/50 dark:from-stone-900/50 to-transparent pointer-events-none z-10"></div>

            <!-- Key 1 -->
            <div class="flex items-center gap-3 bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-lg p-2 shadow-xs transform translate-x-4 group-hover:translate-x-0 transition-transform duration-300">
                <div class="w-8 h-8 rounded bg-blue-200 dark:bg-blue-800 border-2 border-black dark:border-stone-500 flex items-center justify-center font-black text-xs text-gray-900 dark:text-stone-100">13</div>
                <span class="font-bold text-sm truncate text-gray-900 dark:text-stone-100">Ara-Kara</span>
            </div>
             <!-- Key 2 -->
            <div class="flex items-center gap-3 bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-lg p-2 shadow-xs transform translate-x-8 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                <div class="w-8 h-8 rounded bg-purple-200 dark:bg-purple-800 border-2 border-black dark:border-stone-500 flex items-center justify-center font-black text-xs text-gray-900 dark:text-stone-100">9</div>
                <span class="font-bold text-sm truncate text-gray-900 dark:text-stone-100">City of Threads</span>
            </div>
             <!-- Key 3 -->
            <div class="flex items-center gap-3 bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-lg p-2 shadow-xs transform translate-x-12 group-hover:translate-x-4 transition-transform duration-300 delay-150">
                <div class="w-8 h-8 rounded bg-gray-200 dark:bg-stone-700 border-2 border-black dark:border-stone-500 flex items-center justify-center font-black text-xs text-gray-500 dark:text-stone-400">?</div>
                <span class="font-bold text-sm truncate text-gray-500 dark:text-stone-400">Grim Batol</span>
            </div>
         </div>

         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-stone-100">M+ Groups</h3>
            <p class="text-gray-600 dark:text-stone-400 font-medium text-sm">
               Daily keys ranging from KSM to high push levels.
            </p>
         </div>
      </div>

       <!-- Weekly Streams -->
      <div class="group relative rounded-3xl border-2 border-black dark:border-stone-600 bg-purple-100/70 dark:bg-purple-950/30 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
         <!-- UI Mockup: Stream Card -->
         <div class="flex-1 bg-white/40 dark:bg-white/5 p-6 flex items-center justify-center">
             <div class="relative bg-white dark:bg-stone-800 border-2 border-black dark:border-stone-500 rounded-xl p-4 w-full max-w-[220px] shadow-md transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <div class="flex items-center justify-between mb-3">
                   <span class="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">Weekly Stream</span>
                   <span class="flex items-center gap-1 text-[10px] font-black uppercase text-red-500">
                     <span class="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                     Live
                   </span>
                </div>
                <div class="text-center border-2 border-dashed border-gray-200 dark:border-stone-600 rounded-lg p-3">
                   <div class="text-lg font-black leading-tight mb-2 text-gray-900 dark:text-stone-100">Raid Night Recap</div>
                   <div class="inline-block bg-black dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold px-2 py-1 rounded">Friday 9PM</div>
                </div>
                <div class="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 dark:text-stone-400">
                   <span>Streaming on Twitch</span>
                </div>
             </div>
         </div>

         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-stone-100">Weekly Streams</h3>
            <p class="text-gray-600 dark:text-stone-400 font-medium text-sm">
               Catch weekly raid recaps, highlights, and chill hangouts.
            </p>
         </div>
      </div>


      <!-- Cats -->
      <div class="group relative rounded-3xl border-2 border-black dark:border-stone-600 bg-red-100/70 dark:bg-red-950/30 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
         <!-- UI Mockup: Avatars -->
         <div class="flex-1 bg-white/40 dark:bg-white/5 p-6 flex items-center justify-center">
             <div class="flex -space-x-4 items-center pl-4">
                <div class="w-14 h-14 rounded-full border-2 border-black bg-white dark:bg-stone-800 flex items-center justify-center text-2xl relative z-30 transform hover:-translate-y-2 transition-transform duration-300 shadow-xs">🐱</div>
                <div class="w-14 h-14 rounded-full border-2 border-black bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-2xl relative z-20 transform hover:-translate-y-2 transition-transform duration-300 delay-75 shadow-xs">🐈</div>
                <div class="w-14 h-14 rounded-full border-2 border-black bg-gray-100 dark:bg-stone-700 flex items-center justify-center text-2xl relative z-10 transform hover:-translate-y-2 transition-transform duration-300 delay-150 shadow-xs">🐈‍⬛</div>
                <div class="w-12 h-12 rounded-full border-2 border-black bg-black dark:bg-stone-200 text-white dark:text-stone-900 flex items-center justify-center text-xs font-bold relative z-0">+12</div>
             </div>
         </div>

         <div class="p-6">
            <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-stone-100">We Love Cats</h3>
            <p class="text-gray-600 dark:text-stone-400 font-medium text-sm">
              50% strategy, 50% cat photos. It's basically a requirement.
            </p>
         </div>
      </div>

    </div>
</template>

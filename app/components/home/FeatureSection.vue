<template>
  <UContainer>
    <div class="grid grid-cols-3 gap-4">
      <UCard variant="soft" as="article">
        <div class="space-y-2">
          <img src="/goblin.png"
            class="h-64 object-cover rounded-md grayscale hover:grayscale-0 transition duration-300 ease-in-out mask-b-from-40% mask-b-to-90%" />
          <p class="font-mono text-sm leading-tight">We are a Heroic (AOTC) guild that raids twice a week.</p>
          <h3 class="uppercase font-extrabold text-xl tracking-widest">Raiding</h3>
        </div>
      </UCard>
      <UCard variant="soft" as="article">
        <div class="space-y-2">
          <img src="/war_within.png"
            class="h-64 object-cover rounded-md grayscale hover:grayscale-0 transition duration-300 ease-in-out mask-b-from-40% mask-b-to-90%" />
          <p class="font-mono text-sm leading-tight">Multiple groups running keys weekly, come find your next KSM
            pushers.</p>
          <h3 class="uppercase font-extrabold text-xl tracking-widest">Mythic+</h3>
        </div>
      </UCard>
      <UCard variant="soft" as="article">
        <img src="/war_within.png"
          class="h-64 object-cover rounded-md grayscale hover:grayscale-0 transition duration-300 ease-in-out mask-b-from-40% mask-b-to-90%" />
        <div class="space-y-2 pt-4">
          <p class="font-mono text-sm leading-tight">We're fun, friendly and even sometimes meet
            in real-life!</p>
          <h3 class="uppercase font-extrabold text-xl tracking-widest">Community</h3>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

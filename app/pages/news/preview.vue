<script setup lang="ts">
// Mock data — simulates a Prismic news post about The War Within: Midnight
const mockPost = {
  title: "The War Within: Midnight — What We Know So Far",
  date: "February 24, 2026",
  tag: "Expansion",
  image:
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt3452e3b114fab0cd/blt1ddc0a3afb84edd7/68954c39d4551600a01680be/Opengraph_Snacks_ENUS.jpg",
};

const galleryImages = [
  {
    url: "https://i.redd.it/z690htumeleg1.jpeg",
    alt: "Midnight Quel'Thalas zone art",
    caption: "The shattered streets of Silvermoon",
  },
  {
    url: "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/33/333FZSZTWBKX1755721739173.png",
    alt: "New dungeon entrance",
    caption: "The Sunwell Plateau reimagined",
  },
  {
    url: "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/33/333FZSZTWBKX1755721739173.png",
    alt: "The Midnight raid",
    caption: "A glimpse at the new raid tier",
  },
];
</script>

<template>
  <div class="min-h-screen pb-24 relative z-10">
    <div class="pt-40 md:pt-52 px-4">
      <article class="max-w-4xl mx-auto flex flex-col gap-16">
        <div class="space-y-6">
          <!-- Back link -->
          <NuxtLink
            to="/news"
            class="inline-flex items-center gap-2 font-black uppercase text-sm text-gray-400 hover:text-pink-400 transition-colors"
          >
            <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            Back to News
          </NuxtLink>

          <!-- 1. NewsHero -->
          <NewsHero
            :title="mockPost.title"
            :date="mockPost.date"
            :image="mockPost.image"
            image-alt="Midnight expansion key art"
            :tag="mockPost.tag"
          />
        </div>

        <!-- 2. NewsTextCard (default variant) -->
        <NewsTextCard>
          <h2 class="text-4xl font-black uppercase tracking-tight pb-4">
            A New Chapter Begins
          </h2>
          <p>
            <strong>The War Within: Midnight</strong> is the second chapter of
            the Worldsoul Saga, taking us back to the shattered kingdom of
            Quel'Thalas. The void has consumed the Sunwell, and it falls on
            Azeroth's champions to reclaim the homeland of the blood elves and
            high elves alike.
          </p>
          <p>
            With the expansion comes a level cap increase to 90, a brand-new
            raid tier set in the corrupted Sunwell Plateau, and four new Mythic+
            dungeons that promise to push even the most seasoned players to
            their limits.
          </p>
        </NewsTextCard>

        <!-- 3. NewsQuote -->
        <NewsQuote
          quote="We are NOT ready for this raid tier. But we're going in anyway."
          author="Qbeans"
          role="Guild Master, EiF"
        />

        <!-- 4. NewsTextCard (highlight variant) -->
        <NewsTextCard variant="highlight">
          <h2 class="text-4xl font-black uppercase tracking-tight pb-4">
            Guild Prep: What EIF Is Doing
          </h2>
          <p>
            Raid signups open the week of launch. We're running split raids for
            the first two weeks to gear up fast. If you're not geared from
            Mythic+ by then — that's your problem, nerd.
          </p>
          <p>
            Our M+ squad is also prepping strats for the four new dungeons.
            Expect required reading in Discord before the first push week. Yes,
            there will be a quiz.
          </p>
        </NewsTextCard>

        <!-- 5. NewsImageGallery -->
        <NewsImageGallery :images="galleryImages" :columns="3" />

        <!-- 6. NewsCallToAction -->
        <NewsCallToAction
          heading="Ready to raid Midnight?"
          text="Drop an application and join EIF before launch day. Spots are limited."
          button-label="Drop an App"
          button-link="/apply"
          color="bg-pink-400"
        />

        <!-- Back to news -->
        <div class="mt-8 pt-8 border-t-4 border-black">
          <NuxtLink
            to="/news"
            class="inline-flex items-center gap-2 bg-white text-black font-black uppercase px-6 py-3 border-4 border-black hover:bg-pink-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            All News
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

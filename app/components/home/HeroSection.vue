<template>
    <UContainer>
        <div class="max-w-2xl flex flex-row justify-start items-start">
            <div class="space-y-4">
                <h2 class="text-6xl font-bold max-w-xl leading-16">The <span class="text-pink-500">Friendliest</span>
                    Guild on
                    US-Illidan</h2>
                <p class="font-mono text-neutral-500">We’re a fun, friendly, and inclusive World of Warcraft guild on
                    the
                    US-Illidan
                    server!
                    Our diverse group
                    of friends has been adventuring together for years, and we’re always excited to welcome new members.
                    We're currently raiding in The War Within and would love for you to join our ranks — whether you're
                    a
                    seasoned raider or just looking for a chill group to hang out with. Come be part of our community
                    and
                    share in the adventure!</p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                    <UButton size="xl" @click="useJoinModal().open()">Join Us</UButton>
                    <UButton size="xl" variant="outline" to="/roster">View Roster <span aria-hidden="true">→</span>
                    </UButton>
                </div>
            </div>
        </div>
        <!-- <img src="/Anduin.jpg" alt="Anduin" /> -->
    </UContainer>
</template>
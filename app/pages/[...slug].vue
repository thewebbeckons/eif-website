<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('content').path(route.path).first()
})
</script>

<template>
    <template v-if="page">
        <UContainer class="py-24 sm:py-32 md:py-40 relative">
            <ContentRenderer :value="page" />
        </UContainer>
    </template>
    <template v-else>
        <div class="empty-page">
            <h1>Page Not Found</h1>
            <p>Oops! The content you're looking for doesn't exist.</p>
            <NuxtLink to="/">Go back home</NuxtLink>
        </div>
    </template>
</template>

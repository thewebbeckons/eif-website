<script setup lang="ts">
const { isOpen, close } = useJoinModal()

const form = reactive({
    name: '',
    email: '',
    message: ''
})

const onSubmit = () => {
    console.log('Form submitted:', form)
    close()
}
</script>

<template>
    <UModal v-model:open="isOpen" title="Join Us" description="Interested in joining? Fill out the form below.">
        <template #body>
            <UForm :state="form" class="space-y-4" @submit="onSubmit">
                <UFormField label="Character Name" name="name">
                    <UInput v-model="form.name" placeholder="Your character name" />
                </UFormField>

                <UFormField label="Battle.net Tag / Discord" name="email">
                    <UInput v-model="form.email" placeholder="Name#1234" />
                </UFormField>

                <UFormField label="Message" name="message">
                    <UTextarea v-model="form.message" placeholder="Tell us about yourself..." />
                </UFormField>

                <div class="flex justify-end gap-2 mt-6">
                    <UButton color="neutral" variant="ghost" @click="close">Cancel</UButton>
                    <UButton type="submit" color="primary">Submit Application</UButton>
                </div>
            </UForm>
        </template>
    </UModal>
</template>

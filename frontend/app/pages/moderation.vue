<script setup lang="ts">
import { useCategories } from '../composables/moderation/categories'

const { categoryName } = useCategories()
const route = useRoute()
onMounted(() => {
  if (route.path.match(/^\/moderation\/?$/)) {
    navigateTo('/moderation/overview')
  }
})

const pageName = computed(() => {
  if (route.meta.title)
    return route.meta.title

  if (route.params.category)
    return `- Actions for ${categoryName(route.params.category as string)}`

  return ''
})
</script>

<template>
  <div class="overflow-x-auto border-base-content/5 p-4 bg-base-300 rounded-box">
    <div class="flex flex-row items-center justify-start bg-primary p-2 mb-4 rounded-box">
      <div
        v-if="$route.path !== '/moderation/overview'"
        class="text-primary-content mr-4 flex items-center gap-2 justify-center cursor-pointer"
        @click="$router.back()"
      >
        <iconify-icon icon="mdi:arrow-left" /> Back
      </div>
      <h1 class="text-xl font-bold">
        Moderation Plugin {{ pageName }}
      </h1>
    </div>
    <NuxtPage />
  </div>
</template>

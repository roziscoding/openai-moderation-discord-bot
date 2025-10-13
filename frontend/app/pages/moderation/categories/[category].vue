<script setup lang="ts">
import type { CategoryConfig } from '../../../composables/moderation/categories'
import ActionPannel from '../../../components/moderation/action-pannel.vue'
import { useAuth } from '../../../composables/auth'
import { useCategories } from '../../../composables/moderation/categories'

const {
  organizationMetadata,
} = useAuth()

const route = useRoute()
const category = (Array.isArray(route.params.category) ? route.params.category[0] : route.params.category)!
const config = computed(() => {
  return organizationMetadata.value?.config?.plugins?.moderation ?? undefined
})

const { actionsByCategory } = useCategories(config)
const categoryConfig = actionsByCategory.value.get(category) ?? {} as CategoryConfig
</script>

<template>
  <div>
    <template v-for="action in categoryConfig.actions" :key="action.action">
      <ActionPannel :action="action.action" />
    </template>
  </div>
</template>

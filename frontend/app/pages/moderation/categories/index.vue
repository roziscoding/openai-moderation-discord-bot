<script setup lang="ts">
import { useAuth } from '~/composables/auth'
import { useActions } from '../../../composables/moderation/actions'
import { useCategories } from '../../../composables/moderation/categories'

definePageMeta({
  title: '- Actions',
})

const { organizationMetadata } = useAuth()
const config = computed(() => {
  return organizationMetadata.value?.config?.plugins?.moderation ?? undefined
})
const { actionsByCategory } = useCategories(config)
const { getAction } = useActions()

const colors = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-neutral', 'badge-info', 'badge-success', 'badge-warning', 'badge-error']
function getColor(index: number) {
  // Always return the color at the (index modulo length) position, wrapping around if overflow
  const color = colors[index % colors.length]
  return color
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="{ name, category, actions, slug } in actionsByCategory.values()"
        :key="category"
        class="hover:bg-base-content/5 cursor-pointer"
        @click="navigateTo(`/moderation/categories/${slug}`)"
      >
        <td class="capitalize w-[30%]">
          {{ name }}
        </td>
        <td v-if="actions.length > 0">
          <template v-for="(action, index) in actions" :key="action">
            <div class="tooltip">
              <div class="tooltip-content p-2">
                {{ getAction(action.action).description }}
              </div>
              <div :class="`badge ${getColor(index)} mr-2`">
                {{ getAction(action.action).name }}
              </div>
            </div>
          </template>
        </td>
        <td v-else>
          <div class="badge badge-neutral">
            None
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

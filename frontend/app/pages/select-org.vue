<script setup lang="ts">
import { useAuth } from '../composables/auth'

definePageMeta({
  layout: false,
})

const {
  activeOrganization,
  orgs,
  setActiveOrganization,
} = useAuth()

onMounted(() => {
  if (activeOrganization.value.data) {
    navigateTo('/')
  }
})

function selectOrg(orgId: string) {
  setActiveOrganization(orgId)
  navigateTo('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <ul class="list w-lg bg-base-200 rounded-box p-4 card gap-4">
      <li class="text-center text-lg text-primary-content">
        Select a guild to continue
      </li>
      <li
        v-for="org in orgs.data"
        :key="org.id"
        class="flex p-4 gap-4 hover:bg-base-300 cursor-pointer rounded-box bg-base-100 items-center"
        @click="selectOrg(org.id)"
      >
        <img class="size-18 rounded-box" :src="org.logo ?? ''">
        {{ org.name }}
      </li>
    </ul>
  </div>
</template>

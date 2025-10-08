<script setup lang="ts">
import { useAuth } from '../../composables/auth'

const {
  activeOrganization,
  orgs,
  setActiveOrganization,
} = useAuth()

const otherOrgs = computed(() => {
  return orgs.value.data?.filter(org => org.id !== activeOrganization.value.data?.id) ?? []
})
</script>

<template>
  <div>
    <div class="dropdown">
      <div class="btn btn-ghost p-2" tabindex="0">
        <div class="flex items-center gap-2">
          <div class="avatar w-10">
            <div class="rounded-full">
              <img v-if="activeOrganization.data?.logo" :src="activeOrganization.data?.logo ?? ''">
              <div v-else class="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center text-lg text-black">
                {{ activeOrganization.data?.name?.charAt(0) }}
              </div>
            </div>
          </div>
          <span class="text-lg">{{ activeOrganization.data?.name ?? 'Select Organization' }}</span>
        </div>
      </div>
      <ul class="dropdown-content menu bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow" tabindex="0">
        <li v-for="org in otherOrgs" :key="org.id">
          <div class="flex items-center" @click="setActiveOrganization(org.id)">
            <div class="avatar w-10">
              <div class="rounded-full">
                <img v-if="org.logo" :src="org.logo ?? ''">
                <div v-else class="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center text-lg text-black">
                  {{ org.name?.charAt(0) }}
                </div>
              </div>
            </div>
            <div>{{ org.name }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

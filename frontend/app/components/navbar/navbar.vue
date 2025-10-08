<script setup lang="ts">
import { useAuth } from '../../composables/auth'
import OrgMenu from './org-menu.vue'
import UserMenu from './user-menu.vue'

const {
  hasOrgs,
} = useAuth()
</script>

<template>
  <div class="navbar bg-base-200 shadow-sm">
    <div v-if="hasOrgs" class="navbar-start">
      <OrgMenu />
    </div>
    <div class="navbar-end flex-none">
      <UserMenu />
    </div>
  </div>
</template>

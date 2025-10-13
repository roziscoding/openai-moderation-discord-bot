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
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
        </div>
        <NavbarNavLinks vertical />
      </div>
      <OrgMenu v-if="hasOrgs" />
    </div>
    <div class="navbar-center hidden lg:flex">
      <NavbarNavLinks />
    </div>
    <div class="navbar-end">
      <UserMenu />
    </div>
  </div>
</template>

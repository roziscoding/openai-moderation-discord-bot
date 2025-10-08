<script setup lang="ts">
import OrgMenu from './org-menu.vue'
import UserMenu from './user-menu.vue'
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <OrgMenu />
    </div>
    <div class="navbar-end flex-none">
      <UserMenu />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/auth'

const {
  isSignedIn,
} = useAuth()
</script>

<template>
  <template v-if="isSignedIn">
    <Navbar />
    <div class="p-4">
      <NuxtPage />
    </div>
  </template>
  <template v-else>
    <LoginHero />
  </template>
</template>

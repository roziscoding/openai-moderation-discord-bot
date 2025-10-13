<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">
      Some info about the bot
    </h1>
    <p class="text-lg">
      Some info about the bot
    </p>
    <NuxtLink class="btn btn-primary" to="/login">
      Get Started
    </NuxtLink>
  </div>
</template>

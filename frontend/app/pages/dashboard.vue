<script setup lang="ts">
const route = useRoute()
if (route.path.match(/^\/dashboard\/?$/)) {
  navigateTo('/moderation')
}

const activeRoute = ref<string>('moderation')
watch(activeRoute, () => {
  navigateTo(`/${activeRoute.value}`)
})
</script>

<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>

<script setup lang="ts">
import LoginHero from '~/components/login/login-hero.vue'
import { useAuth } from '~/composables/auth'
import { useRedirect } from '~/composables/redirect'

definePageMeta({
  layout: false,
})

const { redirect } = useRedirect('/dashboard')

const {
  isSignedIn,
  activeOrganization,
} = useAuth()

onMounted(() => {
  if (isSignedIn && activeOrganization.value.data?.id) {
    navigateTo(redirect.value)
  }

  if (isSignedIn && !activeOrganization.value.data?.id) {
    navigateTo({ path: '/select-org', query: { redirect: redirect.value } })
  }
})
</script>

<template>
  <LoginHero />
</template>

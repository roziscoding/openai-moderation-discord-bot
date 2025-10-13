<script setup lang="ts">
import { useRedirect } from '~/composables/redirect'
import { useAuth } from '../../composables/auth'

const {
  signIn,
} = useAuth()

const { redirect } = useRedirect('/select-org')
</script>

<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          Hello there
        </h1>
        <p class="py-6 text-lg">
          To get started <span class="text-primary">automatically</span> moderating your Discord server, sign in with your Discord account.
        </p>
        <button class="btn btn-primary items-center justify-center gap-2 text-xl" @click="signIn(redirect)">
          <iconify-icon icon="ic:baseline-discord" width="24" height="24" /> Login with Discord
        </button>
      </div>
    </div>
  </div>
</template>

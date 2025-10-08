<script setup lang="ts">
import Navbar from './components/navbar/navbar.vue'
import { useAuth } from './composables/auth'

const {

  isSignedIn,
  signIn,
} = useAuth()
</script>

<template>
  <div>
    <template v-if="isSignedIn">
      <Navbar />
    </template>
    <template v-else>
      <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">
              Hello there
            </h1>
            <p class="py-6">
              To get started automagically moderating your Discord server, sign in with your Discord account.
            </p>
            <button class="btn btn-primary" @click="signIn()">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/auth'

const {
  session,
  signOut,
} = useAuth()
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost">
      {{ session.data?.user.name }}
      <div class="avatar">
        <div class="w-10 rounded-full">
          <img
            v-if="session.data?.user?.image"
            :alt="session.data?.user?.name ?? ''"
            :src="session.data?.user?.image ?? ''"
          >
        </div>
      </div>
    </div>
    <ul
      tabindex="0"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
      <li>
        <div @click="signOut()">
          Logout
        </div>
      </li>
    </ul>
  </div>
</template>

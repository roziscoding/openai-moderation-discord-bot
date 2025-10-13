<script setup lang="ts">
const props = withDefaults(defineProps<{ vertical?: boolean }>(), { vertical: false })

const menuClasses = computed(() => {
  if (props.vertical) {
    return 'menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
  }

  return 'menu menu-horizontal px-1 gap-2 items-center justify-center'
})
</script>

<template>
  <ul :class="menuClasses">
    <li class="font-bold p-2">
      Plugins:
    </li>
    <li class>
      <NuxtLink to="/moderation/overview" class="menu-active">
        Moderation
      </NuxtLink>
    </li>
    <li class="menu-disabled">
      <NuxtLink>
        Config
      </NuxtLink>
    </li>
  </ul>
</template>

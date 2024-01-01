<script setup>
import { RouterLink, RouterView } from 'vue-router'
defineProps({
  logoSrc: {
    type: String,
    required: false
  }
})
</script>

<template>
  <header>
    <div class="flex h-14 items-center justify-between">
      <div>
        <!-- Content Placeholder -->
      </div>
      <div class="text-3xl font-lexend-deca">
        <RouterLink to="/">
          <font-awesome-icon icon="fa-solid fa-stamp" class="mr-2" />
          <span>Decentralized Timestamping</span>
        </RouterLink>
      </div>
      <div class="text-2xl mx-2">
        <RouterLink to="/about">
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped></style>

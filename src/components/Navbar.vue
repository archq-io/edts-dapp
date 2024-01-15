<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const enableAbout = ref(import.meta.env.VITE_ENABLE_ABOUT == 'true')
</script>

<template>
  <header>
    <div class="flex h-14 items-center justify-between border-b">
      <div class="text-xl md:text-2xl ml-8 font-lexend-deca">
        <RouterLink to="/">
          <font-awesome-icon icon="fa-solid fa-stamp" class="mr-2" />
          <span>Decentralized Timestamping</span>
        </RouterLink>
      </div>
      <div>
        <!-- Content placeholder -->
      </div>
      <div class="text-xl md:text-2xl mr-8">
        <RouterLink v-if="enableAbout" to="/about">
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped></style>

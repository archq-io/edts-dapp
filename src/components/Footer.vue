<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const donationLink = ref(import.meta.env.VITE_DONATION_LINK)
</script>

<template>
  <footer class="mb-2 mt-4">
    <div class="flex h-8 items-center justify-stretch mb-1 md:mb-0">
      <div class="w-full">
        <!-- Content Placeholder -->
      </div>
      <div class="inline-flex items-center justify-center w-full">
        <span class="mr-1 font-lexend-deca text-xs md:text-base">dApp maintained by</span>
        <img src="@/assets/logo.png" class="h-8" />
      </div>
      <div class="inline-flex items-center justify-end w-full">
        <div v-if="donationLink" class="text-xs md:text-sm mr-2">
          <a :href="donationLink" target="_blank">
            <font-awesome-icon class="mr-1" icon="fa-brands fa-ethereum" />
            <span>Donations</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Navbar logo-src="@/assets/logo.png" />
  <RouterView class="flex-auto shrink-0" />
  <Footer class="shrink-0" copyright-year="2024" />
</template>

<style>
html,
body,
#app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  background-color: rgb(250 250 250);
}

@font-face {
  font-family: LexendDeca;
  src: url('@/assets/fonts/LexendDeca-VariableFont_wght.ttf');
}
</style>

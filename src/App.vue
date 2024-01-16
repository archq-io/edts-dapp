<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Navbar logo-src="@/assets/logo.png" />
  <RouterView class="flex-auto shrink-0" />
  <Footer class="shrink-0"/>
</template>

<style>
html,
body,
#app {
  height: 100%;
  background-color: rgb(255 255 255);
}

#app {
  display: flex;
  flex-direction: column;
}

@font-face {
  font-family: LexendDeca;
  src: url('@/assets/fonts/LexendDeca-VariableFont_wght.ttf');
}
</style>

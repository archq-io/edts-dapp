<script setup>
  defineProps(['digest'])
</script>

<template>
  <div>
    <span v-if="digest.string">File digest: {{ digest.string }}</span>
  </div>
</template>

<style scoped></style>

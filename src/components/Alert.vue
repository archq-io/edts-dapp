<script setup>
  const props = defineProps({
    icon: {
      type: String,
      default: 'fa-solid fa-circle-xmark'
    },
    message: {
      type: String,
      required: true
    },
  })
</script>

<template>
  <div class="inline-flex items-center my-1 mx-2 border rounded-md py-1 px-2 bg-red-100 border-red-500 text-lg leading-tight">
    <font-awesome-icon class="mr-1" :icon="icon" />
      <span>{{ message }}</span>
  </div>
</template>

<style scoped></style>

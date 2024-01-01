<script setup>
  import { ref } from 'vue';
  const emit = defineEmits(['fileUpload'])

  const dropboxHighlighted = ref(false);

  function fileDrop(event) {
    event.preventDefault();
    dropboxHighlighted.value = false;
    fileHandler(Array.from(event.dataTransfer.files));
  }

  function fileDragOver(event) {
    event.preventDefault();
    dropboxHighlighted.value = true;
  }

  function fileDragEnter(event) {
    event.preventDefault();
    dropboxHighlighted.value = true;
  }

  function fileDragLeave(event) {
    event.preventDefault();
    dropboxHighlighted.value = false;
  }

  function fileInput(event) {
    fileHandler(Array.from(event.target.files));
  }

  function fileHandler(files) {
    if (files.length == 0) {
      return
    }
    emit('fileUpload', files)
  }
</script>

<template>
  <div>
    <div
      id="dropbox"
      class="w-96 h-32 mb-6 flex justify-center items-center bg-slate-100 outline outline-2 outline-offset-2 outline-dashed rounded-md"
      :class="{ '!bg-slate-200': dropboxHighlighted }"
      @dragover="fileDragOver"
      @dragenter="fileDragEnter"
      @dragleave="fileDragLeave"
      @drop="fileDrop"
    >
      <p>Drop the file here</p>
    </div>
    <input
      class="w-96 text-sm text-slate-500 file:py-2 file:px-4 file:border-0 file:rounded-full file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
      type="file"
      @change="fileInput"
    />
  </div>
</template>

<style scoped></style>

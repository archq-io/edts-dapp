<script setup>
import { reactive } from 'vue'
import { sha256_digest } from '../utils/file.js'
import DragAndDrop from '../components/DragAndDrop.vue'
import EthereumPublishDigest from '../components/EthereumPublishDigest.vue'

let state = reactive({
  file: null,
  digest: {},
});

function processFileUpload(files) {
  if (files.length != 1) {
    return
  }
  state.file = files[0];
  sha256_digest(state.file).then(digest => state.digest = digest)
}
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center mt-10">
      <DragAndDrop @file-upload="processFileUpload" class="m-2" />
      <EthereumPublishDigest :digest="state.digest" class="m-2" />
    </div>
  </main>
</template>

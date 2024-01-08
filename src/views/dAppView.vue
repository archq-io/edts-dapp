<script setup>
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router';
import { sha256_digest } from '@/utils/file.js'
import DragAndDrop from '@/components/DragAndDrop.vue'
import EthereumPublishDigest from '@/components/EthereumPublishDigest.vue'
import Badge from '@/components/Badge.vue'

const route = useRoute();

const embedBadge = ref(false)
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


watch(() => route.params.digest, digest => {
  console.log(digest)
}, { immediate: true })

watch(() => route.query.url, url => {
  if (url) {
    fetch(url).then(response => {
      response.arrayBuffer().then(value => {
        let contentType = response.headers.get('Content-Type')
        let file = new File([value], '', { type: contentType })
        sha256_digest(file).then(digest => state.digest = digest)
        state.file = file
      })
    })
  }
}, { immediate: true })
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center mt-10">
      <DragAndDrop v-if="!state.file" @file-upload="processFileUpload" class="m-2" />
      <button class="inline-flex items-center ml-1 border rounded-md py-1 px-2 hover:bg-gray-200" v-else @click="state.file = null">
        <font-awesome-icon class="mr-1" icon="fa-solid fa-chevron-left" />
        Use another file
      </button>
      <EthereumPublishDigest :digest="state.digest" class="m-2" />
      <button class="inline-flex items-center ml-1 border rounded-md py-1 px-2 hover:bg-gray-200" @click="embedBadge = !embedBadge">
        <span v-if="!embedBadge">Embed a badge</span>
        <span v-else>Hide</span>
      </button>
      <Badge v-if="embedBadge"/>
    </div>
  </main>
</template>

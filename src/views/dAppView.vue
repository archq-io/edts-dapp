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
  urlPresent: false,
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
    state.urlPresent = true
    fetch(url).then(response => {
      response.arrayBuffer().then(value => {
        let contentType = response.headers.get('Content-Type')
        let file = new File([value], '', { type: contentType })
        sha256_digest(file).then(digest => state.digest = digest)
        state.file = file
      })
    })
  } else {
    state.urlPresent = false
  }
}, { immediate: true })
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center mt-6">
      <DragAndDrop v-if="!state.file" @file-upload="processFileUpload" class="m-2" />
      <EthereumPublishDigest v-if="state.file" :digest="state.digest" />
      <Badge v-if="embedBadge"/>
      <div class="flex flex-row justify-center items-center mt-2">
        <button class="inline-flex items-center mx-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" v-if="state.file" @click="state.file = null">
          <font-awesome-icon class="mr-1" icon="fa-solid fa-chevron-left" />
          <span>Use another file</span>
        </button>
        <button v-if="state.urlPresent && state.file" class="inline-flex items-center mx-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" @click="embedBadge = !embedBadge">
          <span v-if="!embedBadge">Embed a badge</span>
          <span v-else>Hide</span>
        </button>
      </div>
    </div>
  </main>
</template>
